import { NextRequest, NextResponse } from 'next/server'

// Rate limiting pentru a preveni spam
const rateLimitMap = new Map()

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100 // max 100 requests per minute per IP
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.windowMs
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip)
  
  // Cleanup old requests
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart)
  rateLimitMap.set(ip, validRequests)
  
  if (validRequests.length >= RATE_LIMIT.maxRequests) {
    return true
  }
  
  validRequests.push(now)
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      )
    }

    // Prepare analytics data
    const analyticsData = {
      event_type: body.event_type,
      event_data: body.event_data || {},
      user_identifier: body.user_identifier || null,
      session_id: body.session_id || null,
      ip_address: ip,
      user_agent: body.user_agent || request.headers.get('user-agent'),
      page_url: body.page_url || null,
      referrer: body.referrer || null,
      timestamp: body.timestamp || new Date().toISOString()
    }

    // În demo mode, doar loghează
    if (process.env.DEMO_MODE === 'true') {
      console.log('📊 [DEMO] Analytics Event Tracked:', analyticsData)
      return NextResponse.json({ success: true, demo: true })
    }

    // Save to database (folosim PlanetScale/MySQL)
    const mysql = require('mysql2/promise')
    
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'plipli9_paranormal',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })

    try {
      // Insert analytics event
      const [result] = await connection.execute(`
        INSERT INTO analytics_events (
          event_type, 
          user_identifier, 
          session_id, 
          event_data, 
          ip_address, 
          user_agent, 
          timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        analyticsData.event_type,
        analyticsData.user_identifier,
        analyticsData.session_id,
        JSON.stringify(analyticsData.event_data),
        analyticsData.ip_address,
        analyticsData.user_agent,
        analyticsData.timestamp
      ])

      await connection.end()

      console.log('📊 Analytics event saved:', analyticsData.event_type)

      return NextResponse.json({ 
        success: true, 
        event_id: (result as any).insertId 
      })

    } catch (dbError) {
      console.error('Database error in analytics tracking:', dbError)
      await connection.end()
      
      // Fallback - log to file sau external service
      console.log('📊 Analytics Event (DB Fallback):', analyticsData)
      
      return NextResponse.json({ 
        success: true, 
        fallback: true 
      })
    }

  } catch (error) {
    console.error('Error in analytics tracking:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'analytics-tracking',
    timestamp: new Date().toISOString()
  })
} 