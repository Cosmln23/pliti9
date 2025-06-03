import { NextRequest, NextResponse } from 'next/server'
import { getAccessCodeByCode, updateAccessCodeUsage } from '@/lib/database'

interface ValidateAccessCodeRequest {
  code: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateAccessCodeRequest = await request.json()
    
    // Validare payload
    if (!body.code) {
      return NextResponse.json(
        { error: 'Codul de acces este obligatoriu' },
        { status: 400 }
      )
    }

    // Normalizare cod (uppercase, remove spaces)
    const normalizedCode = body.code.trim().toUpperCase()

    // Căutare cod în database
    const accessCode = await getAccessCodeByCode(normalizedCode)

    if (!accessCode) {
      return NextResponse.json({
        success: false,
        error: 'Cod de acces invalid',
        message: 'Codul introdus nu există în sistem'
      }, { status: 404 })
    }

    // Verificare dacă codul a expirat
    const now = new Date()
    const expiresAt = new Date(accessCode.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Cod de acces expirat',
        message: 'Codul a expirat. Te rugăm să achiziționezi un nou cod de acces.',
        expired_at: accessCode.expires_at
      }, { status: 410 })
    }

    // Verificare status
    if (accessCode.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: 'Cod de acces inactiv',
        message: 'Codul nu mai este valid pentru utilizare'
      }, { status: 403 })
    }

    // Update last_used_at și usage_count (fără a consuma codul)
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || undefined
    await updateAccessCodeUsage(normalizedCode, clientIp)

    // Calculare timp rămas
    const timeRemaining = expiresAt.getTime() - now.getTime()
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    // Răspuns de succes
    return NextResponse.json({
      success: true,
      message: 'Cod de acces valid',
      session: {
        code: normalizedCode,
        email: accessCode.email,
        expires_at: accessCode.expires_at,
        usage_count: accessCode.usage_count + 1,
        time_remaining: {
          total_minutes: Math.floor(timeRemaining / (1000 * 60)),
          hours: hoursRemaining,
          minutes: minutesRemaining,
          formatted: `${hoursRemaining}h ${minutesRemaining}m`
        },
        created_at: accessCode.created_at,
        last_used_at: new Date().toISOString()
      },
      access_info: {
        type: 'flexible_8h',
        can_reenter: true,
        multiple_sessions: true,
        resilient_to_interruptions: true
      }
    })

  } catch (error) {
    console.error('Error validating access code:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-a putut valida codul de acces'
      },
      { status: 500 }
    )
  }
}

// GET endpoint pentru verificarea statusului unui cod
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { error: 'Parametrul code este obligatoriu' },
      { status: 400 }
    )
  }

  try {
    const accessCode = await getAccessCodeByCode(code.trim().toUpperCase())

    if (!accessCode) {
      return NextResponse.json({
        exists: false,
        message: 'Codul nu există în sistem'
      })
    }

    const now = new Date()
    const expiresAt = new Date(accessCode.expires_at)
    const isExpired = now > expiresAt
    const timeRemaining = expiresAt.getTime() - now.getTime()

    return NextResponse.json({
      exists: true,
      code: accessCode.code,
      status: accessCode.status,
      expired: isExpired,
      expires_at: accessCode.expires_at,
      usage_count: accessCode.usage_count,
      time_remaining_minutes: isExpired ? 0 : Math.floor(timeRemaining / (1000 * 60)),
      created_at: accessCode.created_at,
      last_used_at: accessCode.last_used_at
    })

  } catch (error) {
    console.error('Error checking access code status:', error)
    
    return NextResponse.json(
      { error: 'Eroare la verificarea statusului' },
      { status: 500 }
    )
  }
} 