import { NextRequest, NextResponse } from 'next/server'
import { addMessage } from '@/lib/chat-storage'
import { twitchBot } from '@/lib/twitch-chat'

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
      twitchSent = await twitchBot.sendMessage(username, message.trim())
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