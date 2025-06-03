import { NextRequest, NextResponse } from 'next/server'
import { createAccessCode } from '@/lib/database'
import { triggerPaymentSuccessNotification } from '@/lib/make-automation'

interface CreateAccessCodeRequest {
  email: string
  phone_number?: string
  amount: number
  paymentMethod: string
  paymentIntentId: string
  sessionId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAccessCodeRequest = await request.json()

    // Validare input
    if (!body.email || !body.paymentMethod || !body.amount) {
      return NextResponse.json(
        { error: 'Câmpurile email, paymentMethod și amount sunt obligatorii' },
        { status: 400 }
      )
    }

    // Validare email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Formatul email-ului este invalid' },
        { status: 400 }
      )
    }

    // Validare WhatsApp (dacă este furnizat)
    if (body.phone_number) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(body.phone_number.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Formatul numărului de WhatsApp este invalid' },
          { status: 400 }
        )
      }
    }

    // Generare cod de acces unic
    const generateAccessCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = 'PLI' // Prefix pentru Plipli9
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let accessCode = generateAccessCode()
    
    // Asigură-te că codul este unic (într-un sistem real, ar trebui să verifici în database)
    // Pentru demo, generăm unul nou dacă este nevoie
    const attempts = 3
    for (let i = 0; i < attempts; i++) {
      try {
        // În producție, aici verifici în database dacă codul există deja
        break
      } catch (error) {
        if (i === attempts - 1) throw error
        accessCode = generateAccessCode()
      }
    }

    // Calculează timpul de expirare (8 ore de la now)
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)

    // Creează codul de acces în database
    const accessCodeData = await createAccessCode({
      code: accessCode,
      email: body.email.trim().toLowerCase(),
      phone_number: body.phone_number?.trim() || undefined,
      payment_intent_id: body.paymentIntentId,
      amount: body.amount,
      payment_method: body.paymentMethod,
      expires_at: expiresAt,
      status: 'active',
      usage_count: 0,
      ip_address: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
    })

    // Pregătire date pentru Make.com automation
    const liveUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/live`
    
    const webhookData = {
      accessCode: accessCode,
      email: body.email.trim().toLowerCase(),
      phoneNumber: body.phone_number?.trim(),
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      expiresAt: expiresAt.toISOString(),
      liveUrl: liveUrl,
      timestamp: new Date().toISOString()
    }

    // Trigger Make.com automation pentru notificări
    console.log('🚀 Triggering Make.com automation...')
    const notificationSent = await triggerPaymentSuccessNotification(webhookData)

    // Response de succes
    return NextResponse.json({
      success: true,
      message: 'Cod de acces creat cu succes',
      data: {
        accessCode: accessCode,
        email: body.email.trim().toLowerCase(),
        expiresAt: expiresAt.toISOString(),
        validFor: '8 ore',
        liveUrl: liveUrl,
        features: [
          'Acces flexibil - poți intra și ieși de câte ori vrei',
          'Valabil 8 ore de la achiziție',
          'Chat live cu alți participanți',
          'Acces de pe orice device (telefon, tablet, computer)',
          'Chiar dacă LIVE-ul se întrerupe, codul rămâne valabil'
        ]
      },
      notifications: {
        automation_triggered: notificationSent,
        email_scheduled: true,
        whatsapp_scheduled: !!body.phone_number,
        delivery_time: 'maximum 2 minute',
        note: notificationSent 
          ? 'Notificările vor fi trimise automat via Make.com' 
          : 'Notificările sunt programate pentru trimitere manuală'
      },
      next_steps: [
        '📧 Verifică email-ul pentru codul de acces',
        body.phone_number ? '📱 Verifică WhatsApp pentru confirmarea codului' : '',
        '🎃 Mergi la pagina LIVE când primești notificarea',
        '🔓 Introdu codul pentru acces instant',
        '👻 Bucură-te de experiența paranormală!'
      ].filter(Boolean),
      support: {
        message: 'Dacă nu primești codul în 5 minute, contactează suportul',
        email: 'suport@plipli9paranormal.com',
        whatsapp: '+40712345678'
      }
    })

  } catch (error) {
    console.error('Error creating access code:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare la crearea codului de acces',
        message: error instanceof Error ? error.message : 'Eroare internă server',
        troubleshooting: [
          'Verifică datele introduse',
          'Încearcă din nou în câteva secunde',
          'Contactează suportul dacă problema persistă'
        ]
      },
      { status: 500 }
    )
  }
}

// Test endpoint pentru verificarea conectivității
export async function GET() {
  return NextResponse.json({
    service: 'Plipli9 Access Code Generator',
    status: 'active',
    timestamp: new Date().toISOString(),
    features: {
      database: 'PlanetScale Cloud',
      automation: 'Make.com',
      notifications: 'Email + WhatsApp',
      validity: '8 hours flexible access'
    }
  })
} 