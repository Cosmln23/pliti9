import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for chat messages
const chatRooms = new Map<string, Array<{
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
  likes?: number
}>>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const streamId = searchParams.get('streamId')

  if (!streamId) {
    return NextResponse.json({ error: 'Stream ID required' }, { status: 400 })
  }

  const messages = chatRooms.get(streamId) || []
  
  return NextResponse.json({ 
    success: true, 
    messages: messages.slice(-50) // Return last 50 messages
  })
} 