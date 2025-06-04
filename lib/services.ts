import twilio from 'twilio'
import sgMail from '@sendgrid/mail'
import { Livepeer } from 'livepeer'

// Initialize services
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
const livepeer = new Livepeer({ apiKey: process.env.LIVEPEER_API_KEY })

// Make.com Webhook Types
export interface PaymentWebhookData {
  accessCode: string
  email: string
  phone_number?: string
  amount: number
  paymentMethod: string
  paymentIntentId?: string
  expiresAt: string
  createdAt: string
  status: string
  type: string
}

export interface LiveStartedWebhookData {
  sessionId: string
  playbackUrl: string
  startTime: string
  location?: string
  estimatedDuration: number
  source: string
}

// Make.com Webhook Functions
export async function triggerMakeWebhook(type: 'payment' | 'live-started', data: PaymentWebhookData | LiveStartedWebhookData) {
  const webhookUrl = type === 'payment' 
    ? process.env.MAKE_PAYMENT_WEBHOOK_URL 
    : process.env.MAKE_LIVE_STARTED_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn(`Make.com webhook URL not configured for type: ${type}`)
    return
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAKE_WEBHOOK_SECRET || ''}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`)
    }

    console.log(`Make.com webhook triggered successfully for ${type}`)
  } catch (error) {
    console.error(`Make.com webhook error for ${type}:`, error)
  }
}

// WhatsApp Functions (Twilio)
export async function sendWhatsAppMessage(to: string, message: string) {
  if (!process.env.TWILIO_WHATSAPP_FROM) {
    console.warn('Twilio WhatsApp not configured')
    return
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`
    })

    console.log(`WhatsApp message sent to ${to}: ${result.sid}`)
    return result
  } catch (error) {
    console.error(`WhatsApp error for ${to}:`, error)
    throw error
  }
}

// Email Functions (SendGrid)
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn('SendGrid not configured')
    return
  }

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html: htmlContent
    }

    const result = await sgMail.send(msg)
    console.log(`Email sent to ${to}`)
    return result
  } catch (error) {
    console.error(`Email error for ${to}:`, error)
    throw error
  }
}

// Livepeer Functions - TEMPORAR DISABLED până la API key
export async function createLivepeerStream(name?: string) {
  // TODO: Uncomment when Livepeer API key is provided
  console.warn('Livepeer API not configured yet')
  
  // Mock response pentru acum
  const mockStreamKey = `plipli9_${Date.now()}`
  const mockPlaybackId = `plb_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    streamKey: mockStreamKey,
    playbackId: mockPlaybackId,
    rtmpUrl: `rtmp://rtmp.livepeer.com/live/${mockStreamKey}`,
    playbackUrl: `https://lvpr.tv?v=${mockPlaybackId}`
  }
  
  /*
  try {
    const stream = await livepeer.stream.create({
      name: name || `Plipli9-Live-${Date.now()}`,
      profiles: [
        { name: "720p", bitrate: 2000000, fps: 30, width: 1280, height: 720 },
        { name: "480p", bitrate: 1000000, fps: 30, width: 854, height: 480 },
        { name: "360p", bitrate: 500000, fps: 30, width: 640, height: 360 }
      ]
    })

    return {
      streamKey: stream.streamKey,
      playbackId: stream.playbackId,
      rtmpUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
      playbackUrl: `https://lvpr.tv?v=${stream.playbackId}`
    }
  } catch (error) {
    console.error('Livepeer stream creation error:', error)
    throw error
  }
  */
}

export async function getLivepeerStreamStatus(streamId: string) {
  // TODO: Uncomment when Livepeer API key is provided
  console.warn('Livepeer API not configured yet')
  return { status: 'mock', id: streamId }
  
  /*
  try {
    const stream = await livepeer.stream.get(streamId)
    return stream
  } catch (error) {
    console.error(`Livepeer stream status error for ${streamId}:`, error)
    throw error
  }
  */
}

// Template Functions
export function generateAccessCodeEmailTemplate(accessCode: string, expiresAt: string, liveUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>🎃 Plipli9 Paranormal - Cod Acces LIVE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#0f172a; color:#ffffff; font-family:Arial,sans-serif;">
    <div style="max-width:600px; margin:0 auto; padding:20px;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:30px;">
            <h1 style="color:#d946ef; font-size:32px; margin:0;">🎃 PLIPLI9</h1>
            <h2 style="color:#94a3b8; font-size:18px; margin:10px 0 0 0;">PARANORMAL EXPERIENCE</h2>
        </div>
        
        <!-- Cod de acces -->
        <div style="background:#1e293b; padding:30px; border-radius:15px; text-align:center; margin:20px 0;">
            <h3 style="color:#22c55e; font-size:16px; margin:0 0 10px 0;">CODUL TĂU DE ACCES</h3>
            <div style="background:#0f172a; padding:20px; border-radius:10px; margin:15px 0;">
                <span style="color:#22c55e; font-size:40px; font-weight:bold; letter-spacing:3px;">${accessCode}</span>
            </div>
            <p style="color:#f59e0b; font-weight:bold; margin:15px 0 5px 0;">⏰ VALABIL 8 ORE</p>
            <p style="color:#94a3b8; margin:0; font-size:14px;">Expiră la sfârșitul transmisiunii LIVE</p>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align:center; margin:30px 0;">
            <a href="${liveUrl}" style="background:linear-gradient(135deg, #d946ef, #9333ea); color:white; padding:18px 40px; text-decoration:none; border-radius:12px; font-size:18px; font-weight:bold; display:inline-block; box-shadow:0 4px 15px rgba(217,70,239,0.3);">
                🔴 INTRĂ ÎN LIVE ACUM
            </a>
        </div>
        
        <!-- Benefits -->
        <div style="background:#16a34a; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#dcfce7; margin:0 0 15px 0; font-size:16px;">✅ ACCES FLEXIBIL</h4>
            <ul style="color:#dcfce7; margin:0; padding-left:20px; line-height:1.6;">
                <li>Poți intra și ieși de câte ori vrei în 8 ore</li>
                <li>Acces de pe telefon, tablet sau computer</li>
                <li>Chat live cu alți participanți</li>
            </ul>
        </div>
        
        <!-- Technical Protection -->
        <div style="background:#1e40af; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#dbeafe; margin:0 0 15px 0; font-size:16px;">🛡️ PROTECȚIE TEHNICĂ</h4>
            <p style="color:#dbeafe; margin:0; line-height:1.6;">
                Chiar dacă LIVE-ul se întrerupe din probleme tehnice, codul tău rămâne valabil! 
                Poți intra din nou când se reia transmisia.
            </p>
        </div>
        
        <!-- Instructions -->
        <div style="background:#374151; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#f3f4f6; margin:0 0 15px 0;">📱 CUM FUNCȚIONEAZĂ:</h4>
            <ol style="color:#d1d5db; margin:0; padding-left:25px; line-height:1.8;">
                <li>Click pe butonul "INTRĂ ÎN LIVE ACUM"</li>
                <li>Introdu codul de acces pe pagina LIVE</li>
                <li>Bucură-te de experiența paranormală în direct!</li>
                <li>Folosește chat-ul pentru a interacționa</li>
                <li>Poți ieși și intra din nou oricând în 8 ore</li>
            </ol>
        </div>
        
        <!-- Footer -->
        <div style="text-align:center; margin-top:40px; padding-top:20px; border-top:1px solid #374151;">
            <p style="color:#6b7280; font-size:12px; margin:0;">
                Probleme? Scrie-ne la <a href="mailto:contact@plipli9paranormal.com" style="color:#d946ef;">contact@plipli9paranormal.com</a>
            </p>
            <p style="color:#6b7280; font-size:12px; margin:10px 0 0 0;">
                © 2024 Plipli9 Paranormal. Nu împărtăși codul cu nimeni!
            </p>
        </div>
    </div>
</body>
</html>
  `
}

export function generateAccessCodeWhatsAppMessage(accessCode: string, expiresAt: string, liveUrl: string): string {
  return `🎃 *PLIPLI9 PARANORMAL* 🎃

✅ *Plata confirmată!*

━━━━━━━━━━━━━━━━━━━━━━━━
🎫 *COD DE ACCES:*
*${accessCode}*
━━━━━━━━━━━━━━━━━━━━━━━━

⏰ *VALABIL 8 ORE*
Expiră când se termină transmisia LIVE

🔴 *Link LIVE:*
${liveUrl}

✅ *BENEFICII:*
• Poți intra/ieși oricând în 8h
• Chiar dacă se întrerupe, codul rămâne valabil
• Acces de pe orice device
• Chat live cu alți participanți

🎭 Bucură-te de experiența paranormală! 👻

_Nu împărtăși codul cu nimeni!_`
}

export function generateLiveStartedWhatsAppMessage(location: string, startTime: string, liveUrl: string, duration: number): string {
  return `🔴 *LIVE PARANORMAL ACUM!* 🔴

📍 *Locația:* ${location}
🕘 *Început:* ${startTime}

Plipli9 a început investigația LIVE!
🎃 Intră acum cu codul tău!

🔗 *Link direct:* ${liveUrl}

⏰ Estimat: ${duration} minute de paranormal intens!

Grăbește-te să nu pierzi momentele epice! 👻`
} 