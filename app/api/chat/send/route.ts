import { NextRequest, NextResponse } from 'next/server'

// Import the same chatRooms storage (in production, use Redis or database)
const chatRooms = new Map<string, Array<{
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
  likes?: number
}>>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { streamId, username, message, isStreamer } = body

    if (!streamId || !username || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Initialize chat room if it doesn't exist
    if (!chatRooms.has(streamId)) {
      chatRooms.set(streamId, [])
    }

    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: isStreamer ? 'admin' as const : 'user' as const,
      likes: 0
    }

    const roomMessages = chatRooms.get(streamId)!
    roomMessages.push(newMessage)

    // Keep only last 100 messages per room
    if (roomMessages.length > 100) {
      chatRooms.set(streamId, roomMessages.slice(-100))
    }

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 