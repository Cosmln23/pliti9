// Verifică schema access_codes table
const { Pool } = require('pg');

async function checkSchema() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 CHECKING ACCESS_CODES TABLE SCHEMA...');
    
    // Verifică coloanele din tabelă
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'access_codes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Columns in access_codes table:');
    schemaResult.rows.forEach(row => {
      console.log(`   ${row.column_name} - ${row.data_type} - ${row.is_nullable === 'YES' ? 'nullable' : 'required'}`);
    });
    
    // Verifică un record existent
    console.log('\n🧪 Sample record structure:');
    const sampleResult = await pool.query('SELECT * FROM access_codes LIMIT 1');
    if (sampleResult.rows.length > 0) {
      const sample = sampleResult.rows[0];
      console.log('Sample record keys:', Object.keys(sample));
      console.log('Active session id:', sample.active_session_id);
      console.log('Active device info:', sample.active_device_info);
      console.log('Session started at:', sample.session_started_at);
    }
    
  } catch (error) {
    console.log('❌ Schema check error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema(); 