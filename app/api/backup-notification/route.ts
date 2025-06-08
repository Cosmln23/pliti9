import { NextRequest, NextResponse } from 'next/server';

// Backup notification when WhatsApp fails
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, fallback_email } = await request.json();
    
    console.log('🚨 BACKUP NOTIFICATION - WhatsApp failed, using email');
    
    // Create email fallback message
    const emailMessage = `
🚨 NOTIFICARE BACKUP PARANORMAL

Mesajul WhatsApp a eșuat, folosim email-ul ca backup:

📱 Număr destinație: ${phoneNumber}
💬 Mesaj original: ${message}

⚠️ WhatsApp Status: FAILED sau TIMEOUT
📧 Backup folosit: EMAIL

Verifică și pe WhatsApp în caz că ajunge târziu!

---
Plipli9 Paranormal - Backup System
    `;
    
    // Send backup email
    const emailWebhook = 'https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n';
    
    const emailPayload = {
      email: fallback_email || 'plitan_darius9@yahoo.com',
      subject: '🚨 WhatsApp BACKUP - Notificare Paranormal',
      message: emailMessage,
      backup_mode: true
    };
    
    const emailResponse = await fetch(emailWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });
    
    return NextResponse.json({
      success: true,
      backup_used: 'email',
      original_target: phoneNumber,
      fallback_email: fallback_email || 'plitan_darius9@yahoo.com',
      message: 'WhatsApp failed, email backup sent!'
    });
    
  } catch (error) {
    console.error('❌ Backup notification failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Both WhatsApp and backup failed',
      message: 'All notification methods failed'
    }, { status: 500 });
  }
} 