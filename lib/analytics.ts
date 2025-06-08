// Google Analytics 4 & Custom Analytics pentru Plipli9 Paranormal

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Analytics Configuration
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
const isProduction = process.env.NODE_ENV === 'production'

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && isProduction) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_TRACKING_ID, {
      anonymize_ip: true,
      cookie_flags: 'secure;samesite=lax',
      custom_map: {
        custom_parameter_1: 'paranormal_event_type',
        custom_parameter_2: 'live_session_id'
      }
    })
  }
}

// Generic event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      timestamp: new Date().toISOString()
    })
  }
  
  // Log în development pentru debugging
  if (!isProduction) {
    console.log('📊 Analytics Event:', { action, category, label, value })
  }
}

// Paranormal-specific Analytics Events

// Payment & Revenue Analytics
export const trackPayment = (paymentData: {
  accessCode: string
  amount: number
  currency: string
  paymentMethod: string
  email: string
}) => {
  // Google Analytics Enhanced Ecommerce
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'purchase', {
      transaction_id: paymentData.accessCode,
      value: paymentData.amount,
      currency: paymentData.currency,
      payment_type: paymentData.paymentMethod,
      items: [{
        item_id: 'paranormal_live_access',
        item_name: 'Acces LIVE Paranormal',
        category: 'paranormal_experience',
        quantity: 1,
        price: paymentData.amount
      }]
    })
  }
  
  trackEvent('payment_completed', 'revenue', paymentData.paymentMethod, paymentData.amount)
  
  // Custom analytics pentru business intelligence
  trackCustomEvent('payment', {
    accessCode: paymentData.accessCode,
    amount: paymentData.amount,
    currency: paymentData.currency,
    method: paymentData.paymentMethod,
    timestamp: new Date().toISOString()
  })
}

// Live Stream Analytics
export const trackLiveStreamStart = (sessionData: {
  sessionId: string
  location: string
  streamSource: string
}) => {
  trackEvent('live_stream_started', 'engagement', sessionData.location)
  
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'live_stream_start', {
      live_session_id: sessionData.sessionId,
      paranormal_location: sessionData.location,
      stream_source: sessionData.streamSource,
      custom_parameter_1: 'live_start',
      custom_parameter_2: sessionData.sessionId
    })
  }
  
  trackCustomEvent('live_start', sessionData)
}

export const trackLiveStreamJoin = (sessionData: {
  sessionId: string
  accessCode: string
  viewerCount: number
}) => {
  trackEvent('live_stream_joined', 'engagement', sessionData.sessionId, sessionData.viewerCount)
  
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'join_group', {
      group_id: sessionData.sessionId,
      method: 'access_code',
      current_viewers: sessionData.viewerCount
    })
  }
  
  trackCustomEvent('live_join', sessionData)
}

export const trackLiveStreamEnd = (sessionData: {
  sessionId: string
  duration: number
  peakViewers: number
  totalMessages: number
}) => {
  trackEvent('live_stream_ended', 'engagement', sessionData.sessionId, sessionData.duration)
  
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'live_stream_end', {
      live_session_id: sessionData.sessionId,
      session_duration: sessionData.duration,
      peak_viewers: sessionData.peakViewers,
      total_chat_messages: sessionData.totalMessages,
      custom_parameter_1: 'live_end',
      custom_parameter_2: sessionData.sessionId
    })
  }
  
  trackCustomEvent('live_end', sessionData)
}

// Chat & Engagement Analytics
export const trackChatMessage = (messageData: {
  sessionId: string
  messageLength: number
  isFirstMessage: boolean
}) => {
  trackEvent('chat_message_sent', 'engagement', messageData.sessionId, messageData.messageLength)
  
  if (messageData.isFirstMessage) {
    trackEvent('first_chat_message', 'engagement', messageData.sessionId)
  }
  
  trackCustomEvent('chat_message', messageData)
}

// User Journey Analytics
export const trackPageView = (page: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || 'Plipli9 Paranormal',
      page_location: window.location.href,
      page_path: page
    })
  }
  
  trackEvent('page_view', 'navigation', page)
}

export const trackAccessCodeUsage = (codeData: {
  accessCode: string
  usageCount: number
  timeRemaining: number
  isExpired: boolean
}) => {
  trackEvent('access_code_used', 'user_behavior', codeData.accessCode, codeData.usageCount)
  
  if (codeData.isExpired) {
    trackEvent('access_code_expired', 'user_behavior', codeData.accessCode)
  }
  
  trackCustomEvent('access_code_usage', codeData)
}

// Error & Performance Analytics
export const trackError = (error: {
  message: string
  stack?: string
  page: string
  userAgent?: string
}) => {
  trackEvent('error_occurred', 'technical', error.page)
  
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      page_location: error.page
    })
  }
  
  trackCustomEvent('error', error)
}

export const trackPerformance = (performanceData: {
  page: string
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
}) => {
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'timing_complete', {
      name: 'page_load',
      value: Math.round(performanceData.loadTime)
    })
  }
  
  trackCustomEvent('performance', performanceData)
}

// Business Intelligence Events
export const trackConversion = (conversionData: {
  type: 'payment' | 'signup' | 'access_code_creation'
  source: string
  value?: number
  stepsFunnel?: string[]
}) => {
  trackEvent('conversion', 'business', conversionData.type, conversionData.value)
  
  if (typeof window !== 'undefined' && window.gtag && isProduction) {
    window.gtag('event', 'conversion', {
      conversion_type: conversionData.type,
      traffic_source: conversionData.source,
      conversion_value: conversionData.value || 0
    })
  }
  
  trackCustomEvent('conversion', conversionData)
}

// Custom Event Tracking către backend pentru BI
export const trackCustomEvent = async (eventType: string, eventData: any) => {
  try {
    // Trimite către propriul nostru analytics API pentru business intelligence
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      })
    })
  } catch (error) {
    console.error('Error tracking custom event:', error)
  }
}

// Real-time Analytics pentru Dashboard
export const getRealtimeStats = async () => {
  try {
    const response = await fetch('/api/analytics/realtime')
    return await response.json()
  } catch (error) {
    console.error('Error fetching realtime stats:', error)
    return null
  }
}

// User Session Analytics
export const startUserSession = () => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('plipli9_session_id', sessionId)
    sessionStorage.setItem('plipli9_session_start', new Date().toISOString())
  }
  
  trackEvent('session_start', 'user_behavior', sessionId)
  return sessionId
}

export const endUserSession = () => {
  if (typeof window !== 'undefined') {
    const sessionId = sessionStorage.getItem('plipli9_session_id')
    const sessionStart = sessionStorage.getItem('plipli9_session_start')
    
    if (sessionId && sessionStart) {
      const duration = Date.now() - new Date(sessionStart).getTime()
      trackEvent('session_end', 'user_behavior', sessionId, Math.round(duration / 1000))
      
      trackCustomEvent('session_end', {
        sessionId,
        duration: Math.round(duration / 1000),
        pages_visited: sessionStorage.getItem('plipli9_pages_visited') || 1
      })
    }
  }
}

// Utility Functions
export const isAnalyticsEnabled = () => {
  return isProduction && !!GA_TRACKING_ID
}

export const getCurrentSessionId = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('plipli9_session_id')
  }
  return null
} 