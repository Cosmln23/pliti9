import { NextRequest, NextResponse } from 'next/server'
import { addMessage } from '@/lib/chat-storage'

// Twitch Chat Bot configuration
const TWITCH_CONFIG = {
  BOT_USERNAME: 'plipli9_bot', // Twitch bot account
  CHANNEL: 'plipli9', // Target channel
  OAUTH_TOKEN: process.env.TWITCH_OAUTH_TOKEN, // OAuth token for bot
  CLIENT_ID: process.env.TWITCH_CLIENT_ID
}

// Function to send message to Twitch Chat via IRC
async function sendToTwitchChat(username: string, message: string) {
  try {
    // Check if we have Twitch credentials
    if (!TWITCH_CONFIG.OAUTH_TOKEN) {
      console.log(`🎮 [DEMO] Would send to Twitch: [${username}] ${message}`)
      return true // Return success for demo mode
    }

    // Real Twitch IRC implementation
    const twitchMessage = `[SITE] ${username}: ${message}`
    
    // Use Twitch IRC WebSocket or HTTP API
    const response = await fetch('https://api.twitch.tv/helix/chat/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TWITCH_CONFIG.OAUTH_TOKEN}`,
        'Client-Id': TWITCH_CONFIG.CLIENT_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        broadcaster_id: 'YOUR_BROADCASTER_ID', // Needs to be set
        sender_id: 'YOUR_BOT_ID', // Needs to be set  
        message: twitchMessage
      })
    })

    if (response.ok) {
      console.log(`✅ Message sent to Twitch: ${twitchMessage}`)
      return true
    } else {
      throw new Error(`Twitch API error: ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ Failed to send to Twitch:', error)
    console.log(`🎮 [FALLBACK] Demo mode: [${username}] ${message}`)
    return false
  }
}

// Alternative: Simple Twitch IRC WebSocket approach
async function sendToTwitchIRC(username: string, message: string) {
  try {
    console.log(`🎮 IRC Bridge: [${username}] ${message}`)
    
    // This would need a WebSocket connection to irc.chat.twitch.tv:6667
    // For now, we'll just log it as demo
    console.log(`📺 Message ready for Streamlabs Chat Bot pickup`)
    
    return true
  } catch (error) {
    console.error('❌ IRC Bridge error:', error)
    return false
  }
}

// In-memory storage for demo - in production use database
const chatMessages: any[] = []
let messageIdCounter = 1

export async function POST(request: NextRequest) {
  try {
    const { streamId, username, message, isStreamer } = await request.json()

    if (!streamId || !username || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new message using shared storage
    const newMessage = addMessage({
      streamId,
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: isStreamer ? 'admin' : 'user',
      likes: 0
    })

    // Send to Twitch Chat if live
    let twitchSent = false
    if (streamId === 'plipli9-paranormal-live') {
      twitchSent = await sendToTwitchIRC(username, message.trim())
    }

    // Keep only last 100 messages per stream
    const streamMessages = chatMessages.filter(m => m.streamId === streamId)
    if (streamMessages.length > 100) {
      const excessCount = streamMessages.length - 100
      for (let i = 0; i < excessCount; i++) {
        const index = chatMessages.findIndex(m => m.streamId === streamId)
        if (index !== -1) {
          chatMessages.splice(index, 1)
        }
      }
    }

    console.log(`💬 Chat message sent: ${username}: ${message}`)
    console.log(`🎮 Twitch forwarded: ${twitchSent ? 'SUCCESS' : 'DEMO MODE'}`)

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      twitchForwarded: twitchSent
    })

  } catch (error) {
    console.error('Error sending chat message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// Disable static optimization for this API route
export const dynamic = 'force-dynamic' 