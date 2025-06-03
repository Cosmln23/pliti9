import { NextRequest, NextResponse } from 'next/server'
import { generateAccessCode, isValidEmail } from '@/lib/utils'
import { createAccessCode } from '@/lib/database'
import { 
  triggerMakeWebhook, 
  PaymentWebhookData 
} from '@/lib/services'

/**
 * Webhook pentru notificarea Make.com când o plată este finalizată cu succes
 * Acest endpoint procesează plățile, generează coduri de acces automat și trigger-ează automația Make.com
 */

interface PaymentSuccessPayload {
  email: string
  phone_number?: string
  amount: number
  paymentMethod: 'stripe' | 'paypal'
  paymentIntentId?: string
  sessionId?: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentSuccessPayload = await request.json()
    
    // Validare payload
    if (!body.email || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Date incomplete: email, amount și paymentMethod sunt obligatorii' },
        { status: 400 }
      )
    }

    // Validare email
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Email invalid' },
        { status: 400 }
      )
    }

    // Validare sumă (25 RON pentru LIVE-uri paranormale)
    if (body.amount !== 25.00) {
      return NextResponse.json(
        { error: 'Sumă invalidă pentru LIVE paranormal' },
        { status: 400 }
      )
    }

    // Generare cod de acces unic
    const accessCode = generateAccessCode()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 8) // Expiră după 8 ore

    // Salvare cod în database cloud
    const newAccessCode = await createAccessCode({
      code: accessCode,
      email: body.email,
      phone_number: body.phone_number,
      payment_intent_id: body.paymentIntentId,
      amount: body.amount,
      payment_method: body.paymentMethod,
      expires_at: expiresAt,
      status: 'active',
      usage_count: 0,
      ip_address: request.ip || request.headers.get('x-forwarded-for') || undefined
    })

    // Date pentru webhook Make.com
    const makeWebhookPayload: PaymentWebhookData = {
      accessCode,
      email: body.email,
      phone_number: body.phone_number,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      paymentIntentId: body.paymentIntentId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      type: 'live_access'
    }

    // Trimitere webhook către Make.com pentru automatizare Email + WhatsApp
    try {
      await triggerMakeWebhook('payment', makeWebhookPayload)
    } catch (error) {
      console.error('Eroare trimitere webhook Make.com:', error)
      // Nu returnam eroare pentru că plata a fost procesată cu succes
    }

    console.log('Payment processed and access code generated:', {
      email: body.email,
      accessCode,
      expiresAt: expiresAt.toISOString(),
      phone_number: body.phone_number
    })

    // Răspuns de succes
    return NextResponse.json({
      success: true,
      message: 'Plata procesată cu succes',
      data: {
        accessCode,
        expiresAt: expiresAt.toISOString(),
        email: body.email,
        phone_number: body.phone_number,
        valid_hours: 8,
        access_type: 'flexible_reentry'
      },
      automation: {
        email_notification: 'se trimite automat',
        whatsapp_notification: body.phone_number ? 'se trimite automat' : 'nu este disponibil',
        estimated_delivery: '1-2 minute'
      },
      instructions: 'Codul de acces va fi trimis prin email și WhatsApp (dacă este disponibil) în maxim 2 minute'
    })

  } catch (error) {
    console.error('Eroare procesare webhook payment-success:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-a putut procesa plata'
      },
      { status: 500 }
    )
  }
}

// Webhook pentru verificarea conectivității
export async function GET() {
  return NextResponse.json({
    service: 'Plipli9 Paranormal Payment Webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
    version: '2.0',
    features: {
      database: 'PlanetScale Cloud',
      automation: 'Make.com',
      notifications: 'Email + WhatsApp dual',
      access_duration: '8 hours flexible',
      resilience: 'Technical interruption safe'
    },
    endpoints: {
      payment_success: '/api/webhooks/payment-success',
      access_create: '/api/access-codes/create',
      access_validate: '/api/access-codes/validate',
      live_current: '/api/live-sessions/current'
    }
  })
} 