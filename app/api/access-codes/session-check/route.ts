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

    // SPECIAL CODE: COS23091 - Nu are niciodată conflicte de sesiune
    if (body.code.trim().toUpperCase() === 'COS23091') {
      return NextResponse.json({
        success: true,
        needsTakeover: false,
        canAccess: true,
        message: 'Acces nelimitat - COS23091 Video Quality Testing',
        unlimited: true,
        purpose: 'Video Quality Testing'
      })
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