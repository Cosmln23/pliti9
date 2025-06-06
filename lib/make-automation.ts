// Make.com Automation Service pentru Notificări Automate
import axios from 'axios'
import { generateAccessCodeEmailTemplate, generateAccessCodeWhatsAppMessage } from './services'

// Tipuri pentru webhook data
export interface PaymentWebhookData {
  accessCode: string
  email: string
  phoneNumber?: string
  amount: number
  paymentMethod: string
  expiresAt: string
  liveUrl: string
  timestamp: string
}

export interface LiveStartedWebhookData {
  sessionId: string
  playbackUrl: string
  startTime: string
  location: string
  estimatedDuration: number
  source: 'mobile' | 'desktop'
  activeCodesCount?: number
}

export interface ReminderWebhookData {
  accessCode: string
  email: string
  phoneNumber?: string
  hoursRemaining: number
  expiresAt: string
  liveUrl: string
}

// Make.com Webhook URLs (configurate în environment)
const WEBHOOKS = {
  payment_success: process.env.MAKE_PAYMENT_WEBHOOK_URL || 'https://hook.eu2.make.com/ic87oy9mss8xsodyiqtm6r6khnuqdjs8',
  whatsapp_test: 'https://hook.eu2.make.com/ida0ge74962m4ske2bw78ywj9szu54ie',
  live_started: process.env.MAKE_LIVE_STARTED_WEBHOOK_URL,
  reminder_2h: process.env.MAKE_REMINDER_WEBHOOK_URL,
  live_ended: process.env.MAKE_LIVE_ENDED_WEBHOOK_URL
}

/**
 * Trimite webhook la Make.com pentru notificare după plată
 */
export async function triggerPaymentSuccessNotification(data: PaymentWebhookData): Promise<boolean> {
  try {
    // WEBHOOK REAL ACTIVAT - Se trimite către Make.com indiferent de DEMO_MODE
    console.log('🚀 Sending webhook to Make.com:', {
      code: data.accessCode,
      email: data.email,
      phone: data.phoneNumber,
      amount: data.amount,
      webhook_url: WEBHOOKS.payment_success
    })

    if (!WEBHOOKS.payment_success) {
      console.warn('Make.com payment webhook URL not configured')
      return false
    }

    // Pregătire payload pentru Make.com - format simplu pentru variabilele {{1.variabila}}
    const payload = {
      email: data.email,
      accessCode: data.accessCode,
      expiresAt: "Expiră la sfârșitul transmisiunii LIVE",
      expiresAtWhatsApp: "Expiră când se termină transmisia LIVE",
      expiresAtTechnical: data.expiresAt,
      liveUrl: data.liveUrl,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      timestamp: data.timestamp,
      // Template-uri generate pentru utilizare directă în Make.com
      emailTemplate: generateAccessCodeEmailTemplate(data.accessCode, data.expiresAt, data.liveUrl),
      whatsappTemplate: generateAccessCodeWhatsAppMessage(data.accessCode, data.expiresAt, data.liveUrl),
      // Text prieten pentru expirare
      expiryFriendlyText: "Expiră la sfârșitul transmisiunii LIVE",
      whatsappExpiryText: "Expiră când se termină transmisia LIVE"
    }

    console.log('📨 PAYLOAD SENT TO MAKE.COM:', JSON.stringify(payload, null, 2))
    console.log('📧 Email value specifically:', payload.email)

    // Trimite la Make.com - Gmail Webhook
    const emailResponse = await axios.post(WEBHOOKS.payment_success, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'plipli9-paranormal',
        'X-Webhook-Secret': process.env.MAKE_WEBHOOK_SECRET
      },
      timeout: 10000 // 10 secunde timeout
    })

    console.log('✅ Gmail notification sent to Make.com:', emailResponse.status)

    // Trimite la Make.com - WhatsApp Webhook
    let whatsappResponse;
    try {
      whatsappResponse = await axios.post(WEBHOOKS.whatsapp_test, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'plipli9-paranormal-whatsapp',
          'X-Webhook-Secret': process.env.MAKE_WEBHOOK_SECRET
        },
        timeout: 10000
      })
      console.log('✅ WhatsApp notification sent to Make.com:', whatsappResponse.status)
    } catch (error) {
      console.error('❌ WhatsApp webhook failed:', error)
    }

    return true

  } catch (error) {
    console.error('❌ Error sending payment notification to Make.com:', error)
    return false
  }
}

/**
 * Trimite webhook la Make.com când începe LIVE session
 */
export async function triggerLiveStartedNotification(data: LiveStartedWebhookData): Promise<boolean> {
  try {
    // În DEMO mode, doar loghează
    if (process.env.DEMO_MODE === 'true') {
      console.log('[DEMO] Live Started Notification:', {
        sessionId: data.sessionId,
        location: data.location,
        duration: data.estimatedDuration,
        source: data.source
      })
      return true
    }

    if (!WEBHOOKS.live_started) {
      console.warn('Make.com live started webhook URL not configured')
      return false
    }

    // Pregătire payload pentru Make.com
    const payload = {
      event_type: 'live_started',
      timestamp: data.startTime,
      session: {
        id: data.sessionId,
        playback_url: data.playbackUrl,
        location: data.location,
        estimated_duration: data.estimatedDuration,
        source: data.source
      },
      notifications: {
        broadcast_to_active_codes: true,
        send_social_media_posts: true,
        template_type: 'live_started_alert'
      },
      stats: {
        active_codes_count: data.activeCodesCount || 0,
        estimated_viewers: Math.floor((data.activeCodesCount || 0) * 0.7) // 70% show rate estimat
      }
    }

    // Trimite la Make.com
    const response = await axios.post(WEBHOOKS.live_started, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'plipli9-paranormal',
        'X-Webhook-Secret': process.env.MAKE_WEBHOOK_SECRET
      },
      timeout: 10000
    })

    console.log('🔴 Live started notification sent to Make.com:', response.status)
    return true

  } catch (error) {
    console.error('❌ Error sending live started notification to Make.com:', error)
    return false
  }
}

/**
 * Trimite reminder-uri pentru coduri care expiră în 2 ore
 */
export async function triggerExpirationReminders(reminders: ReminderWebhookData[]): Promise<boolean> {
  try {
    // În DEMO mode, doar loghează
    if (process.env.DEMO_MODE === 'true') {
      console.log('[DEMO] Expiration Reminders:', {
        count: reminders.length,
        codes: reminders.map(r => r.accessCode)
      })
      return true
    }

    if (!WEBHOOKS.reminder_2h) {
      console.warn('Make.com reminder webhook URL not configured')
      return false
    }

    // Batch process reminders
    const payload = {
      event_type: 'expiration_reminders',
      timestamp: new Date().toISOString(),
      reminders: reminders.map(reminder => ({
        access_code: {
          code: reminder.accessCode,
          expires_at: reminder.expiresAt,
          hours_remaining: reminder.hoursRemaining,
          live_url: reminder.liveUrl
        },
        customer: {
          email: reminder.email,
          phone_number: reminder.phoneNumber
        }
      })),
      notifications: {
        send_email: true,
        send_whatsapp: true,
        template_type: 'expiration_reminder'
      },
      stats: {
        total_reminders: reminders.length,
        email_count: reminders.length,
        whatsapp_count: reminders.filter(r => r.phoneNumber).length
      }
    }

    // Trimite la Make.com
    const response = await axios.post(WEBHOOKS.reminder_2h, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'plipli9-paranormal',
        'X-Webhook-Secret': process.env.MAKE_WEBHOOK_SECRET
      },
      timeout: 15000 // 15 secunde pentru batch processing
    })

    console.log('⏰ Expiration reminders sent to Make.com:', response.status)
    return true

  } catch (error) {
    console.error('❌ Error sending expiration reminders to Make.com:', error)
    return false
  }
}

/**
 * Notificare când se termină LIVE session
 */
export async function triggerLiveEndedNotification(sessionId: string, stats: any): Promise<boolean> {
  try {
    // În DEMO mode, doar loghează
    if (process.env.DEMO_MODE === 'true') {
      console.log('[DEMO] Live Ended Notification:', { sessionId, stats })
      return true
    }

    if (!WEBHOOKS.live_ended) {
      console.warn('Make.com live ended webhook URL not configured')
      return false
    }

    const payload = {
      event_type: 'live_ended',
      timestamp: new Date().toISOString(),
      session: {
        id: sessionId,
        ended_at: new Date().toISOString(),
        duration_minutes: stats.duration_minutes || 0,
        peak_viewers: stats.peak_viewers || 0,
        total_messages: stats.total_messages || 0
      },
      notifications: {
        send_summary_email: true,
        post_social_media_recap: true
      }
    }

    const response = await axios.post(WEBHOOKS.live_ended, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'plipli9-paranormal',
        'X-Webhook-Secret': process.env.MAKE_WEBHOOK_SECRET
      },
      timeout: 10000
    })

    console.log('⏹️ Live ended notification sent to Make.com:', response.status)
    return true

  } catch (error) {
    console.error('❌ Error sending live ended notification to Make.com:', error)
    return false
  }
}

/**
 * Helper function pentru verificarea configurării Make.com
 */
export function checkMakeConfiguration(): { configured: boolean, missing: string[] } {
  const missing: string[] = []
  
  if (!WEBHOOKS.payment_success) missing.push('MAKE_PAYMENT_WEBHOOK_URL')
  if (!WEBHOOKS.live_started) missing.push('MAKE_LIVE_STARTED_WEBHOOK_URL')
  if (!WEBHOOKS.reminder_2h) missing.push('MAKE_REMINDER_WEBHOOK_URL')
  if (!WEBHOOKS.live_ended) missing.push('MAKE_LIVE_ENDED_WEBHOOK_URL')
  if (!process.env.MAKE_WEBHOOK_SECRET) missing.push('MAKE_WEBHOOK_SECRET')

  return {
    configured: missing.length === 0,
    missing
  }
}

/**
 * Test webhook pentru verificarea conectivității Make.com
 */
export async function testMakeWebhook(): Promise<{ success: boolean, results: any[] }> {
  const results = []

  // Test payment webhook
  if (WEBHOOKS.payment_success) {
    try {
      const testPayload = {
        event_type: 'test',
        timestamp: new Date().toISOString(),
        test_data: { webhook_type: 'payment_success' }
      }
      
      await axios.post(WEBHOOKS.payment_success, testPayload, { timeout: 5000 })
      results.push({ webhook: 'payment_success', status: 'success' })
    } catch (error) {
      results.push({ webhook: 'payment_success', status: 'error', error: error })
    }
  }

  // Test live started webhook
  if (WEBHOOKS.live_started) {
    try {
      const testPayload = {
        event_type: 'test',
        timestamp: new Date().toISOString(),
        test_data: { webhook_type: 'live_started' }
      }
      
      await axios.post(WEBHOOKS.live_started, testPayload, { timeout: 5000 })
      results.push({ webhook: 'live_started', status: 'success' })
    } catch (error) {
      results.push({ webhook: 'live_started', status: 'error', error: error })
    }
  }

  const success = results.every(r => r.status === 'success')
  return { success, results }
} 