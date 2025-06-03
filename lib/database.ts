import { Pool } from 'pg'

const config = {
  connectionString: process.env.DATABASE_URL
}

// Demo mode check
const isDemoMode = process.env.DEMO_MODE === 'true'

// Conditional database connection
const pool = isDemoMode ? null : new Pool(config)

// Demo data storage (in-memory for development)
const demoStorage = {
  accessCodes: [] as AccessCode[],
  liveSessions: [] as LiveSession[],
  chatMessages: [] as ChatMessage[]
}

// Types pentru database entities
export interface AccessCode {
  id?: number
  code: string
  email: string
  phone_number?: string
  payment_intent_id?: string
  amount: number
  payment_method: string
  created_at?: Date
  expires_at: Date
  status: 'active' | 'expired'
  last_used_at?: Date
  usage_count: number
  ip_address?: string
}

export interface LiveSession {
  id?: number
  session_id: string
  stream_key: string
  stream_url?: string
  playback_url?: string
  location?: string
  started_at?: Date
  ended_at?: Date
  status: 'active' | 'paused' | 'ended'
  estimated_duration: number
  viewer_count: number
  stream_source: 'mobile' | 'desktop'
}

export interface ChatMessage {
  id?: number
  session_id: string
  username: string
  message: string
  timestamp?: Date
  ip_address?: string
}

// Access Codes CRUD Operations
export async function createAccessCode(data: Omit<AccessCode, 'id' | 'created_at'>): Promise<AccessCode> {
  if (isDemoMode) {
    const accessCode: AccessCode = {
      id: Math.floor(Math.random() * 1000000),
      ...data,
      created_at: new Date()
    }
    demoStorage.accessCodes.push(accessCode)
    console.log('[DEMO] Created access code:', accessCode.code)
    return accessCode
  }

  const result = await pool!.query(
    `INSERT INTO access_codes (code, email, phone_number, payment_intent_id, amount, payment_method, expires_at, status, usage_count, ip_address) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [data.code, data.email, data.phone_number, data.payment_intent_id, data.amount, data.payment_method, data.expires_at, data.status, data.usage_count, data.ip_address]
  )
  
  return result.rows[0] as AccessCode
}

export async function getAccessCodeByCode(code: string): Promise<AccessCode | null> {
  if (isDemoMode) {
    const found = demoStorage.accessCodes.find(ac => ac.code === code)
    console.log('[DEMO] Found access code:', !!found)
    return found || null
  }

  const result = await pool!.query(
    'SELECT * FROM access_codes WHERE code = $1 LIMIT 1',
    [code]
  )
  
  return result.rows.length > 0 ? result.rows[0] as AccessCode : null
}

export async function updateAccessCodeUsage(code: string, ip_address?: string): Promise<void> {
  if (isDemoMode) {
    const accessCode = demoStorage.accessCodes.find(ac => ac.code === code)
    if (accessCode) {
      accessCode.last_used_at = new Date()
      accessCode.usage_count = (accessCode.usage_count || 0) + 1
      if (ip_address) accessCode.ip_address = ip_address
      console.log('[DEMO] Updated access code usage:', code)
    }
    return
  }

  await pool!.query(
    'UPDATE access_codes SET last_used_at = NOW(), usage_count = usage_count + 1, ip_address = $1 WHERE code = $2',
    [ip_address, code]
  )
}

export async function getActiveAccessCodes(): Promise<AccessCode[]> {
  if (isDemoMode) {
    const now = new Date()
    const active = demoStorage.accessCodes.filter(ac => 
      ac.status === 'active' && 
      new Date(ac.expires_at) > now
    )
    console.log('[DEMO] Active access codes:', active.length)
    return active
  }

  const result = await pool!.query(
    'SELECT * FROM access_codes WHERE status = "active" AND expires_at > NOW()'
  )
  
  return result.rows as AccessCode[]
}

export async function getExpiringAccessCodes(hoursFromNow: number = 2): Promise<AccessCode[]> {
  if (isDemoMode) {
    const now = new Date()
    const futureTime = new Date(now.getTime() + (hoursFromNow * 60 * 60 * 1000))
    
    const expiring = demoStorage.accessCodes.filter(ac => 
      ac.status === 'active' && 
      new Date(ac.expires_at) > now &&
      new Date(ac.expires_at) <= futureTime
    )
    console.log('[DEMO] Expiring access codes:', expiring.length)
    return expiring
  }

  const result = await pool!.query(
    'SELECT * FROM access_codes WHERE status = "active" AND expires_at > NOW() AND expires_at <= DATE_ADD(NOW(), INTERVAL $1 HOUR)',
    [hoursFromNow]
  )
  
  return result.rows as AccessCode[]
}

export async function expireAccessCode(code: string): Promise<void> {
  if (isDemoMode) {
    const accessCode = demoStorage.accessCodes.find(ac => ac.code === code)
    if (accessCode) {
      accessCode.status = 'expired'
      console.log('[DEMO] Expired access code:', code)
    }
    return
  }

  await pool!.query(
    'UPDATE access_codes SET status = "expired" WHERE code = $1',
    [code]
  )
}

// Live Sessions CRUD Operations
export async function createLiveSession(data: Omit<LiveSession, 'id' | 'started_at'>): Promise<LiveSession> {
  if (isDemoMode) {
    const liveSession: LiveSession = {
      id: Math.floor(Math.random() * 1000000),
      ...data,
      started_at: new Date()
    }
    demoStorage.liveSessions.push(liveSession)
    console.log('[DEMO] Created live session:', liveSession.session_id)
    return liveSession
  }

  const result = await pool!.query(
    `INSERT INTO live_sessions (session_id, stream_key, stream_url, playback_url, location, status, estimated_duration, viewer_count, stream_source) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [data.session_id, data.stream_key, data.stream_url, data.playback_url, data.location, data.status, data.estimated_duration, data.viewer_count, data.stream_source]
  )
  
  return result.rows[0] as LiveSession
}

export async function getCurrentLiveSession(): Promise<LiveSession | null> {
  if (isDemoMode) {
    const active = demoStorage.liveSessions
      .filter(ls => ls.status === 'active')
      .sort((a, b) => new Date(b.started_at!).getTime() - new Date(a.started_at!).getTime())[0]
    
    console.log('[DEMO] Current live session:', !!active)
    return active || null
  }

  const result = await pool!.query(
    'SELECT * FROM live_sessions WHERE status = "active" ORDER BY started_at DESC LIMIT 1'
  )
  
  return result.rows.length > 0 ? result.rows[0] as LiveSession : null
}

export async function endLiveSession(sessionId: string): Promise<void> {
  if (isDemoMode) {
    const session = demoStorage.liveSessions.find(ls => ls.session_id === sessionId)
    if (session) {
      session.status = 'ended'
      session.ended_at = new Date()
      console.log('[DEMO] Ended live session:', sessionId)
    }
    return
  }

  await pool!.query(
    'UPDATE live_sessions SET status = "ended", ended_at = NOW() WHERE session_id = $1',
    [sessionId]
  )
}

export async function updateViewerCount(sessionId: string, count: number): Promise<void> {
  if (isDemoMode) {
    const session = demoStorage.liveSessions.find(ls => ls.session_id === sessionId)
    if (session) {
      session.viewer_count = count
      console.log('[DEMO] Updated viewer count:', sessionId, count)
    }
    return
  }

  await pool!.query(
    'UPDATE live_sessions SET viewer_count = $1 WHERE session_id = $2',
    [count, sessionId]
  )
}

// Chat Messages Operations  
export async function saveChatMessage(data: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
  if (isDemoMode) {
    const chatMessage: ChatMessage = {
      id: Math.floor(Math.random() * 1000000),
      ...data,
      timestamp: new Date()
    }
    demoStorage.chatMessages.push(chatMessage)
    console.log('[DEMO] Saved chat message:', chatMessage.message)
    return chatMessage
  }

  const result = await pool!.query(
    'INSERT INTO chat_messages (session_id, username, message, ip_address) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.session_id, data.username, data.message, data.ip_address]
  )
  
  return result.rows[0] as ChatMessage
}

export async function getChatMessages(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
  if (isDemoMode) {
    const messages = demoStorage.chatMessages
      .filter(cm => cm.session_id === sessionId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit)
      .reverse()
    
    console.log('[DEMO] Got chat messages:', messages.length)
    return messages
  }

  const result = await pool!.query(
    'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY timestamp DESC LIMIT $2',
    [sessionId, limit]
  )
  
  return (result.rows as ChatMessage[]).reverse()
} 