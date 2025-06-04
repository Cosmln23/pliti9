// Test simplu pentru a verifica ce funcționează
const axios = require('axios');

async function testAccessCode() {
  console.log('🧪 TESTING ACCESS CODE FUNCTIONS...');
  
  // Testez cu codul generat anterior
  const testCode = 'PLIAP7E5D'; // Din testul anterior
  
  try {
    console.log('\n📊 Testing check-status endpoint...');
    const statusResponse = await axios.post('http://localhost:3000/api/access-codes/check-status', {
      code: testCode
    });
    
    console.log('✅ Check-status works!');
    console.log('   Code exists:', statusResponse.data.exists);
    console.log('   Status:', statusResponse.data.status);
    console.log('   Time remaining:', statusResponse.data.time_remaining?.formatted);
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('⚠️ Code not found in database - this is expected if it was created in demo mode');
    } else {
      console.log('❌ Error:', error.message);
      console.log('   Status:', error.response?.status);
      console.log('   Data:', error.response?.data);
    }
  }
  
  // Să verific cu un cod din database-ul real
  try {
    console.log('\n🔍 Checking what codes exist in real database...');
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query('SELECT code, email, expires_at, status FROM access_codes ORDER BY created_at DESC LIMIT 5');
    console.log('📋 Recent codes in database:');
    result.rows.forEach(row => {
      console.log(`   ${row.code} - ${row.email} - ${row.status} - expires: ${row.expires_at}`);
    });
    
    // Testez cu primul cod din database
    if (result.rows.length > 0) {
      const realCode = result.rows[0].code;
      console.log(`\n🧪 Testing with real database code: ${realCode}`);
      
      const realCodeResponse = await axios.post('http://localhost:3000/api/access-codes/check-status', {
        code: realCode
      });
      
      console.log('✅ Real code check works!');
      console.log('   Status:', realCodeResponse.data.status);
      console.log('   Email:', realCodeResponse.data.email);
      console.log('   Time remaining:', realCodeResponse.data.time_remaining?.formatted);
    }
    
    await pool.end();
    
  } catch (error) {
    console.log('❌ Database test error:', error.message);
  }
}

testAccessCode(); 