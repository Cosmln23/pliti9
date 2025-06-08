import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching realtime analytics...')

    // În demo mode, returnează date mock
    if (process.env.DEMO_MODE === 'true') {
      const mockStats = {
        live: {
          isActive: Math.random() > 0.5,
          viewerCount: Math.floor(Math.random() * 50) + 10,
          sessionDuration: Math.floor(Math.random() * 120) + 30,
          chatMessages: Math.floor(Math.random() * 200) + 50,
          location: 'Castelul Bran'
        },
        revenue: {
          today: Math.floor(Math.random() * 500) + 200,
          thisWeek: Math.floor(Math.random() * 2000) + 800,
          thisMonth: Math.floor(Math.random() * 5000) + 2000,
          currency: 'RON'
        },
        users: {
          activeNow: Math.floor(Math.random() * 30) + 5,
          activeToday: Math.floor(Math.random() * 100) + 50,
          totalCodesSold: Math.floor(Math.random() * 500) + 200,
          conversionRate: (Math.random() * 10 + 5).toFixed(1) + '%'
        },
        engagement: {
          averageSessionTime: Math.floor(Math.random() * 1800) + 600, // seconds
          bounceRate: (Math.random() * 30 + 20).toFixed(1) + '%',
          pagesPerSession: (Math.random() * 3 + 2).toFixed(1),
          chatEngagement: (Math.random() * 40 + 30).toFixed(1) + '%'
        },
        systemHealth: {
          database: 'healthy',
          streaming: 'healthy',
          payments: 'healthy',
          notifications: 'healthy',
          uptime: '99.9%'
        },
        topEvents: [
          { event: 'payment_completed', count: Math.floor(Math.random() * 50) + 10 },
          { event: 'live_stream_joined', count: Math.floor(Math.random() * 80) + 20 },
          { event: 'chat_message_sent', count: Math.floor(Math.random() * 200) + 100 },
          { event: 'access_code_used', count: Math.floor(Math.random() * 60) + 15 }
        ],
        lastUpdated: new Date().toISOString()
      }

      console.log('📊 [DEMO] Returning mock analytics data')
      return NextResponse.json(mockStats)
    }

    // Production - returnează date reale (placeholder pentru now)
    const stats = {
      live: {
        isActive: false,
        viewerCount: 0,
        sessionDuration: 0,
        chatMessages: 0,
        location: 'N/A'
      },
      revenue: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        currency: 'RON'
      },
      users: {
        activeNow: 0,
        activeToday: 0,
        totalCodesSold: 0,
        conversionRate: '0%'
      },
      engagement: {
        averageSessionTime: 0,
        bounceRate: '0%',
        pagesPerSession: '0',
        chatEngagement: '0%'
      },
      systemHealth: {
        database: 'healthy',
        streaming: 'inactive',
        payments: 'healthy',
        notifications: 'healthy',
        uptime: '99.9%'
      },
      topEvents: [],
      lastUpdated: new Date().toISOString()
    }

    console.log('📊 Real-time analytics fetched')
    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in realtime analytics:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint pentru a actualiza metrics manual
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update specific metrics (ex: viewer count pentru live stream)
    if (body.metric === 'viewer_count' && body.sessionId) {
      const mysql = require('mysql2/promise')
      
      const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'plipli9_paranormal',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })

      await connection.execute(`
        UPDATE live_sessions 
        SET viewer_count = ? 
        WHERE session_id = ?
      `, [body.value, body.sessionId])

      await connection.end()

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid metric update' }, { status: 400 })

  } catch (error) {
    console.error('Error updating realtime analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 