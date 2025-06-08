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

    // SPECIAL CODE: COS23091 - Acces nelimitat pentru testare calitate video
    if (body.code === 'COS23091') {
      console.log('🎯 SPECIAL CODE ACTIVATED: COS23091 - Unlimited access for video quality testing')
      
      return NextResponse.json({
        valid: true,
        accessCode: {
          code: 'COS23091',
          email: 'admin@plipli9.com',
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an în viitor
          usage_count: 0
        },
        session: {
          sessionId: `cos23091-${Date.now()}`,
          deviceInfo: body.deviceInfo,
          startedAt: new Date().toISOString(),
          unlimited: true,
          purpose: 'Video Quality Testing'
        }
      })
    }

    // Validează codul de acces normal
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