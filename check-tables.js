const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  
  console.log('🎯 ALL POSTGRESQL TABLES:');
  result.rows.forEach(row => console.log('  ✅', row.table_name));
  
  // Check sample data in each table
  for (const row of result.rows) {
    try {
      const count = await client.query(`SELECT COUNT(*) FROM ${row.table_name}`);
      console.log(`  📊 ${row.table_name}: ${count.rows[0].count} records`);
    } catch (error) {
      console.log(`  ❌ ${row.table_name}: Error checking data`);
    }
  }
  
  await client.end();
})().catch(console.error); 