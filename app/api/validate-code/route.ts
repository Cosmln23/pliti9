import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { applyRateLimit, getClientIdentifier, validateAccessCodeAdvanced } from '@/lib/utils';

// CONEXIUNEA 4: Access Code Validation (Final Step)
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting first
    const clientId = getClientIdentifier(request as any)
    const rateLimit = applyRateLimit(clientId, 3, 60000) // 3 requests per minute for validation

    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Prea multe încercări de validare. Încearcă din nou peste 1 minut.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString()
        }
      });
    }

    const { accessCode, email } = await request.json();
    
    console.log('🔑 VALIDATING ACCESS CODE:', accessCode);
    console.log('📧 For email:', email);
    
    // Enhanced access code validation
    const codeValidation = validateAccessCodeAdvanced(accessCode)
    if (!codeValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid access code format',
        message: codeValidation.error
      }, { status: 400 });
    }

    const sanitizedCode = codeValidation.sanitized!
    
    // Email validation if provided
    if (email) {
      if (typeof email !== 'string') {
        return NextResponse.json({
          success: false,
          error: 'Invalid email format',
          message: 'Email trebuie să fie text'
        }, { status: 400 });
      }

      const emailValidation = email.trim().toLowerCase()
      if (emailValidation.length > 254) {
        return NextResponse.json({
          success: false,
          error: 'Email too long',
          message: 'Email prea lung (max 254 caractere)'
        }, { status: 400 });
      }
    }
    
    // Load payments database
    const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
    
    if (!fs.existsSync(paymentsFile)) {
      return NextResponse.json({
        success: false,
        error: 'No payments database found'
      }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(paymentsFile, 'utf-8');
    const payments = JSON.parse(fileContent);
    
    // Find payment by sanitized access code
    const payment = payments.find((p: any) => p.accessCode === sanitizedCode);
    
    if (!payment) {
      console.log('❌ Access code not found:', sanitizedCode);
      return NextResponse.json({
        success: false,
        error: 'Invalid access code',
        message: 'Codul de acces nu este valid sau nu există'
      }, { status: 404 });
    }
    
    // Check if email matches (optional - for extra security)
    if (email && payment.email !== email) {
      console.log('⚠️ Email mismatch for code:', sanitizedCode);
      return NextResponse.json({
        success: false,
        error: 'Email does not match access code',
        message: 'Email-ul nu corespunde cu codul de acces'
      }, { status: 403 });
    }
    
    // Check if code is expired
    const now = new Date();
    const expiration = new Date(payment.expiresAt);
    
    if (now > expiration) {
      console.log('⏰ Access code expired:', sanitizedCode);
      return NextResponse.json({
        success: false,
        error: 'Access code expired',
        message: 'Codul de acces a expirat',
        expiredAt: payment.expiresAt
      }, { status: 410 });
    }
    
    // Check if already used (optional - implement usage tracking)
    if (payment.usedAt) {
      const usedDate = new Date(payment.usedAt).toLocaleString('ro-RO');
      return NextResponse.json({
        success: false,
        error: 'Access code already used',
        message: `Codul a fost deja folosit la ${usedDate}`,
        usedAt: payment.usedAt
      }, { status: 409 });
    }
    
    // Mark as used and update database
    payment.usedAt = new Date().toISOString();
    payment.lastAccess = {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Save updated payment data
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
    
    console.log('✅ Access granted for code:', sanitizedCode);
    
    return NextResponse.json({
      success: true,
      message: 'Access granted',
      accessGranted: true,
      payment: {
        accessCode: payment.accessCode,
        email: payment.email,
        amount: payment.amount,
        createdAt: payment.createdAt,
        expiresAt: payment.expiresAt,
        usedAt: payment.usedAt
      },
      liveUrl: 'https://www.plipli9.com/live',
      welcomeMessage: `Bun venit la transmisia LIVE paranormală! Codul tău ${sanitizedCode} este valid.`
    });
    
  } catch (error) {
    console.error('❌ Code validation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Code validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET method to check code status without using it
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const accessCode = url.searchParams.get('code');
    
    if (!accessCode) {
      return NextResponse.json({
        success: false,
        error: 'Access code is required'
      }, { status: 400 });
    }
    
    const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
    
    if (!fs.existsSync(paymentsFile)) {
      return NextResponse.json({
        success: false,
        error: 'No payments database found'
      }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(paymentsFile, 'utf-8');
    const payments = JSON.parse(fileContent);
    
    const payment = payments.find((p: any) => p.accessCode === accessCode);
    
    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Access code not found'
      }, { status: 404 });
    }
    
    const now = new Date();
    const expiration = new Date(payment.expiresAt);
    const isExpired = now > expiration;
    const isUsed = !!payment.usedAt;
    
    return NextResponse.json({
      success: true,
      code: accessCode,
      isValid: !isExpired && !isUsed,
      isExpired: isExpired,
      isUsed: isUsed,
      expiresAt: payment.expiresAt,
      usedAt: payment.usedAt || null,
      status: isUsed ? 'used' : isExpired ? 'expired' : 'valid'
    });
    
  } catch (error) {
    console.error('❌ Code check error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Code check failed'
    }, { status: 500 });
  }
} 