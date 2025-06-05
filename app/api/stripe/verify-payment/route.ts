import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Payment successful - trigger existing payment-success webhook
      const webhookPayload = {
        email: session.customer_email!,
        phone_number: session.metadata?.phone_number || undefined,
        amount: (session.amount_total || 0) / 100, // Convert from cents to RON
        paymentMethod: 'stripe',
        paymentIntentId: session.payment_intent as string,
        sessionId: session.id,
        timestamp: new Date().toISOString()
      }

      // Call existing payment-success webhook
      const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/payment-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      })

      const webhookData = await webhookResponse.json()

      if (webhookData.success) {
        return NextResponse.json({
          success: true,
          accessCode: webhookData.data.accessCode,
          expiresAt: webhookData.data.expiresAt,
          message: 'Payment verified and access code generated'
        })
      } else {
        throw new Error('Failed to process payment webhook')
      }

    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('❌ Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Stripe Payment Verification',
    status: 'active',
    usage: 'POST with sessionId to verify payment and generate access code',
    flow: 'Stripe → Verify → Existing payment-success webhook → Access code'
  })
} 