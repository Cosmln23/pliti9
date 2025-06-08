import { NextRequest, NextResponse } from 'next/server';

// CONEXIUNEA 3: Database → All Notification Channels
export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    console.log('📱 STARTING NOTIFICATION CHAIN');
    console.log('📧 Email:', paymentData.email);
    console.log('📱 Phone:', paymentData.phoneNumber);
    console.log('🔑 Code:', paymentData.accessCode);
    
    const results: any = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    };
    
    // STEP 1: Send Email (PRIMARY - most reliable)
    try {
      console.log('📧 Sending EMAIL notification...');
      const emailResult = await sendEmailNotification(paymentData);
      results.email = emailResult;
      console.log('📧 Email result:', emailResult.success ? '✅ SUCCESS' : '❌ FAILED');
    } catch (error) {
      console.error('❌ Email notification failed:', error);
      results.email.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    // STEP 2: Send WhatsApp (SECONDARY - bonus if works)
    try {
      console.log('📱 Sending WhatsApp notification...');
      // Add delay to avoid conflicts (as discussed)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const whatsappResult = await sendWhatsAppNotification(paymentData);
      results.whatsapp = whatsappResult;
      console.log('📱 WhatsApp result:', whatsappResult.success ? '✅ SUCCESS' : '❌ FAILED');
    } catch (error) {
      console.error('❌ WhatsApp notification failed:', error);
      results.whatsapp.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    // STEP 3: Update database with notification status
    try {
      await updateNotificationStatus(paymentData.stripePaymentId, results);
    } catch (error) {
      console.error('⚠️ Failed to update notification status:', error);
    }
    
    console.log('📱 NOTIFICATION CHAIN COMPLETED');
    
    return NextResponse.json({
      success: true,
      message: 'Notification chain executed',
      results: results,
      primarySuccess: results.email.success,
      backupSuccess: results.whatsapp.success
    });
    
  } catch (error) {
    console.error('❌ Notification chain error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Notification chain failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function sendEmailNotification(paymentData: any) {
  try {
    const emailPayload = {
      email: paymentData.email,
      accessCode: paymentData.accessCode,
      amount: paymentData.amount,
      phoneNumber: paymentData.phoneNumber,
      expiresAt: paymentData.expiresAt,
      liveUrl: 'https://www.plipli9.com/live',
      timestamp: paymentData.createdAt
    };
    
    const WEBHOOKS = {
      payment_success: 'https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n'
    };
    
    const response = await fetch(WEBHOOKS.payment_success, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Email webhook failed: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('📧 Email webhook response:', responseText);
    
    return { success: true, response: responseText };
    
  } catch (error) {
    console.error('❌ Email notification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function sendWhatsAppNotification(paymentData: any) {
  try {
    const whatsappMessage = `🎭 PARANORMAL ACCESS GRANTED!

Codul tău de acces: ${paymentData.accessCode}

💰 Sumă plătită: ${paymentData.amount} RON
⏰ Expiră: ${new Date(paymentData.expiresAt).toLocaleDateString('ro-RO')}
🔗 Link LIVE: https://www.plipli9.com/live

Intră cu codul pe site și explorează paranormalul alături de Plipli9! 👻

--- Plipli9 Paranormal ---`;

    const whatsappPayload = {
      phoneNumber: paymentData.phoneNumber,
      message: whatsappMessage,
      accessCode: paymentData.accessCode
    };
    
    const WEBHOOKS = {
      whatsapp_test: 'https://hook.eu2.make.com/ida0ge74962m4ske2bw78ywj9szu54ie'
    };
    
    const response = await fetch(WEBHOOKS.whatsapp_test, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(whatsappPayload),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`WhatsApp webhook failed: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('📱 WhatsApp webhook response:', responseText);
    
    return { success: true, response: responseText };
    
  } catch (error) {
    console.error('❌ WhatsApp notification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function updateNotificationStatus(stripePaymentId: string, results: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database/update-notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stripePaymentId: stripePaymentId,
        notificationsSent: true,
        emailSuccess: results.email.success,
        whatsappSuccess: results.whatsapp.success,
        notificationResults: results,
        updatedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification status');
    }
    
    console.log('✅ Notification status updated in database');
    
  } catch (error) {
    console.error('❌ Failed to update notification status:', error);
    throw error;
  }
} 