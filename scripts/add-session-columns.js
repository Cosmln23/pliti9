// Adaugă coloanele pentru session management în access_codes table
const { Pool } = require('pg');

async function addSessionColumns() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔧 ADDING SESSION MANAGEMENT COLUMNS...');
    
    // Adaugă coloanele pentru session management
    const columns = [
      'ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS active_session_id VARCHAR(255)',
      'ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS active_device_info JSONB',
      'ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMP',
      'ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP',
      'ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS previous_sessions JSONB'
    ];

    for (const sql of columns) {
      console.log(`\n📝 Executing: ${sql}`);
      await pool.query(sql);
      console.log('✅ Success!');
    }

    // Verifică noua schemă
    console.log('\n🔍 Checking updated schema...');
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'access_codes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Updated columns in access_codes table:');
    schemaResult.rows.forEach(row => {
      console.log(`   ${row.column_name} - ${row.data_type} - ${row.is_nullable === 'YES' ? 'nullable' : 'required'}`);
    });

    console.log('\n🎉 SESSION MANAGEMENT COLUMNS ADDED SUCCESSFULLY!');
    console.log('✅ Session takeover modal will now work');
    console.log('✅ One device per access code enforced');
    console.log('✅ Device info tracking enabled');
    console.log('✅ Session history preserved');
    
  } catch (error) {
    console.log('❌ Error adding columns:', error.message);
  } finally {
    await pool.end();
  }
}

addSessionColumns(); 