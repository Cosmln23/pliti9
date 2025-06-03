import { NextRequest, NextResponse } from 'next/server'
import { getActiveAccessCodes } from '@/lib/database'
import { triggerLiveStartedNotification } from '@/lib/make-automation'

export async function POST(request: NextRequest) {
  try {
    const {
      session_id,
      location,
      playback_url,
      estimated_duration,
      started_at,
      stream_source = 'mobile'
    } = await request.json()

    // Validare payload
    if (!session_id || !location || !playback_url) {
      return NextResponse.json(
        { 
          error: 'Date incomplete',
          message: 'session_id, location și playback_url sunt obligatorii'
        },
        { status: 400 }
      )
    }

    console.log('🚨 Live session started webhook triggered:', session_id)

    // Obține toate codurile de acces active pentru notificare mass
    const activeAccessCodes = await getActiveAccessCodes()
    console.log(`📊 Found ${activeAccessCodes.length} active access codes for notification`)

    if (activeAccessCodes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Live session started but no active users to notify',
        session: {
          session_id,
          location,
          playback_url,
          started_at: started_at || new Date().toISOString()
        },
        notifications: {
          active_codes: 0,
          emails_sent: 0,
          whatsapp_sent: 0,
          make_automation_triggered: false
        }
      })
    }

    // Pregătește datele pentru Make.com automation - interfața corectă
    const notificationData = {
      sessionId: session_id,
      playbackUrl: playback_url,
      startTime: started_at || new Date().toISOString(),
      location: location,
      estimatedDuration: estimated_duration || 120,
      source: stream_source as 'mobile' | 'desktop',
      activeCodesCount: activeAccessCodes.length
    }

    // Trigger Make.com automation pentru notificări mass
    console.log('📧 Triggering Make.com mass notifications...')
    const automationTriggered = await triggerLiveStartedNotification(notificationData)

    // Statistici pentru răspuns
    const emailCount = activeAccessCodes.filter(code => code.email).length
    const whatsappCount = activeAccessCodes.filter(code => code.phone_number).length

    return NextResponse.json({
      success: true,
      message: 'Live session started - Mass notifications triggered!',
      session: {
        session_id,
        location,
        playback_url,
        estimated_duration: estimated_duration || 120,
        started_at: started_at || new Date().toISOString(),
        stream_source
      },
      notifications: {
        active_codes: activeAccessCodes.length,
        emails_scheduled: emailCount,
        whatsapp_scheduled: whatsappCount,
        make_automation_triggered: automationTriggered,
        delivery_time: 'în maximum 2 minute'
      },
      automation: {
        webhook_sent: automationTriggered,
        email_template: 'Live Paranormal Started Notification',
        whatsapp_template: 'Live Broadcast Alert',
        social_media: 'Auto-post scheduled',
        analytics: 'Event tracked'
      },
      recipients: activeAccessCodes.map(code => ({
        email: code.email,
        phone: code.phone_number ? '***' + code.phone_number.slice(-4) : null,
        access_code: code.code,
        expires_in_hours: Math.floor((new Date(code.expires_at).getTime() - Date.now()) / (1000 * 60 * 60))
      }))
    })

  } catch (error) {
    console.error('Error in live session started webhook:', error)
    
    return NextResponse.json(
      { 
        error: 'Eroare internă server',
        message: 'Nu s-au putut trimite notificările pentru sesiunea LIVE'
      },
      { status: 500 }
    )
  }
}

// GET endpoint pentru verificarea webhook-ului
export async function GET() {
  try {
    const activeAccessCodes = await getActiveAccessCodes()
    
    return NextResponse.json({
      service: 'Live Session Started Webhook',
      status: 'active',
      timestamp: new Date().toISOString(),
      ready_for_notifications: true,
      current_active_codes: activeAccessCodes.length,
      webhook_capabilities: {
        mass_email: true,
        mass_whatsapp: true,
        social_media_auto_post: true,
        analytics_tracking: true,
        make_com_automation: true
      },
      templates: {
        email: 'Live Paranormal Started - HTML with location and timing',
        whatsapp: 'LIVE PARANORMAL ACUM! Quick notification with access link',
        social: 'Instagram/Facebook auto-post with live details'
      },
      usage: {
        endpoint: 'POST /api/webhooks/live-session-started',
        required_fields: ['session_id', 'location', 'playback_url'],
        optional_fields: ['estimated_duration', 'started_at', 'stream_source']
      }
    })

  } catch (error) {
    console.error('Error checking live session webhook status:', error)
    
    return NextResponse.json(
      { error: 'Eroare la verificarea webhook-ului' },
      { status: 500 }
    )
  }
} 