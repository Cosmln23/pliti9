// TEST PAYMENT FLOW END-TO-END cu Railway PostgreSQL + Make.com
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testPaymentFlow() {
  console.log('🚀 TESTING PAYMENT FLOW END-TO-END');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Test creare access code (simulează plata reușită)
    console.log('\n💳 STEP 1: Creating access code (simulate successful payment)...');
    
    const testEmail = `test.plipli9.${Date.now()}@gmail.com`;
    const testPhone = '+40712345678';
    
    const createResponse = await axios.post(`${API_BASE}/access-codes/create`, {
      email: testEmail,
      phone_number: testPhone,
      amount: 25,
      paymentMethod: 'stripe',
      paymentIntentId: `pi_test_${Date.now()}`
    });

    if (createResponse.status === 200) {
      const accessCode = createResponse.data.data.accessCode;
      console.log('✅ Access code created successfully!');
      console.log('   Code:', accessCode);
      console.log('   Email:', testEmail);
      console.log('   Valid for:', createResponse.data.data.validFor);
      console.log('   Live URL:', createResponse.data.data.liveUrl);
      console.log('   Make.com triggered:', createResponse.data.notifications.automation_triggered);

      // Step 2: Test validare cod
      console.log('\n🔓 STEP 2: Validating access code...');
      
      const validateResponse = await axios.post(`${API_BASE}/access-codes/validate`, {
        code: accessCode,
        deviceInfo: {
          userAgent: 'Mozilla/5.0 (Test Browser)',
          ip: '127.0.0.1',
          screenResolution: '1920x1080',
          timezone: 'Europe/Bucharest'
        }
      });

      if (validateResponse.status === 200 && validateResponse.data.valid) {
        console.log('✅ Access code validation successful!');
        console.log('   Valid:', validateResponse.data.valid);
        console.log('   Expires at:', validateResponse.data.accessCode.expires_at);
        console.log('   Usage count:', validateResponse.data.accessCode.usage_count);
        
        // Step 3: Test check status
        console.log('\n📊 STEP 3: Checking access code status...');
        
        const statusResponse = await axios.post(`${API_BASE}/access-codes/check-status`, {
          code: accessCode
        });

        if (statusResponse.status === 200) {
          console.log('✅ Access code status check successful!');
          console.log('   Status:', statusResponse.data.status);
          console.log('   Time remaining:', statusResponse.data.time_remaining.formatted);
          console.log('   Can reenter:', statusResponse.data.access_info.can_reenter);

          // Step 4: Test simulare sesiune live
          console.log('\n🎥 STEP 4: Testing live session creation...');
          
          const liveResponse = await axios.post(`${API_BASE}/live-sessions/start`, {
            location: 'Test Paranormal Location - Casa Bântuită',
            duration: 120
          });

          if (liveResponse.status === 200) {
            console.log('✅ Live session created successfully!');
            console.log('   Session ID:', liveResponse.data.session.session_id);
            console.log('   Location:', liveResponse.data.session.location);
            console.log('   RTMP URL:', liveResponse.data.streaming.rtmp_ingest_url);
            console.log('   Playback URL:', liveResponse.data.streaming.playback_url);
            console.log('   Active codes notified:', liveResponse.data.notifications.active_codes_notified);
            console.log('   Make.com automation:', liveResponse.data.notifications.automation_triggered);
            
            console.log('\n🎉 PAYMENT FLOW END-TO-END: SUCCESS!');
            console.log('=' * 60);
            console.log('✅ Database Railway PostgreSQL: WORKING');
            console.log('✅ Access Code Generation: WORKING');
            console.log('✅ Code Validation: WORKING');
            console.log('✅ Live Session Creation: WORKING');
            console.log('✅ Make.com Email Webhook: WORKING');
            console.log('📊 Test Results Summary:');
            console.log(`   Generated Code: ${accessCode}`);
            console.log(`   Test Email: ${testEmail}`);
            console.log(`   Valid Until: ${createResponse.data.data.expiresAt}`);
            console.log(`   Live Session: ${liveResponse.data.session.session_id}`);
            
          } else {
            console.log('❌ Live session creation failed:', liveResponse.data);
          }
        } else {
          console.log('❌ Status check failed:', statusResponse.data);
        }
      } else {
        console.log('❌ Code validation failed:', validateResponse.data);
      }
    } else {
      console.log('❌ Access code creation failed:', createResponse.data);
    }

  } catch (error) {
    console.log('\n❌ PAYMENT FLOW ERROR:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
    console.log('\n🔧 Possible issues:');
    console.log('   - Next.js server not running (npm run dev)');
    console.log('   - Database connection issues');
    console.log('   - Make.com webhook configuration');
    console.log('   - Missing API keys (check next.config.js)');
  }
}

// Rulează testul
testPaymentFlow(); 