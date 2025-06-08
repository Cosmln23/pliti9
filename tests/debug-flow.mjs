// Debug script pentru verificarea template-urilor
console.log('🔍 STARTING STEP-BY-STEP DEBUG FLOW...\n')

// STEP 1: Simulez generarea template-urilor manual
const testData = {
  accessCode: 'PLITEST1',
  email: 'test@plipli9.com',
  phoneNumber: '+40712345678',
  amount: 25.00,
  paymentMethod: 'stripe',
  expiresAt: '2025-06-04T06:18:15.740Z',
  liveUrl: 'https://www.plipli9.com/live',
  timestamp: new Date().toISOString()
}

console.log('✅ STEP 1: Date de test')
console.log('📧 Email:', testData.email)
console.log('🔑 Access Code:', testData.accessCode)
console.log('⏰ Expires At (TECHNICAL):', testData.expiresAt)
console.log('')

// STEP 2: Verific ce ar trebui să conțină template-urile
console.log('✅ STEP 2: Template-uri așteptate')

const expectedEmailText = "Expiră la sfârșitul transmisiunii LIVE"
const expectedWhatsAppText = "Expiră când se termină transmisia LIVE"

console.log('📧 Email ar trebui să conțină:', expectedEmailText)
console.log('📱 WhatsApp ar trebui să conțină:', expectedWhatsAppText)
console.log('')

// STEP 3: Payload pentru Make.com
console.log('✅ STEP 3: Payload pentru Make.com')

const payload = {
  email: testData.email,
  accessCode: testData.accessCode,
  expiresAt: testData.expiresAt,
  liveUrl: testData.liveUrl,
  phoneNumber: testData.phoneNumber,
  amount: testData.amount,
  paymentMethod: testData.paymentMethod,
  timestamp: testData.timestamp,
  // Text prieten pentru expirare
  expiryFriendlyText: expectedEmailText,
  whatsappExpiryText: expectedWhatsAppText
}

console.log('📦 PAYLOAD TRIMIS CĂTRE MAKE.COM:')
Object.entries(payload).forEach(([key, value]) => {
  console.log(`- ${key}:`, value)
})

console.log('')
console.log('🎯 ANALIZA PROBLEMEI:')
console.log('')
console.log('❓ TEORII POSIBILE:')
console.log('1. 🔄 Make.com folosește cache și nu vede noile câmpuri')
console.log('2. 📝 Template-ul din Make.com încă folosește {{expiresAt}} în loc de {{expiryFriendlyText}}')
console.log('3. 📨 Make.com ignoră câmpurile noi și folosește doar cele cunoscute')
console.log('4. 🏃 Make.com execută într-o ordine greșită')
console.log('')
console.log('🔍 VERIFICĂRI NECESARE:')
console.log('✅ Codul nostru trimite template-urile corecte')
console.log('❓ Make.com primește template-urile? → Verifică History în Make.com')
console.log('❓ Make.com folosește template-urile? → Verifică configurația modulului Email')
console.log('')
console.log('🚨 SOLUȚIA PROBABILĂ:')
console.log('În Make.com modulul Email trebuie schimbat din:')
console.log('   {{expiresAt}} → {{expiryFriendlyText}}')
console.log('Sau folosit direct:')
console.log('   {{emailTemplate}} (template-ul complet generat)') 