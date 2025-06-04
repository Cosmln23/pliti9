import { NextResponse } from 'next/server'
import { triggerPaymentSuccessNotification } from '@/lib/make-automation'

export async function POST() {
  try {
    console.log('🧪 TESTING MAKE.COM WEBHOOK...')
    
    const testData = {
      accessCode: 'PLITEST1',
      email: 'test@plipli9.com',
      phoneNumber: '+40712345678',
      amount: 25.00,
      paymentMethod: 'stripe',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      liveUrl: 'https://www.plipli9.com/live',
      timestamp: new Date().toISOString()
    }
    
    console.log('📤 DATA SENT TO MAKE.COM:')
    console.log('- accessCode:', testData.accessCode)
    console.log('- email:', testData.email)
    console.log('- expiresAt (TECHNICAL):', testData.expiresAt)
    console.log('- SHOULD ALSO SEND:')
    console.log('  - expiryFriendlyText: "Expiră la sfârșitul transmisiunii LIVE"')
    console.log('  - whatsappExpiryText: "Expiră când se termină transmisia LIVE"')
    
    const result = await triggerPaymentSuccessNotification(testData)
    
    return NextResponse.json({
      success: true,
      webhook_sent: result,
      test_data: testData,
      message: result ? 'Webhook trimis cu succes!' : 'Webhook FAILED!',
      debug_info: {
        technical_date: testData.expiresAt,
        friendly_text: "Expiră la sfârșitul transmisiunii LIVE",
        whatsapp_text: "Expiră când se termină transmisia LIVE",
        note: "Dacă emailul încă arată data tehnică, problema e în Make.com scenario!"
      }
    })
    
  } catch (error) {
    console.error('Test webhook failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test webhook endpoint - use POST to trigger test'
  })
} 