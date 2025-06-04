import { NextRequest, NextResponse } from 'next/server'
import { takeoverSession, DeviceInfo } from '@/lib/database'

/**
 * API pentru preluarea sesiunii de pe alt dispozitiv
 * Deconectează sesiunea activă și începe una nouă
 */

interface TakeoverRequest {
  code: string
  deviceInfo: DeviceInfo
  confirmTakeover: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: TakeoverRequest = await request.json()
    
    if (!body.code || !body.deviceInfo || !body.confirmTakeover) {
      return NextResponse.json(
        { error: 'Cod, informații dispozitiv și confirmare takeover sunt obligatorii' },
        { status: 400 }
      )
    }

    // Preia sesiunea
    const result = await takeoverSession(body.code, body.deviceInfo)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Nu s-a putut prelua sesiunea' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      message: 'Sesiune preluată cu succes',
      actions: {
        disconnectPrevious: true,
        startNewSession: true
      }
    })

  } catch (error) {
    console.error('Eroare takeover sesiune:', error)
    return NextResponse.json(
      { error: 'Eroare internă server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Session takeover endpoint - use POST to takeover a session'
  })
} 