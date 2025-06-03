import { NextRequest, NextResponse } from 'next/server'
import { createLiveSession, getActiveAccessCodes } from '@/lib/database'
import { createLiveStream } from '@/lib/livepeer'
import { triggerLiveStartedNotification } from '@/lib/make-automation'

export async function POST(request: NextRequest) {
  try {
    const { location, duration = 120 } = await request.json()

    // Validare input
    if (!location || location.trim() === '') {
      return NextResponse.json(
        { error: 'Locația este obligatorie pentru a începe LIVE' },
        { status: 400 }
      )
    }

    // Creează stream nou în Livepeer
    console.log('🎥 Creating new Livepeer stream...')
    const streamData = await createLiveStream(`Plipli9 Paranormal - ${location}`)
    
    // Creează sesiunea în database
    console.log('💾 Creating database session...')
    const session = await createLiveSession({
      session_id: streamData.id,
      stream_key: streamData.streamKey,
      stream_url: streamData.rtmpIngestUrl,
      playback_url: streamData.playbackUrl,
      location: location.trim(),
      status: 'active',
      estimated_duration: duration,
      viewer_count: 0,
      stream_source: 'mobile' // Default pentru mobile streaming
    })

    // Obține numărul de coduri active pentru statistici
    console.log('📊 Getting active access codes count...')
    const activeAccessCodes = await getActiveAccessCodes()
    const activeCodesCount = activeAccessCodes.length

    // Trigger Make.com automation pentru notificări mass
    console.log('🚨 Triggering live started notifications...')
    const notificationData = {
      sessionId: session.session_id,
      playbackUrl: session.playback_url || streamData.playbackUrl,
      startTime: new Date().toISOString(),
      location: location.trim(),
      estimatedDuration: duration,
      source: 'mobile' as const,
      activeCodesCount: activeCodesCount
    }

    const notificationSent = await triggerLiveStartedNotification(notificationData)

    // În DEMO mode sau pentru testing real
    const isDemoMode = process.env.DEMO_MODE === 'true'

    // Response cu toate datele necesare pentru streaming
    return NextResponse.json({
      session: {
        session_id: session.session_id,
        location: session.location,
        estimated_duration: session.estimated_duration,
        started_at: session.started_at,
        stream_source: session.stream_source,
        status: 'active'
      },
      streaming: {
        playback_url: session.playback_url,
        playback_id: streamData.playbackId,
        stream_key: session.stream_key,
        rtmp_ingest_url: session.stream_url,
        demo_mode: isDemoMode
      },
      notifications: {
        automation_triggered: notificationSent,
        active_codes_notified: activeCodesCount,
        broadcast_channels: ['email', 'whatsapp', 'social_media'],
        delivery_status: notificationSent ? 'scheduled' : 'manual_fallback',
        estimated_reach: Math.floor(activeCodesCount * 0.7) // 70% show rate estimat
      },
      instructions: {
        mobile_streaming: {
          title: '📱 Cum să faci LIVE de pe telefon:',
          apps: [
            {
              name: 'Streamlabs Mobile (RECOMANDAT)',
              steps: [
                '1. Download Streamlabs Mobile (iOS/Android)',
                '2. Settings → Custom RTMP',
                `3. RTMP URL: ${session.stream_url?.split('/live/')[0]}/live/`,
                `4. Stream Key: ${session.stream_key}`,
                '5. Calitate: 720p, 30fps, 2000kbps',
                '6. Tap GO LIVE!'
              ]
            },
            {
              name: 'OBS Mobile',
              steps: [
                '1. Download OBS Mobile (iOS/Android)',
                '2. Add Source → Camera',
                '3. Settings → Stream → Custom',
                `4. Server: ${session.stream_url?.split('/live/')[0]}/live/`,
                `5. Key: ${session.stream_key}`,
                '6. Start Streaming'
              ]
            }
          ]
        },
        desktop_streaming: {
          title: '💻 Sau de pe computer (OBS Studio):',
          steps: [
            '1. Download OBS Studio (free)',
            '2. Settings → Stream → Custom',
            `3. Server: ${session.stream_url?.split('/live/')[0]}/live/`,
            `4. Stream Key: ${session.stream_key}`,
            '5. Add Sources → Video Capture Device',
            '6. Start Streaming'
          ]
        }
      },
      next_steps: [
        '✅ Sesiunea LIVE a fost creată cu succes',
        `🎥 Stream-ul va fi vizibil la: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/live`,
        '📱 Folosește instructiunile de mai sus pentru a începe streaming',
        `🚨 ${activeCodesCount} utilizatori cu coduri active vor fi notificați automat`,
        '🔴 După ce începi streaming, utilizatorii vor vedea LIVE automat',
        '⏰ Sesiunea va rula automat pentru durata estimată'
      ],
      audience: {
        total_active_codes: activeCodesCount,
        estimated_viewers: Math.floor(activeCodesCount * 0.7),
        notification_methods: ['Email instant', 'WhatsApp instant', 'Social media posts'],
        engagement_forecast: activeCodesCount > 0 ? 'High' : 'Low'
      },
      support: {
        message: 'Dacă ai probleme cu streaming-ul, contactează suportul',
        contact: 'suport@plipli9paranormal.com',
        demo_note: isDemoMode ? 'DEMO MODE: Streaming-ul este simulat pentru development' : 'LIVE MODE: Streaming real prin Livepeer',
        automation_note: notificationSent 
          ? 'Notificările automate sunt active via Make.com' 
          : 'Notificările automate nu sunt configurate - se va folosi fallback manual'
      }
    })

  } catch (error) {
    console.error('Error starting live session:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare la pornirea sesiunii LIVE',
        message: error instanceof Error ? error.message : 'Eroare necunoscută',
        troubleshooting: [
          'Verifică conexiunea la internet',
          'Încearcă din nou în câteva secunde',
          'Contactează suportul dacă problema persistă'
        ]
      },
      { status: 500 }
    )
  }
}

// GET endpoint pentru a verifica dacă există o sesiune activă
export async function GET() {
  try {
    // Aici ar trebui să caut sesiunea activă curentă
    // Pentru această implementare, returnez un răspuns generic
    
    return NextResponse.json({
      service: 'Plipli9 Live Session Manager',
      status: 'ready',
      timestamp: new Date().toISOString(),
      capabilities: {
        mobile_streaming: true,
        auto_notification: true,
        livepeer_integration: true,
        resilient_sessions: true
      },
      instructions: {
        start: 'POST /api/live-sessions/start',
        current: 'GET /api/live-sessions/current',
        end: 'POST /api/live-sessions/end'
      }
    })

  } catch (error) {
    console.error('Error in live sessions GET:', error)
    
    return NextResponse.json(
      { error: 'Eroare la verificarea sesiunilor' },
      { status: 500 }
    )
  }
} 