import { NextRequest, NextResponse } from 'next/server'
import { getCurrentLiveSession } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Găsește sesiunea LIVE activă curentă
    const currentSession = await getCurrentLiveSession()

    if (!currentSession) {
      return NextResponse.json({
        session: null,
        status: 'no_active_session',
        message: 'Nu există nicio sesiune LIVE activă în acest moment',
        next_check_in: 30 // seconds
      })
    }

    // Verifică dacă sesiunea este într-adevăr activă
    const now = new Date()
    const sessionStart = new Date(currentSession.started_at!)
    const sessionDuration = now.getTime() - sessionStart.getTime()
    const sessionMinutes = Math.floor(sessionDuration / (1000 * 60))

    // Calculează timp estimat rămas
    const estimatedEnd = new Date(sessionStart.getTime() + (currentSession.estimated_duration * 60 * 1000))
    const timeRemaining = estimatedEnd.getTime() - now.getTime()
    const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60)))

    return NextResponse.json({
      session: {
        session_id: currentSession.session_id,
        playback_url: currentSession.playback_url,
        playback_id: currentSession.playback_url?.split('?v=')[1] || null,
        location: currentSession.location,
        started_at: currentSession.started_at,
        estimated_duration: currentSession.estimated_duration,
        stream_source: currentSession.stream_source,
        viewer_count: currentSession.viewer_count,
        status: currentSession.status
      },
      timing: {
        duration_minutes: sessionMinutes,
        estimated_remaining_minutes: minutesRemaining,
        estimated_end_time: estimatedEnd.toISOString(),
        is_likely_ending_soon: minutesRemaining <= 10
      },
      playback: {
        url: currentSession.playback_url,
        embed_ready: !!currentSession.playback_url,
        quality_profiles: ['720p', '480p', '360p']
      },
      status: 'live_active',
      message: `LIVE paranormal activ la ${currentSession.location}`
    })

  } catch (error) {
    console.error('Error getting current live session:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-a putut verifica sesiunea LIVE curentă'
      },
      { status: 500 }
    )
  }
} 