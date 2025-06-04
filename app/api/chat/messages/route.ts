import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '@/lib/chat-storage'

// Same in-memory storage as send endpoint
const chatMessages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get('streamId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!streamId) {
      return NextResponse.json(
        { error: 'streamId is required' },
        { status: 400 }
      )
    }

    // Get messages using shared storage
    const streamMessages = getMessages(streamId, limit)

    return NextResponse.json({
      success: true,
      messages: streamMessages,
      count: streamMessages.length
    })

  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// Disable static optimization for this API route
export const dynamic = 'force-dynamic' 