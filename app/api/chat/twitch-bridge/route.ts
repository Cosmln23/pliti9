import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '@/lib/chat-storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'simple'

    // Get last 5 messages from site chat
    const messages = getMessages('plipli9-paranormal-live', 5)
    
    if (format === 'nightbot') {
      // Format pentru Nightbot command
      const twitchMessage = messages.map(msg => 
        `[${msg.username}] ${msg.message}`
      ).join(' • ')
      
      return NextResponse.json({
        success: true,
        twitchCommand: `!website ${twitchMessage}`,
        rawMessage: twitchMessage,
        count: messages.length
      })
    }

    // Format simplu pentru copy-paste
    const formattedMessages = messages.map(msg => ({
      text: `[SITE] ${msg.username}: ${msg.message}`,
      timestamp: msg.timestamp
    }))

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      twitchReady: formattedMessages.map(m => m.text).join('\n'),
      count: messages.length
    })

  } catch (error) {
    console.error('Twitch bridge error:', error)
    return NextResponse.json(
      { error: 'Failed to bridge to Twitch' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 