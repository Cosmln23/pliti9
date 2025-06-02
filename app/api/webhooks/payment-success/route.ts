import { NextRequest, NextResponse } from 'next/server'
import { generateAccessCode, isValidEmail } from '@/lib/utils'

/**
 * Webhook pentru notificarea Make.com când o plată este finalizată cu succes
 * Acest endpoint procesează plățile și generează coduri de acces automat
 */

interface PaymentSuccessPayload {
  email: string
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
    expiresAt.setHours(expiresAt.getHours() + 24) // Expiră după 24h

    // Date pentru webhook Make.com
    const makeWebhookPayload = {
      accessCode,
      email: body.email,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      paymentIntentId: body.paymentIntentId,
      sessionId: body.sessionId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      type: 'live_access'
    }

    // Trimitere webhook către Make.com pentru automatizare
    const makeWebhookUrl = process.env.MAKE_PAYMENT_WEBHOOK_URL
    if (makeWebhookUrl) {
      try {
        await fetch(makeWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MAKE_WEBHOOK_SECRET || ''}`
          },
          body: JSON.stringify(makeWebhookPayload)
        })
      } catch (error) {
        console.error('Eroare trimitere webhook Make.com:', error)
        // Nu returnam eroare pentru că plata a fost procesată cu succes
      }
    }

    // În aplicația reală, aici ar fi salvarea în baza de date
    console.log('Access code generat:', {
      email: body.email,
      accessCode,
      expiresAt
    })

    // Simulare trimitere email cu codul de acces
    // În aplicația reală, aceasta ar fi o integrare cu un serviciu de email
    const emailPayload = {
      to: body.email,
      subject: 'Cod de acces pentru LIVE-ul Paranormal Plipli9',
      template: 'access-code',
      data: {
        accessCode,
        expiresAt: expiresAt.toLocaleDateString('ro-RO'),
        liveUrl: `${process.env.NEXT_PUBLIC_APP_URL}/live`
      }
    }

    // Trimitere către serviciul de email (ex: SendGrid, Mailgun, etc.)
    console.log('Email trimis:', emailPayload)

    // Răspuns de succes
    return NextResponse.json({
      success: true,
      message: 'Plata procesată cu succes',
      accessCode, // În producție, nu trimiteți codul prin API
      expiresAt: expiresAt.toISOString(),
      instructions: 'Codul de acces a fost trimis prin email'
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
    endpoints: {
      payment_success: '/api/webhooks/payment-success',
      access_validation: '/api/webhooks/access-code-generated',
      live_session: '/api/webhooks/live-session-started'
    }
  })
} 