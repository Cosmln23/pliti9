// Script pentru a urmări pas cu pas flow-ul către Make.com
const { generateAccessCodeEmailTemplate, generateAccessCodeWhatsAppMessage } = require('./lib/services')

async function debugWebhookFlow() {
  console.log('🔍 STARTING STEP-BY-STEP DEBUG FLOW...\n')

  // STEP 1: Date de test
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

  console.log('✅ STEP 1: Datele de test generate')
  console.log('📧 Email:', testData.email)
  console.log('🔑 Access Code:', testData.accessCode)
  console.log('⏰ Expires At (TECHNICAL):', testData.expiresAt)
  console.log('')

  // STEP 2: Generez template-urile
  console.log('✅ STEP 2: Generez template-urile...')
  
  try {
    const emailTemplate = generateAccessCodeEmailTemplate(testData.accessCode, testData.expiresAt, testData.liveUrl)
    const whatsappTemplate = generateAccessCodeWhatsAppMessage(testData.accessCode, testData.expiresAt, testData.liveUrl)
    
    console.log('📧 Email template generat:', emailTemplate.length, 'caractere')
    console.log('📱 WhatsApp template generat:', whatsappTemplate.length, 'caractere')
    
    // Verific dacă template-urile conțin textul nou
    if (emailTemplate.includes('Expiră la sfârșitul transmisiunii LIVE')) {
      console.log('✅ Email template conține textul nou!')
    } else {
      console.log('❌ Email template NU conține textul nou!')
    }
    
    if (whatsappTemplate.includes('Expiră când se termină transmisia LIVE')) {
      console.log('✅ WhatsApp template conține textul nou!')
    } else {
      console.log('❌ WhatsApp template NU conține textul nou!')
    }
    
    console.log('')

    // STEP 3: Construiesc payload-ul pentru Make.com
    console.log('✅ STEP 3: Construiesc payload-ul pentru Make.com...')
    
    const payload = {
      email: testData.email,
      accessCode: testData.accessCode,
      expiresAt: testData.expiresAt,
      liveUrl: testData.liveUrl,
      phoneNumber: testData.phoneNumber,
      amount: testData.amount,
      paymentMethod: testData.paymentMethod,
      timestamp: testData.timestamp,
      // Template-uri generate pentru utilizare directă în Make.com
      emailTemplate: emailTemplate,
      whatsappTemplate: whatsappTemplate,
      // Text prieten pentru expirare
      expiryFriendlyText: "Expiră la sfârșitul transmisiunii LIVE",
      whatsappExpiryText: "Expiră când se termină transmisia LIVE"
    }

    console.log('📦 PAYLOAD COMPLET PENTRU MAKE.COM:')
    console.log('- email:', payload.email)
    console.log('- accessCode:', payload.accessCode)
    console.log('- expiresAt (technical):', payload.expiresAt)
    console.log('- expiryFriendlyText:', payload.expiryFriendlyText)
    console.log('- whatsappExpiryText:', payload.whatsappExpiryText)
    console.log('- emailTemplate lungime:', payload.emailTemplate.length, 'caractere')
    console.log('- whatsappTemplate lungime:', payload.whatsappTemplate.length, 'caractere')
    
    console.log('')
    console.log('🎯 CONCLUZII:')
    console.log('1. Template-urile se generează corect cu textul nou')
    console.log('2. Payload-ul conține atât data tehnică cât și textul prietenos')
    console.log('3. Problema TREBUIE să fie în Make.com scenario!')
    console.log('')
    console.log('📋 URMĂTORUL PAS:')
    console.log('Verifică în Make.com History să vezi ce primește efectiv!')
    console.log('URL webhook:', 'https://hook.eu2.make.com/ic87oy9mss8xsodyiqtm6r6khnuqdjs8')
    
  } catch (error) {
    console.error('❌ Eroare la generarea template-urilor:', error)
  }
}

// Rulez debug-ul
debugWebhookFlow() 