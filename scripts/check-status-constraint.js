// Verifică constraint-ul pentru coloana status
const { Pool } = require('pg');

async function checkStatusConstraint() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 CHECKING STATUS CONSTRAINT...');
    
    // Verifică constraint-urile pentru access_codes
    const constraintResult = await pool.query(`
      SELECT 
        constraint_name, 
        constraint_type,
        check_clause
      FROM information_schema.check_constraints cc
      JOIN information_schema.constraint_column_usage ccu 
        ON cc.constraint_name = ccu.constraint_name
      WHERE ccu.table_name = 'access_codes' 
        AND ccu.column_name = 'status'
    `);
    
    console.log('\n📋 Status constraints:');
    constraintResult.rows.forEach(row => {
      console.log(`   Constraint: ${row.constraint_name}`);
      console.log(`   Type: ${row.constraint_type}`);
      console.log(`   Check: ${row.check_clause}`);
    });

    // Verifică și valorile existente în database
    console.log('\n📊 Existing status values in database:');
    const statusResult = await pool.query(`
      SELECT DISTINCT status, COUNT(*) as count 
      FROM access_codes 
      GROUP BY status 
      ORDER BY count DESC
    `);
    
    statusResult.rows.forEach(row => {
      console.log(`   '${row.status}' - ${row.count} records`);
    });

    console.log('\n🎯 SOLUTION OPTIONS:');
    console.log('1. Use existing status values (active/expired)');
    console.log('2. Add "in_use" to allowed status values');
    console.log('3. Remove status update from session logic');
    
  } catch (error) {
    console.log('❌ Error checking constraint:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatusConstraint(); 