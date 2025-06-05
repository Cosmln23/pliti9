import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { generateAccessCode } from '@/lib/utils'
import { createAccessCode } from '@/lib/database'
import { triggerMakeWebhook, PaymentWebhookData } from '@/lib/services'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed:`, err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('💳 Payment successful:', {
        sessionId: session.id,
        email: session.customer_email,
        amount: session.amount_total,
        metadata: session.metadata
      })

      // Extract user data from session
      const email = session.customer_email!
      const phone_number = session.metadata?.phone_number || undefined
      const amount = (session.amount_total || 0) / 100 // Convert from cents to RON

      // Generate access code
      const accessCode = generateAccessCode()
      
      // Save to database
      const result = await createAccessCode({
        code: accessCode,
        email,
        phone_number,
        amount,
        payment_method: 'stripe',
        payment_intent_id: session.payment_intent as string,
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        status: 'active',
        usage_count: 0
      })

      // Trigger Make.com automation
      const webhookData: PaymentWebhookData = {
        accessCode,
        email,
        phone_number,
        amount,
        paymentMethod: 'stripe',
        paymentIntentId: session.payment_intent as string,
        expiresAt: result.expires_at.toISOString(),
        createdAt: result.created_at?.toISOString() || new Date().toISOString(),
        status: 'active',
        type: 'live_access'
      }

      await triggerMakeWebhook('payment', webhookData)

      console.log('✅ Access code created and notification sent:', {
        accessCode,
        email,
        expiresAt: result.expires_at
      })
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('❌ Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Webhook Handler',
    status: 'active',
    events: ['checkout.session.completed'],
    endpoint: '/api/webhooks/stripe',
    note: 'Configure this URL in your Stripe Dashboard webhooks'
  })
} 