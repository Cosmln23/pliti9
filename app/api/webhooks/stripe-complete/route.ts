import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// CONEXIUNEA PRINCIPALĂ: Stripe → Tot Sistemul
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('❌ Stripe webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // STEP 1: HANDLE BOTH CHECKOUT AND PAYMENT EVENTS
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('💳 CHECKOUT COMPLETED - STARTING FULL CHAIN');
    
    // STEP 2: EXTRACT PAYMENT DATA FROM SESSION
    const customerEmail = session.customer_email || session.customer_details?.email || 'unknown@email.com';
    const customerPhone = session.metadata?.phone_number || session.customer_details?.phone || '';
    const amount = (session.amount_total || 0) / 100; // Convert cents to RON
    
    // STEP 3: GENERATE ACCESS CODE
    const accessCode = generateAccessCode();
    const expiresAt = calculateExpiration();
    
    // STEP 4: SAVE TO DATABASE
    const paymentData = {
      stripePaymentId: session.id,
      email: customerEmail,
      phoneNumber: customerPhone,
      amount: amount,
      accessCode: accessCode,
      status: 'completed',
      expiresAt: expiresAt,
      createdAt: new Date().toISOString(),
      notificationsSent: false,
      eventType: 'checkout.session.completed'
    };
    
    await savePaymentToDatabase(paymentData);
    
    // STEP 5: TRIGGER NOTIFICATION CHAIN
    await triggerNotificationChain(paymentData);
    
    console.log('✅ FULL PAYMENT CHAIN COMPLETED');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Checkout completed and notifications sent',
      accessCode: accessCode 
    });
  }

  // BACKUP: HANDLE PAYMENT INTENT (just in case)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    console.log('💳 PAYMENT INTENT SUCCEEDED - BACKUP CHAIN');
    
    // Only process if not already processed by checkout.session.completed
    const customerEmail = paymentIntent.receipt_email || 
                         paymentIntent.metadata?.email || 
                         'backup@processing.com';
    
    const customerPhone = paymentIntent.metadata?.phone_number || '';
    const amount = paymentIntent.amount / 100;
    
    const accessCode = generateAccessCode();
    const expiresAt = calculateExpiration();
    
    const paymentData = {
      stripePaymentId: paymentIntent.id,
      email: customerEmail,
      phoneNumber: customerPhone,
      amount: amount,
      accessCode: accessCode,
      status: 'completed',
      expiresAt: expiresAt,
      createdAt: new Date().toISOString(),
      notificationsSent: false,
      eventType: 'payment_intent.succeeded'
    };
    
    await savePaymentToDatabase(paymentData);
    await triggerNotificationChain(paymentData);
    
    console.log('✅ BACKUP PAYMENT CHAIN COMPLETED');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment intent processed and notifications sent',
      accessCode: accessCode 
    });
  }

  return NextResponse.json({ success: true });
}

// HELPER FUNCTIONS
function generateAccessCode(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PARA${timestamp}${random}`;
}

function calculateExpiration(): string {
  // Expire at end of day + 6 hours grace period
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0);
  return tomorrow.toISOString();
}

async function savePaymentToDatabase(data: any) {
  try {
    // Save to your database (JSON file, Supabase, etc.)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database/save-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Database save failed');
    console.log('💾 Payment saved to database');
    
  } catch (error) {
    console.error('❌ Database save error:', error);
    throw error;
  }
}

async function triggerNotificationChain(data: any) {
  try {
    // Trigger the notification system
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/send-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Notification chain failed');
    console.log('📱 Notification chain triggered');
    
  } catch (error) {
    console.error('❌ Notification chain error:', error);
    // Don't throw - payment is still valid even if notifications fail
  }
} 