// Verifică valorile status permise
const { Pool } = require('pg');

async function checkStatus() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 CHECKING STATUS VALUES...');
    
    // Verifică valorile existente
    console.log('\n📊 Current status values in database:');
    const statusResult = await pool.query(`
      SELECT DISTINCT status, COUNT(*) as count 
      FROM access_codes 
      GROUP BY status 
      ORDER BY count DESC
    `);
    
    statusResult.rows.forEach(row => {
      console.log(`   '${row.status}' - ${row.count} records`);
    });

    // Încearcă să găsească constraint-urile
    console.log('\n🔍 Checking table constraints...');
    const constraintResult = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(c.oid) as constraint_def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'access_codes' 
        AND c.contype = 'c'
    `);
    
    if (constraintResult.rows.length > 0) {
      console.log('📋 Check constraints found:');
      constraintResult.rows.forEach(row => {
        console.log(`   ${row.constraint_name}: ${row.constraint_def}`);
      });
    } else {
      console.log('⚠️ No check constraints found');
    }

    console.log('\n🎯 QUICK FIX - REMOVING STATUS UPDATE:');
    console.log('Since status constraint blocks "in_use", we\'ll modify code to not change status during session start');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatus(); 