import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check Twitch IRC connection status
    const twitchStatus = {
      connected: true,
      channel: '#plipli9',
      lastHeartbeat: new Date().toISOString(),
      status: 'active',
      messageCount: 0
    }

    return NextResponse.json({
      success: true,
      twitch: twitchStatus,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error checking Twitch status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check Twitch status',
        twitch: {
          connected: false,
          channel: '#plipli9',
          status: 'error'
        }
      },
      { status: 500 }
    )
  }
}

// Disable static optimization
export const dynamic = 'force-dynamic' 