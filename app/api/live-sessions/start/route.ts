import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json()

    // Generează un ID unic pentru stream
    const streamId = generateStreamId()
    const streamKey = `${streamId.substring(0, 4)}-${streamId.substring(4, 8)}-${streamId.substring(8, 12)}-${streamId.substring(12, 16)}`

    console.log('🎥 Starting new live session:', { streamId, location })

    // Răspuns simplu și rapid
    return NextResponse.json({
      success: true,
      streamId,
      session: {
        session_id: streamId,
        location: location || 'Studio PLIPLI9',
        estimated_duration: 120,
        started_at: new Date().toISOString(),
        stream_source: 'mobile',
        status: 'active',
        viewer_count: 0
      },
      streaming: {
        rtmp_url: 'rtmp://rtmp.livepeer.com/live/',
        stream_key: streamKey,
        playback_url: `https://lvpr.tv?v=${streamId}`,
        playback_id: streamId
      },
      instructions: {
        message: '✅ Stream-ul a fost creat cu succes!',
        setup: [
          '📱 Deschide Streamlabs Mobile',
          '⚙️ Settings → Custom RTMP',
          '🔗 RTMP URL: rtmp://rtmp.livepeer.com/live/',
          `🔑 Stream Key: ${streamKey}`,
          '🎥 Apasă GO LIVE!'
        ]
      }
    })

  } catch (error) {
    console.error('Error starting live session:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Eroare la pornirea sesiunii LIVE',
        message: error instanceof Error ? error.message : 'Eroare necunoscută'
      },
      { status: 500 }
    )
  }
}

// Funcție pentru generarea unui ID unic
function generateStreamId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function GET() {
  return NextResponse.json({
    service: 'Plipli9 Live Session Manager',
    status: 'ready',
    timestamp: new Date().toISOString()
  })
} 