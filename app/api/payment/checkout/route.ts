import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { generateAccessCode, isValidEmail } from '@/lib/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { email, phone_number } = await request.json()

    // Validare input
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email valid este obligatoriu' },
        { status: 400 }
      )
    }

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/live?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/live?canceled=true`,
      customer_email: email,
      metadata: {
        email,
        phone_number: phone_number || '',
        access_type: 'live_paranormal',
        validity_hours: '8',
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Eroare la procesarea plății. Încearcă din nou.' },
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