import { NextRequest, NextResponse } from 'next/server'
import { endLiveSession, getCurrentLiveSession } from '@/lib/database'
import { terminateStream } from '@/lib/livepeer'

export async function POST(request: NextRequest) {
  try {
    const { session_id, reason = 'manual_end' } = await request.json()

    let sessionToEnd;

    if (session_id) {
      // End specific session by ID - need to get session data first
      const currentSession = await getCurrentLiveSession()
      if (!currentSession || currentSession.session_id !== session_id) {
        return NextResponse.json({
          success: false,
          error: 'Sesiunea specificată nu este activă',
          message: 'Session ID-ul nu corespunde cu sesiunea activă curentă'
        }, { status: 404 })
      }
      sessionToEnd = currentSession
    } else {
      // End current active session
      const currentSession = await getCurrentLiveSession()
      if (!currentSession) {
        return NextResponse.json({
          success: false,
          error: 'Nu există nicio sesiune activă de terminat',
          message: 'Nu este pornit niciun LIVE în acest moment'
        }, { status: 404 })
      }
      sessionToEnd = currentSession
    }

    console.log(`🛑 Ending live session: ${sessionToEnd.session_id}`)

    // Get session data before ending (for response)
    const sessionData = {
      session_id: sessionToEnd.session_id,
      location: sessionToEnd.location,
      started_at: sessionToEnd.started_at,
      status: sessionToEnd.status,
      stream_key: sessionToEnd.stream_key,
      estimated_duration: sessionToEnd.estimated_duration
    }

    // Terminate stream in Livepeer
    let streamTerminated = false
    try {
      await terminateStream(sessionToEnd.session_id)
      streamTerminated = true
      console.log('✅ Livepeer stream terminated successfully')
    } catch (error) {
      console.error('❌ Error terminating Livepeer stream:', error)
      // Continue with database update even if Livepeer fails
    }

    // Update session status in database
    await endLiveSession(sessionToEnd.session_id)

    // Calculate session duration
    const startTime = new Date(sessionData.started_at!)
    const endTime = new Date()
    const durationMs = endTime.getTime() - startTime.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    // Response de succes
    return NextResponse.json({
      success: true,
      message: 'Sesiunea LIVE a fost terminată cu succes',
      session: {
        session_id: sessionData.session_id,
        location: sessionData.location,
        started_at: sessionData.started_at,
        ended_at: endTime.toISOString(),
        status: 'ended',
        duration_minutes: durationMinutes,
        reason: reason
      },
      stream: {
        livepeer_terminated: streamTerminated,
        stream_key: sessionData.stream_key
      },
      impact: {
        message: 'Codurile de acces rămân VALIDE',
        access_codes_status: 'Utilizatorii pot intra din nou când pornești un nou LIVE',
        next_session: 'Poți porni o nouă sesiune oricând'
      },
      next_steps: [
        '✅ Sesiunea curentă închisă',
        '🔄 Codurile de acces rămân active pentru 8h',
        '🎥 Poți porni o nouă sesiune cu /api/live-sessions/start',
        '👥 Utilizatorii vor vedea "LIVE va începe în curând"'
      ]
    })

  } catch (error) {
    console.error('Error ending live session:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-a putut termina sesiunea LIVE'
      },
      { status: 500 }
    )
  }
}

// GET endpoint pentru verificarea sesiunilor care pot fi terminate
export async function GET() {
  try {
    const currentSession = await getCurrentLiveSession()

    if (!currentSession) {
      return NextResponse.json({
        active_session: null,
        can_end: false,
        message: 'Nu există nicio sesiune activă'
      })
    }

    // Calculate current duration
    const startTime = new Date(currentSession.started_at!)
    const now = new Date()
    const currentDurationMs = now.getTime() - startTime.getTime()
    const currentDurationMinutes = Math.floor(currentDurationMs / (1000 * 60))

    return NextResponse.json({
      active_session: {
        session_id: currentSession.session_id,
        location: currentSession.location,
        started_at: currentSession.started_at,
        status: currentSession.status,
        estimated_duration: currentSession.estimated_duration,
        current_duration_minutes: currentDurationMinutes,
        stream_key: currentSession.stream_key
      },
      can_end: true,
      endpoints: {
        end_current: 'POST /api/live-sessions/end (no body)',
        end_specific: 'POST /api/live-sessions/end {"session_id": "xxx"}'
      }
    })

  } catch (error) {
    console.error('Error getting session info for ending:', error)
    
    return NextResponse.json(
      { error: 'Eroare la verificarea sesiunilor' },
      { status: 500 }
    )
  }
} 