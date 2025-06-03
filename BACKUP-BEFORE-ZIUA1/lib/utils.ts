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