// Test validate endpoint cu cod real din database
const axios = require('axios');

async function testValidateRealCode() {
  console.log('🧪 TESTING VALIDATE ENDPOINT WITH REAL CODE...');
  
  const realCode = 'PLIAP7E5D'; // Cod real din database
  
  try {
    console.log(`\n🔓 Testing validate with code: ${realCode}`);
    
    const validateResponse = await axios.post('http://localhost:3000/api/access-codes/validate', {
      code: realCode,
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Test Browser)',
        ip: '127.0.0.1',
        screenResolution: '1920x1080',
        timezone: 'Europe/Bucharest'
      }
    });
    
    if (validateResponse.status === 200) {
      console.log('✅ Validate endpoint works!');
      console.log('   Valid:', validateResponse.data.valid);
      console.log('   Access Code:', validateResponse.data.accessCode?.code);
      console.log('   Session ID:', validateResponse.data.session?.sessionId);
      console.log('   Email:', validateResponse.data.accessCode?.email);
    }
    
  } catch (error) {
    console.log('❌ Validate Error:', error.message);
    console.log('   Status:', error.response?.status);
    console.log('   Data:', JSON.stringify(error.response?.data, null, 2));
    
    // Să verific logs mai detaliat
    console.log('\n🔍 Detailed error analysis:');
    if (error.response?.data?.error === 'Eroare internă server') {
      console.log('   This suggests an exception in the validate endpoint');
      console.log('   Likely issue: database connection or query problem');
      console.log('   Check Next.js server logs for exact error');
    }
  }
}

testValidateRealCode(); 