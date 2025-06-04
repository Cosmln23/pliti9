import { NextRequest, NextResponse } from 'next/server'
import { validateAccessCode, startSession, DeviceInfo } from '@/lib/database'

interface ValidateRequest {
  code: string
  deviceInfo: DeviceInfo
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequest = await request.json()
    
    if (!body.code || !body.deviceInfo) {
      return NextResponse.json(
        { valid: false, error: 'Cod și informații dispozitiv sunt obligatorii' },
        { status: 400 }
      )
    }

    // Validează codul de acces
    const accessCode = await validateAccessCode(body.code)
    
    if (!accessCode) {
      return NextResponse.json({
        valid: false,
        error: 'Cod invalid sau expirat'
      })
    }

    // Pornește sesiunea
    const session = await startSession(body.code, body.deviceInfo)

    return NextResponse.json({
      valid: true,
      accessCode: {
        code: accessCode.code,
        email: accessCode.email,
        expires_at: accessCode.expires_at,
        usage_count: accessCode.usage_count
      },
      session: {
        sessionId: session.sessionId,
        deviceInfo: body.deviceInfo,
        startedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Eroare validare cod acces:', error)
    return NextResponse.json(
      { valid: false, error: 'Eroare internă server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Access code validation endpoint - use POST to validate codes'
  })
} 