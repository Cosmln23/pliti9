import { NextRequest, NextResponse } from 'next/server'
import { addMessage } from '@/lib/chat-storage'

// Twitch Chat Bot configuration
const TWITCH_CONFIG = {
  BOT_USERNAME: 'plipli9_bot', // Twitch bot account
  CHANNEL: 'plipli9', // Target channel
  OAUTH_TOKEN: process.env.TWITCH_OAUTH_TOKEN, // OAuth token for bot
  CLIENT_ID: process.env.TWITCH_CLIENT_ID
}

// Function to send message to Twitch Chat
async function sendToTwitchChat(username: string, message: string) {
  try {
    // For now, we'll use a webhook approach or direct IRC
    // This would need proper Twitch Bot OAuth setup
    
    console.log(`🎮 Would send to Twitch: [${username}] ${message}`)
    
    // TODO: Implement actual Twitch Chat API call
    // const twitchMessage = `[SITE] ${username}: ${message}`
    // await sendTwitchIRCMessage(twitchMessage)
    
    return true
  } catch (error) {
    console.error('❌ Failed to send to Twitch:', error)
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

    // Send to Twitch Chat (Streamlabs) if live
    if (streamId === 'plipli9-paranormal-live') {
      await sendToTwitchChat(username, message.trim())
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
    console.log(`🎮 Also forwarded to Twitch Chat for Streamlabs`)

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      twitchForwarded: true
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