/**
 * Utility functions pentru Plipli9 Paranormal
 * Funcții comune folosite în întreaga aplicație
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combină clasele CSS cu Tailwind merge pentru evitarea conflictelor
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatează numărul de vizualizări pentru afișare
 */
export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

/**
 * Formatează data pentru afișare în limba română
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  
  return dateObj.toLocaleDateString('ro-RO', { ...defaultOptions, ...options })
}

/**
 * Formatează timpul pentru afișare
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('ro-RO', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

/**
 * Formatează durata video din secunde în format MM:SS sau HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Generează un cod de acces unic pentru LIVE-uri
 */
export function generateAccessCode(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PLI${timestamp.slice(-3)}${random.slice(0, 3)}`
}

/**
 * Validează codul de acces
 */
export function validateAccessCode(code: string): boolean {
  // Format: PLI123ABC (9 caractere total)
  const pattern = /^PLI\d{3}[A-Z]{3}$/
  return pattern.test(code.replace(/[-\s]/g, ''))
}

/**
 * Formatează codul de acces cu separatoare
 */
export function formatAccessCode(code: string): string {
  const cleaned = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`
}

/**
 * Verifică dacă codul de acces a expirat
 */
export function isAccessCodeExpired(createdAt: Date, expiryHours: number = 24): boolean {
  const now = new Date()
  const expiryTime = new Date(createdAt.getTime() + (expiryHours * 60 * 60 * 1000))
  return now > expiryTime
}

/**
 * Calculează timpul rămas până la expirarea codului
 */
export function getTimeUntilExpiry(createdAt: Date, expiryHours: number = 24): string {
  const now = new Date()
  const expiryTime = new Date(createdAt.getTime() + (expiryHours * 60 * 60 * 1000))
  const diff = expiryTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expirat'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  
  return `${minutes}m`
}

/**
 * Slugify pentru URL-uri SEO friendly
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Truncate text la o lungime specificată
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

/**
 * Sanitizează input-ul utilizatorului pentru a preveni XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validează email-ul
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generează un hash simplu pentru identificare
 */
export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Debounce function pentru search și input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Rate limiting simplu pentru client-side
 */
export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(): boolean {
    const now = Date.now()
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getRemainingTime(): number {
    if (this.requests.length === 0) return 0
    
    const oldestRequest = Math.min(...this.requests)
    const timeElapsed = Date.now() - oldestRequest
    return Math.max(0, this.windowMs - timeElapsed)
  }
}

/**
 * Storage helpers pentru localStorage cu error handling
 */
export const storage = {
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },

  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

/**
 * Constants pentru aplicația paranormală
 */
export const PARANORMAL_CONSTANTS = {
  LIVE_PRICE: 25.00,
  ACCESS_CODE_EXPIRY_HOURS: 24,
  MAX_CHAT_MESSAGE_LENGTH: 200,
  MAX_USERNAME_LENGTH: 20,
  RATE_LIMIT_REQUESTS: 5,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'webm', 'mov'],
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  SOCIAL_MEDIA: {
    TIKTOK: 'https://tiktok.com/@plipli9paranormal',
    INSTAGRAM: 'https://instagram.com/plipli9paranormal',
    YOUTUBE: 'https://youtube.com/@plipli9paranormal'
  }
} as const

/**
 * Rate Limiting Implementation
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Aplică rate limiting pe bază de IP
 */
export function applyRateLimit(
  identifier: string,
  maxRequests: number = PARANORMAL_CONSTANTS.RATE_LIMIT_REQUESTS,
  windowMs: number = PARANORMAL_CONSTANTS.RATE_LIMIT_WINDOW
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Curăță intrările expirate
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  })

  const existing = rateLimitStore.get(identifier)
  
  if (!existing || existing.resetTime < now) {
    // Prima cerere în fereastră sau fereastra a expirat
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }

  if (existing.count >= maxRequests) {
    // Limita depășită
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime
    }
  }

  // Incrementează contorul
  existing.count++
  rateLimitStore.set(identifier, existing)

  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime
  }
}

/**
 * Extrage identificatorul client pentru rate limiting
 */
export function getClientIdentifier(request: Request): string {
  // Prioritizează IP-ul real din headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('remote-addr')
  
  const ip = forwardedFor?.split(',')[0]?.trim() || realIP || remoteAddr || 'unknown'
  
  // Pentru siguranță suplimentară, include și User-Agent
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const uaHash = userAgent.substring(0, 50) // Primele 50 caractere
  
  return `${ip}:${uaHash}`
}

/**
 * Sanitizare avansată pentru input-uri text
 */
export function sanitizeTextInput(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') {
    throw new Error('Input trebuie să fie string')
  }
  
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Elimină caractere de control
    .replace(/\s+/g, ' ') // Înlocuiește spații multiple cu unul singur
    .substring(0, maxLength)
}

/**
 * Validare email îmbunătățită
 */
export function validateEmailAdvanced(email: string): { isValid: boolean; error?: string } {
  if (typeof email !== 'string') {
    return { isValid: false, error: 'Email trebuie să fie string' }
  }

  const sanitized = email.trim().toLowerCase()
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Email este obligatoriu' }
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email prea lung (max 254 caractere)' }
  }

  // Regex îmbunătățit pentru email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Format email invalid' }
  }

  // Verifică domenii blocate (spam/temp emails)
  const blockedDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com']
  const domain = sanitized.split('@')[1]
  if (blockedDomains.includes(domain)) {
    return { isValid: false, error: 'Domeniu email temporar nu este permis' }
  }

  return { isValid: true }
}

/**
 * Validare cod de acces îmbunătățită
 */
export function validateAccessCodeAdvanced(code: string): { isValid: boolean; error?: string; sanitized?: string } {
  if (typeof code !== 'string') {
    return { isValid: false, error: 'Codul trebuie să fie string' }
  }

  const sanitized = code.trim().toUpperCase().replace(/[-\s]/g, '')
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Cod de acces este obligatoriu' }
  }

  // Format: PLI123ABC (9 caractere total)
  const pattern = /^PLI\d{3}[A-Z]{3}$/
  if (!pattern.test(sanitized)) {
    return { isValid: false, error: 'Format cod invalid (format așteptat: PLI123ABC)' }
  }

  return { isValid: true, sanitized }
} 