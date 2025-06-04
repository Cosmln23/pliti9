import { NextRequest, NextResponse } from 'next/server'
import { checkAccessCodeSession } from '@/lib/database'

/**
 * API pentru verificarea conflictelor de sesiune
 * Verifică dacă un cod este deja în folosință pe alt dispozitiv
 */

interface SessionCheckRequest {
  code: string
  deviceInfo: {
    userAgent: string
    ip: string
    screenResolution?: string
    timezone?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SessionCheckRequest = await request.json()
    
    if (!body.code || !body.deviceInfo) {
      return NextResponse.json(
        { error: 'Cod și informații dispozitiv sunt obligatorii' },
        { status: 400 }
      )
    }

    // Verifică starea sesiunii pentru acest cod
    const sessionStatus = await checkAccessCodeSession(body.code, body.deviceInfo)
    
    return NextResponse.json({
      success: true,
      ...sessionStatus
    })

  } catch (error) {
    console.error('Eroare verificare sesiune:', error)
    return NextResponse.json(
      { error: 'Eroare internă server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Session check endpoint - use POST to check session conflicts'
  })
} 