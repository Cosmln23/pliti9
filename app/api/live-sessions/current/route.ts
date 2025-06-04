import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for the current active session
let currentSession: any = null

export async function GET(request: NextRequest) {
  try {
    // Return current active session if exists
    if (currentSession) {
      return NextResponse.json({
        success: true,
        session: currentSession
      })
    }

    return NextResponse.json({
      success: false,
      message: 'No active session found'
    })

  } catch (error) {
    console.error('Error fetching current session:', error)
    return NextResponse.json(
      { error: 'Error fetching session' },
      { status: 500 }
    )
  }
}

// Store a session as current (called from start endpoint)
export async function POST(request: NextRequest) {
  try {
    const session = await request.json()
    currentSession = session
    
    return NextResponse.json({
      success: true,
      message: 'Session stored as current'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error storing session' },
      { status: 500 }
    )
  }
} 