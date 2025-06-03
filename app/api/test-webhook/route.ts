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
    
    const result = await triggerPaymentSuccessNotification(testData)
    
    return NextResponse.json({
      success: true,
      webhook_sent: result,
      test_data: testData,
      message: result ? 'Webhook trimis cu succes!' : 'Webhook FAILED!'
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