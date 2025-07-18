import { NextRequest, NextResponse } from 'next/server'
import { getAccessCodeByCode } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    // Validare payload
    if (!code) {
      return NextResponse.json(
        { error: 'Codul de acces este obligatoriu' },
        { status: 400 }
      )
    }

    // Normalizare cod (uppercase, remove spaces)
    const normalizedCode = code.trim().toUpperCase()

    // SPECIAL CODE: COS23091 - Acces nelimitat pentru testare calitate video
    if (normalizedCode === 'COS23091') {
      const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an în viitor
      
      return NextResponse.json({
        exists: true,
        code: 'COS23091',
        email: 'admin@plipli9.com',
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: futureDate.toISOString(),
        last_used_at: new Date().toISOString(),
        usage_count: 0,
        expired: false,
        unlimited: true,
        purpose: 'Video Quality Testing',
        time_remaining: {
          total_minutes: 525600, // 1 an în minute
          hours: 8760, // 1 an în ore
          minutes: 0,
          formatted: 'NELIMITAT',
          percentage: 100
        },
        access_info: {
          type: 'unlimited_testing',
          can_reenter: true,
          multiple_sessions: true,
          resilient_to_interruptions: true,
          special_code: true
        },
        payment_info: {
          amount: 0,
          payment_method: 'special_code',
          payment_intent_id: 'cos23091-unlimited'
        }
      })
    }

    // Căutare cod în database
    const accessCode = await getAccessCodeByCode(normalizedCode)

    if (!accessCode) {
      return NextResponse.json({
        exists: false,
        status: 'not_found',
        message: 'Codul nu există în sistem'
      }, { status: 404 })
    }

    // Calculare status și timp rămas
    const now = new Date()
    const expiresAt = new Date(accessCode.expires_at)
    const isExpired = now > expiresAt
    const timeRemaining = expiresAt.getTime() - now.getTime()
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    // Response cu toate detaliile
    return NextResponse.json({
      exists: true,
      code: accessCode.code,
      email: accessCode.email,
      status: isExpired ? 'expired' : accessCode.status,
      created_at: accessCode.created_at,
      expires_at: accessCode.expires_at,
      last_used_at: accessCode.last_used_at,
      usage_count: accessCode.usage_count,
      expired: isExpired,
      time_remaining: {
        total_minutes: isExpired ? 0 : Math.floor(timeRemaining / (1000 * 60)),
        hours: isExpired ? 0 : hoursRemaining,
        minutes: isExpired ? 0 : minutesRemaining,
        formatted: isExpired ? 'EXPIRAT' : `${hoursRemaining}h ${minutesRemaining}m`,
        percentage: isExpired ? 0 : Math.floor((timeRemaining / (8 * 60 * 60 * 1000)) * 100)
      },
      access_info: {
        type: 'flexible_8h',
        can_reenter: !isExpired,
        multiple_sessions: !isExpired,
        resilient_to_interruptions: true
      },
      payment_info: {
        amount: accessCode.amount,
        payment_method: accessCode.payment_method,
        payment_intent_id: accessCode.payment_intent_id
      }
    })

  } catch (error) {
    console.error('Error checking access code status:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-a putut verifica statusul codului'
      },
      { status: 500 }
    )
  }
}

// GET endpoint pentru verificare rapidă prin query params
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
    const normalizedCode = code.trim().toUpperCase()
    
    // SPECIAL CODE: COS23091 - GET endpoint
    if (normalizedCode === 'COS23091') {
      return NextResponse.json({
        exists: true,
        code: 'COS23091',
        status: 'active',
        expired: false,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 0,
        time_remaining_minutes: 525600, // 1 an în minute
        created_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
        unlimited: true,
        purpose: 'Video Quality Testing'
      })
    }
    
    const accessCode = await getAccessCodeByCode(normalizedCode)

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
      status: isExpired ? 'expired' : accessCode.status,
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