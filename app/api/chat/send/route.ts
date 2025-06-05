import { NextRequest, NextResponse } from 'next/server'
import { addMessage } from '@/lib/chat-storage'
import { serverTwitchBot } from '@/lib/twitch-bot-server'

// In-memory storage for demo - in production use database
const chatMessages: any[] = []
let messageIdCounter = 1

// Anti-spam protection
const userCooldowns = new Map<string, number>()

// Validate message for anti-spam
function validateMessage(message: string, username: string): string | null {
  // Check for too many consecutive identical characters
  const consecutiveCharRegex = /(.)\1{4,}/g
  if (consecutiveCharRegex.test(message)) {
    return 'Prea multe caractere identice consecutive (max 4)'
  }

  // Check message length
  if (message.length > 200) {
    return 'Mesaj prea lung (max 200 caractere)'
  }

  // Check user cooldown (3 seconds)
  const now = Date.now()
  const lastMessage = userCooldowns.get(username)
  if (lastMessage && now - lastMessage < 3000) {
    return 'Așteaptă 3 secunde între mesaje'
  }

  return null // Valid message
}

export async function POST(request: NextRequest) {
  try {
    const { streamId, username, message, isStreamer } = await request.json()

    if (!streamId || !username || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Anti-spam validation (skip for streamers/admins)
    if (!isStreamer) {
      const validationError = validateMessage(message.trim(), username)
      if (validationError) {
        return NextResponse.json(
          { error: validationError },
          { status: 429 } // Too Many Requests
        )
      }
      
      // Update user cooldown
      userCooldowns.set(username, Date.now())
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
      twitchSent = await serverTwitchBot.sendMessage(username, message.trim())
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