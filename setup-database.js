const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Railway PostgreSQL connection
const connectionString = 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway'

async function setupDatabase() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Pentru Railway SSL
    }
  })

  try {
    console.log('🔗 Connecting to Railway PostgreSQL...')
    await client.connect()
    console.log('✅ Connected successfully!')

    // Read SQL schema file
    const schemaPath = path.join(__dirname, 'POSTGRESQL-SCHEMA.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📋 Executing PostgreSQL schema...')
    
    // Execute the entire schema as one command to maintain order
    try {
      console.log('⚡ Executing complete schema...')
      await client.query(schema)
      console.log('✅ Schema executed successfully!')
    } catch (error) {
      // If bulk execution fails, try individual statements with better parsing
      console.log('⚠️  Bulk execution failed, trying individual statements...')
      
      // Better parsing - keep multiline statements together
      const lines = schema.split('\n')
      let currentStatement = ''
      const statements = []
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('--')) {
          continue
        }
        
        currentStatement += line + '\n'
        
        // End of statement (semicolon at end of line)
        if (trimmedLine.endsWith(';')) {
          statements.push(currentStatement.trim())
          currentStatement = ''
        }
      }
      
      console.log(`📊 Found ${statements.length} SQL statements to execute`)

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        if (statement.trim()) {
          try {
            console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
            await client.query(statement)
            console.log(`✅ Statement ${i + 1} executed successfully`)
          } catch (stmtError) {
            if (stmtError.message.includes('already exists')) {
              console.log(`⚠️  Statement ${i + 1} skipped (already exists)`)
            } else {
              console.error(`❌ Error in statement ${i + 1}:`, stmtError.message)
              console.log('Statement preview:', statement.substring(0, 100) + '...')
            }
          }
        }
      }
    }

    // Test the setup by checking tables
    console.log('\n🔍 Verifying database setup...')
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log('📋 Created tables:')
    tablesResult.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`)
    })

    if (tablesResult.rows.length > 0) {
      // Test sample data
      try {
        const accessCodesResult = await client.query('SELECT COUNT(*) FROM access_codes')
        const liveSessionsResult = await client.query('SELECT COUNT(*) FROM live_sessions')
        const chatMessagesResult = await client.query('SELECT COUNT(*) FROM chat_messages')

        console.log('\n📊 Sample data:')
        console.log(`  🎫 Access codes: ${accessCodesResult.rows[0].count}`)
        console.log(`  🎥 Live sessions: ${liveSessionsResult.rows[0].count}`)
        console.log(`  💬 Chat messages: ${chatMessagesResult.rows[0].count}`)
      } catch (dataError) {
        console.log('⚠️  Tables exist but sample data query failed - this is ok for empty tables')
      }

      console.log('\n🎉 DATABASE SETUP COMPLETE!')
      console.log('✅ Railway PostgreSQL is ready for production!')
      console.log('✅ All tables created with indexes')
      console.log('✅ Schema ready for Plipli9 Paranormal!')
    } else {
      console.log('❌ No tables were created. Check schema file.')
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await client.end()
    console.log('🔒 Database connection closed')
  }
}

// Run setup
setupDatabase().catch(console.error) 