// Test pentru conexiunea reală la database Railway PostgreSQL
const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway';

async function testDatabaseConnection() {
  console.log('🧪 TESTING RAILWAY POSTGRESQL CONNECTION...');
  console.log('='.repeat(50));
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test 1: Conexiune simplă
    console.log('📡 Testing basic connection...');
    const timeResult = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connected successfully!');
    console.log('   Time:', timeResult.rows[0].current_time);
    console.log('   Version:', timeResult.rows[0].db_version.split(' ')[0]);

    // Test 2: Verifică dacă tabelele există
    console.log('\n🗄️ Checking if tables exist...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Tables found:', tables.length > 0 ? tables : 'No tables found');

    // Test 3: Verifică schema pentru access_codes
    if (tables.includes('access_codes')) {
      console.log('\n✅ access_codes table exists!');
      const countResult = await pool.query('SELECT COUNT(*) as count FROM access_codes');
      console.log('   Records count:', countResult.rows[0].count);
    } else {
      console.log('\n❌ access_codes table missing - needs schema creation');
    }

    console.log('\n🎯 DATABASE STATUS: CONNECTED AND READY');
    
  } catch (error) {
    console.log('\n❌ DATABASE ERROR:', error.message);
    console.log('🔧 Check if Railway database is running and accessible');
  } finally {
    await pool.end();
  }
}

testDatabaseConnection(); 