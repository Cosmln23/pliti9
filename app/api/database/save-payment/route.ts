import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// CONEXIUNEA 2: Webhook → Database Storage
export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    console.log('💾 SAVING PAYMENT TO DATABASE');
    
    // Add unique ID and timestamp
    paymentData.id = generateUniqueId();
    paymentData.savedAt = new Date().toISOString();
    
    // Load existing payments
    const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
    let payments = [];
    
    try {
      const fileContent = fs.readFileSync(paymentsFile, 'utf-8');
      payments = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      console.log('📁 Creating new payments database');
      
      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    
    // Check for duplicates by Stripe Payment ID
    const existingPayment = payments.find((p: any) => p.stripePaymentId === paymentData.stripePaymentId);
    if (existingPayment) {
      console.log('⚠️ Payment already exists, updating instead');
      existingPayment.updatedAt = new Date().toISOString();
      existingPayment.status = paymentData.status;
      existingPayment.notificationsSent = paymentData.notificationsSent;
    } else {
      // Add new payment
      payments.push(paymentData);
      console.log('✅ New payment added to database');
    }
    
    // Save back to file
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
    
    // Also save individual payment file for quick access
    const individualFile = path.join(process.cwd(), 'data', 'payments', `${paymentData.accessCode}.json`);
    const paymentDir = path.dirname(individualFile);
    if (!fs.existsSync(paymentDir)) {
      fs.mkdirSync(paymentDir, { recursive: true });
    }
    fs.writeFileSync(individualFile, JSON.stringify(paymentData, null, 2));
    
    console.log('💾 Payment saved successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Payment saved to database',
      paymentId: paymentData.id,
      accessCode: paymentData.accessCode
    });
    
  } catch (error) {
    console.error('❌ Database save error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to save payment to database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateUniqueId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// GET method to retrieve payments
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const accessCode = url.searchParams.get('code');
    
    const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
    
    if (!fs.existsSync(paymentsFile)) {
      return NextResponse.json({ payments: [] });
    }
    
    const fileContent = fs.readFileSync(paymentsFile, 'utf-8');
    let payments = JSON.parse(fileContent);
    
    // Filter by email or access code if provided
    if (email) {
      payments = payments.filter((p: any) => p.email === email);
    }
    
    if (accessCode) {
      payments = payments.filter((p: any) => p.accessCode === accessCode);
    }
    
    return NextResponse.json({
      success: true,
      payments: payments,
      count: payments.length
    });
    
  } catch (error) {
    console.error('❌ Database read error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to read payments from database'
    }, { status: 500 });
  }
} 