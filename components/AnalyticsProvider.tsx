'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  initGA, 
  trackPageView, 
  startUserSession, 
  endUserSession,
  trackError,
  trackPerformance 
} from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize Google Analytics
    initGA()
    
    // Start user session
    startUserSession()
    
    // Track performance metrics
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (perfData) {
            trackPerformance({
              page: pathname,
              loadTime: perfData.loadEventEnd - perfData.loadEventStart,
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              firstContentfulPaint: perfData.responseStart - perfData.requestStart
            })
          }
        }, 1000)
      })
    }

    // Global error tracking
    const handleError = (event: ErrorEvent) => {
      trackError({
        message: event.message,
        stack: event.error?.stack,
        page: pathname,
        userAgent: navigator.userAgent
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        page: pathname,
        userAgent: navigator.userAgent
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup session on page unload
    const handleBeforeUnload = () => {
      endUserSession()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
      
      // Update pages visited count
      if (typeof window !== 'undefined') {
        const currentCount = parseInt(sessionStorage.getItem('plipli9_pages_visited') || '0')
        sessionStorage.setItem('plipli9_pages_visited', (currentCount + 1).toString())
      }
    }
  }, [pathname])

  return <>{children}</>
}

export default AnalyticsProvider 