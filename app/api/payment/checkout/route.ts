import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { generateAccessCode, isValidEmail } from '@/lib/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { email, phone_number } = await request.json()

    // Enhanced input validation and sanitization
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email valid este obligatoriu' },
        { status: 400 }
      )
    }

    // Sanitize email - remove whitespace and convert to lowercase
    const sanitizedEmail = email.trim().toLowerCase()

    // Enhanced email validation
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Formatul email-ului este invalid' },
        { status: 400 }
      )
    }

    // Email length validation
    if (sanitizedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Email-ul este prea lung (max 254 caractere)' },
        { status: 400 }
      )
    }

    // Phone number validation and sanitization (if provided)
    let sanitizedPhone = null
    if (phone_number) {
      if (typeof phone_number !== 'string') {
        return NextResponse.json(
          { error: 'Numărul de telefon trebuie să fie text' },
          { status: 400 }
        )
      }
      
      // Remove all non-digit characters except +
      sanitizedPhone = phone_number.replace(/[^\d+]/g, '')
      
      // Validate phone format (international)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(sanitizedPhone)) {
        return NextResponse.json(
          { error: 'Formatul numărului de telefon este invalid (folosește formatul internațional)' },
          { status: 400 }
        )
      }
    }

    // Rate limiting check - prevent abuse
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown'
    // TODO: Implement rate limiting with Redis or in-memory cache

    // Creează Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: '🔴 LIVE Paranormal - Acces 8 ore',
              description: 'Acces complet la investigația paranormală LIVE cu Plipli9',
              images: ['https://www.plipli9.com/paranormal-preview.jpg'],
            },
            unit_amount: 2500, // 25 RON în bani (25.00 * 100)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/live?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/live?payment=canceled`,
      customer_email: sanitizedEmail,
      metadata: {
        email: sanitizedEmail,
        phone_number: sanitizedPhone || '',
        access_type: 'live_paranormal',
        validity_hours: '8',
        client_ip: clientIP,
        created_at: new Date().toISOString()
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    
    // Enhanced error handling - don't expose internal errors
    let errorMessage = 'Eroare la procesarea plății. Încearcă din nou.'
    
    if (error.code === 'parameter_invalid_empty') {
      errorMessage = 'Date de plată invalide. Verifică datele introduse.'
    } else if (error.code === 'amount_too_small') {
      errorMessage = 'Suma de plată este prea mică.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Checkout API',
    status: 'active',
    test_mode: process.env.STRIPE_SECRET_KEY?.includes('test') ? 'TEST' : 'LIVE',
    price: '25 RON',
    access_duration: '8 hours',
    features: [
      'Instant access code delivery',
      'Email + WhatsApp notifications',
      'Resilient to technical interruptions'
    ]
  })
} 