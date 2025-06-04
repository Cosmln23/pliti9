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
  active_session_id?: string
  active_device_info?: {
    userAgent: string
    ip: string
    connectedAt: string
    sessionId: string
  }
  session_started_at?: string
  last_activity_at?: string
  previous_sessions?: string
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

export interface DeviceInfo {
  userAgent: string
  ip: string
  screenResolution?: string
  timezone?: string
}

export interface SessionStatus {
  canAccess: boolean
  needsTakeover: boolean
  currentDevice?: {
    userAgent: string
    ip: string
    connectedAt: string
    sessionId: string
  }
  message: string
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
    'SELECT * FROM access_codes WHERE status = $1 AND expires_at > NOW()',
    ['active']
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
    'SELECT * FROM access_codes WHERE status = $1 AND expires_at > NOW() AND expires_at <= NOW() + INTERVAL $2 HOUR',
    ['active', hoursFromNow]
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
    'UPDATE access_codes SET status = $1 WHERE code = $2',
    ['expired', code]
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
    'SELECT * FROM live_sessions WHERE status = $1 ORDER BY started_at DESC LIMIT 1',
    ['active']
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
    'UPDATE live_sessions SET status = $1, ended_at = NOW() WHERE session_id = $2',
    ['ended', sessionId]
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

/**
 * Validează un cod de acces - verifică existența și expirarea
 */
export async function validateAccessCode(code: string): Promise<AccessCode | null> {
  try {
    const normalizedCode = code.trim().toUpperCase()
    
    if (isDemoMode) {
      const found = demoStorage.accessCodes.find(ac => 
        ac.code === normalizedCode && 
        ac.status === 'active' && 
        new Date(ac.expires_at) > new Date()
      )
      console.log('[DEMO] Validate access code:', normalizedCode, !!found)
      return found || null
    }
    
    const result = await pool!.query(
      `SELECT * FROM access_codes 
       WHERE code = $1 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP`,
      [normalizedCode]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as AccessCode

  } catch (error) {
    console.error('Eroare validare cod acces:', error)
    return null
  }
}

/**
 * Începe o sesiune nouă
 */
export async function startSession(code: string, deviceInfo: DeviceInfo): Promise<{ success: boolean, sessionId: string }> {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (isDemoMode) {
      const accessCode = demoStorage.accessCodes.find(ac => ac.code === code)
      if (accessCode) {
        accessCode.active_session_id = sessionId
        accessCode.active_device_info = {
          userAgent: deviceInfo.userAgent,
          ip: deviceInfo.ip,
          connectedAt: new Date().toISOString(),
          sessionId: sessionId
        }
        accessCode.session_started_at = new Date().toISOString()
        accessCode.last_activity_at = new Date().toISOString()
        console.log('[DEMO] Started session:', sessionId, 'for code:', code)
      }
      return {
        success: true,
        sessionId: sessionId
      }
    }
    
    // Remove status = 'in_use' to avoid constraint violation
    // Keep status as 'active' and only track session info
    await pool!.query(
      `UPDATE access_codes 
       SET 
         active_session_id = $1,
         active_device_info = $2,
         session_started_at = CURRENT_TIMESTAMP,
         last_activity_at = CURRENT_TIMESTAMP
       WHERE code = $3`,
      [sessionId, JSON.stringify(deviceInfo), code]
    )

    return {
      success: true,
      sessionId: sessionId
    }

  } catch (error) {
    console.error('Eroare pornire sesiune:', error)
    throw error
  }
}

/**
 * Verifică starea sesiunii pentru un cod de acces
 */
export async function checkAccessCodeSession(code: string, deviceInfo: DeviceInfo): Promise<SessionStatus> {
  try {
    if (isDemoMode) {
      const accessCode = demoStorage.accessCodes.find(ac => ac.code === code)
      
      if (!accessCode) {
        return {
          canAccess: false,
          needsTakeover: false,
          message: 'Cod invalid sau expirat'
        }
      }

      // Verifică expirarea
      if (new Date() > new Date(accessCode.expires_at)) {
        return {
          canAccess: false,
          needsTakeover: false,
          message: 'Cod expirat'
        }
      }

      // Verifică dacă codul nu este în folosință
      if (!accessCode.active_session_id) {
        return {
          canAccess: true,
          needsTakeover: false,
          message: 'Cod disponibil pentru utilizare'
        }
      }

      // Verifică dacă e același dispozitiv
      const currentDevice = accessCode.active_device_info
      if (currentDevice && 
          currentDevice.userAgent === deviceInfo.userAgent && 
          currentDevice.ip === deviceInfo.ip) {
        return {
          canAccess: true,
          needsTakeover: false,
          message: 'Sesiune existentă pe același dispozitiv'
        }
      }

      // Alt dispozitiv încearcă să intre - cere takeover
      return {
        canAccess: false,
        needsTakeover: true,
        currentDevice: {
          userAgent: currentDevice?.userAgent || 'Unknown',
          ip: currentDevice?.ip || 'Unknown',
          connectedAt: accessCode.session_started_at || new Date().toISOString(),
          sessionId: accessCode.active_session_id
        },
        message: 'Cod în folosință pe alt dispozitiv'
      }
    }

    const result = await pool!.query(
      `SELECT 
        active_session_id, 
        active_device_info, 
        session_started_at,
        status,
        expires_at
      FROM access_codes 
      WHERE code = $1`,
      [code]
    )

    if (result.rows.length === 0) {
      return {
        canAccess: false,
        needsTakeover: false,
        message: 'Cod invalid sau expirat'
      }
    }

    const accessCode = result.rows[0]

    // Verifică expirarea
    if (new Date() > new Date(accessCode.expires_at)) {
      return {
        canAccess: false,
        needsTakeover: false,
        message: 'Cod expirat'
      }
    }

    // Verifică dacă codul nu este în folosință
    if (!accessCode.active_session_id) {
      return {
        canAccess: true,
        needsTakeover: false,
        message: 'Cod disponibil pentru utilizare'
      }
    }

    // Verifică dacă e același dispozitiv
    const currentDevice = accessCode.active_device_info
    if (currentDevice && 
        currentDevice.userAgent === deviceInfo.userAgent && 
        currentDevice.ip === deviceInfo.ip) {
      return {
        canAccess: true,
        needsTakeover: false,
        message: 'Sesiune existentă pe același dispozitiv'
      }
    }

    // Alt dispozitiv încearcă să intre - cere takeover
    return {
      canAccess: false,
      needsTakeover: true,
      currentDevice: {
        userAgent: currentDevice?.userAgent || 'Unknown',
        ip: currentDevice?.ip || 'Unknown',
        connectedAt: accessCode.session_started_at,
        sessionId: accessCode.active_session_id
      },
      message: 'Cod în folosință pe alt dispozitiv'
    }

  } catch (error) {
    console.error('Eroare verificare sesiune:', error)
    throw error
  }
}

/**
 * Preia sesiunea de pe alt dispozitiv (takeover)
 */
export async function takeoverSession(code: string, deviceInfo: DeviceInfo): Promise<{ success: boolean, sessionId: string }> {
  try {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Actualizează sesiunea activă
    await pool!.query(
      `UPDATE access_codes 
       SET 
         active_session_id = $1,
         active_device_info = $2,
         session_started_at = CURRENT_TIMESTAMP,
         last_activity_at = CURRENT_TIMESTAMP,
         status = 'in_use',
         previous_sessions = previous_sessions || $3::jsonb
       WHERE code = $4`,
      [
        newSessionId,
        JSON.stringify(deviceInfo),
        JSON.stringify([{
          ...deviceInfo,
          takenAt: new Date().toISOString(),
          action: 'takeover'
        }]),
        code
      ]
    )

    return {
      success: true,
      sessionId: newSessionId
    }

  } catch (error) {
    console.error('Eroare takeover sesiune:', error)
    throw error
  }
}

/**
 * Termină sesiunea
 */
export async function endSession(code: string, sessionId: string): Promise<boolean> {
  try {
    await pool!.query(
      `UPDATE access_codes 
       SET 
         active_session_id = NULL,
         active_device_info = NULL,
         status = 'active'
       WHERE code = $1 AND active_session_id = $2`,
      [code, sessionId]
    )

    return true

  } catch (error) {
    console.error('Eroare terminare sesiune:', error)
    return false
  }
} 