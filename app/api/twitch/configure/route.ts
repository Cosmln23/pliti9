import { NextRequest, NextResponse } from 'next/server'
import { serverTwitchBot } from '@/lib/twitch-bot-server'

export async function POST(request: NextRequest) {
  try {
    const { botUsername, oauth, channel } = await request.json()

    if (!botUsername || !oauth || !channel) {
      return NextResponse.json(
        { error: 'Missing required fields: botUsername, oauth, channel' },
        { status: 400 }
      )
    }

    // Configure the server bot
    const configured = serverTwitchBot.configure(botUsername, oauth, channel)
    
    if (!configured) {
      return NextResponse.json(
        { error: 'Invalid OAuth token' },
        { status: 400 }
      )
    }

    // Try to connect
    const connected = await serverTwitchBot.connect()
    
    const status = serverTwitchBot.getStatus()

    return NextResponse.json({
      success: true,
      connected,
      status,
      message: connected ? 'Bot configured and connected!' : 'Bot configured but connection failed'
    })

  } catch (error) {
    console.error('Twitch bot configuration error:', error)
    return NextResponse.json(
      { error: 'Failed to configure Twitch bot' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = serverTwitchBot.getStatus()
    
    return NextResponse.json({
      success: true,
      status
    })
  } catch (error) {
    console.error('Failed to get Twitch bot status:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
} 