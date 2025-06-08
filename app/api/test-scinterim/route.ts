import { NextResponse } from 'next/server'
import { triggerPaymentSuccessNotification } from '@/lib/make-automation'

export async function GET() {
  try {
    console.log('🧪 TESTING EMAIL TO SCINTERIM09@GMAIL.COM...')
    
    const testData = {
      accessCode: 'SCITEST1',
      email: 'scinterim09@gmail.com',
      phoneNumber: '+40793608454',
      amount: 25.00,
      paymentMethod: 'stripe',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      liveUrl: 'https://www.plipli9.com/live',
      timestamp: new Date().toISOString()
    }
    
    console.log('📤 TESTING EMAIL SYSTEM FOR SCINTERIM:')
    console.log('- accessCode:', testData.accessCode)
    console.log('- email:', testData.email)
    console.log('- Sending via Make.com automation...')
    
    const result = await triggerPaymentSuccessNotification(testData)
    
    return NextResponse.json({
      success: true,
      webhook_sent: result,
      test_data: testData,
      message: result ? '✅ EMAIL TEST TRIMIS LA SCINTERIM09@GMAIL.COM!' : '❌ Webhook FAILED!',
      instructions: {
        check_email: 'Verifică inbox-ul la scinterim09@gmail.com',
        check_spam: 'Verifică și folderul spam/junk',
        estimated_delivery: '1-2 minute prin Make.com',
        subject_line: '🎃 Cod de acces LIVE Paranormal Plipli9'
      },
      debug_info: {
        email_destination: testData.email,
        access_code: testData.accessCode,
        template_type: 'paranormal_access_code',
        automation_provider: 'Make.com + SendGrid'
      }
    })
    
  } catch (error) {
    console.error('Scinterim test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Eroare la trimiterea email-ului de test'
    }, { status: 500 })
  }
} 