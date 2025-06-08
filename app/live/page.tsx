'use client'

import React, { useState, useEffect } from 'react'
import { 
  Zap, 
  Clock, 
  Users, 
  CreditCard, 
  Key, 
  Shield, 
  Calendar,
  Play,
  Lock,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  MessageCircle
} from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import PaymentForm from '@/components/PaymentForm'
import AccessControl from '@/components/AccessControl'
import ChatComponent from '@/components/ChatComponent'
import LiveChat from '@/components/LiveChat'
import LoadingSpinner from '@/components/LoadingSpinner'
import SessionTakeoverModal from '@/components/SessionTakeoverModal'

// Types pentru API responses
interface LiveSession {
  session_id: string
  playback_url: string
  playback_id: string
  location: string
  started_at: string
  estimated_duration: number
  stream_source: string
  viewer_count: number
  status: string
}

interface AccessSession {
  code: string
  email: string
  expires_at: string
  usage_count: number
  time_remaining: {
    total_minutes: number
    hours: number
    minutes: number
    formatted: string
  }
  created_at: string
  last_used_at: string
}

interface AccessCode {
  code: string
  email: string
  expires_at: string
  usage_count: number
}

interface SessionConflict {
  needsTakeover: boolean
  currentDevice?: {
    userAgent: string
    ip: string
    connectedAt: string
    sessionId: string
  }
  message: string
}

const LivePage = () => {
  const [hasAccess, setHasAccess] = useState(false)
  const [accessSession, setAccessSession] = useState<AccessSession | null>(null)
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [mounted, setMounted] = useState(false)
  const [nextLiveTime, setNextLiveTime] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [userAccessCode, setUserAccessCode] = useState<AccessCode | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  
  // Session conflict state
  const [showTakeoverModal, setShowTakeoverModal] = useState(false)
  const [sessionConflict, setSessionConflict] = useState<SessionConflict | null>(null)
  const [isProcessingTakeover, setIsProcessingTakeover] = useState(false)

  // YouTube Live configuration
  const [isYouTubeLive, setIsYouTubeLive] = useState(false)
  const [youtubeVideoId, setYoutubeVideoId] = useState('')

  // Twitch Live configuration  
  const [isTwitchLive, setIsTwitchLive] = useState(false)
  const [twitchChannel, setTwitchChannel] = useState('')

  // Twitch Live override pentru demo
  const DEMO_TWITCH_LIVE = {
    enabled: true,
    channel: 'plipli9', // Username-ul exact de pe Twitch
    title: 'PLIPLI9 PARANORMAL - Twitch Live'
  }

  // Mobile optimization: Format time for smaller screens
  const formatTimeRemainingMobile = () => {
    if (!accessSession?.time_remaining) return ''
    const { hours, minutes } = accessSession.time_remaining
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Mobile viewport detection
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(true)
  const [chatOpacity, setChatOpacity] = useState(0.8)
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide chat on mobile after inactivity
  useEffect(() => {
    if (!isMobile) return
    
    let hideTimer: NodeJS.Timeout
    
    const resetHideTimer = () => {
      clearTimeout(hideTimer)
      setShowMobileChat(true)
      hideTimer = setTimeout(() => {
        if (!isTyping) {
          setShowMobileChat(false)
        }
      }, 5000) // Hide after 5 seconds of inactivity
    }
    
    resetHideTimer()
    
    // Show chat on any touch/click
    const handleInteraction = () => resetHideTimer()
    document.addEventListener('touchstart', handleInteraction)
    document.addEventListener('click', handleInteraction)
    
    return () => {
      clearTimeout(hideTimer)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [isMobile, isTyping])

  const formatTimeRemaining = () => {
    if (!accessSession?.time_remaining) return 'Calculez...'
    
    const { hours, minutes } = accessSession.time_remaining
    
    if (hours > 0) {
      return isMobile ? `${hours}h ${minutes}m` : `${hours} ore și ${minutes} minute`
    }
    
    return isMobile ? `${minutes}m` : `${minutes} minute`
  }

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      ip: 'auto-detect', // Will be filled by server
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  const checkSessionConflict = async (code: string) => {
    try {
      const response = await fetch('/api/access-codes/session-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          deviceInfo: getDeviceInfo()
        })
      })

      const result = await response.json()
      
      if (result.needsTakeover) {
        setSessionConflict(result)
        setShowTakeoverModal(true)
        return false // Nu permite accesul încă
      }

      return result.canAccess
    } catch (error) {
      console.error('Eroare verificare conflict sesiune:', error)
      return true // Permite accesul în caz de eroare
    }
  }

  const handleTakeover = async () => {
    if (!sessionConflict || !accessCode) return

    setIsProcessingTakeover(true)
    try {
      const response = await fetch('/api/access-codes/takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: accessCode,
          deviceInfo: getDeviceInfo(),
          confirmTakeover: true
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Sesiune preluată cu succes
        setShowTakeoverModal(false)
        setSessionConflict(null)
        
        // Continuă cu validarea normală
        await validateAccessCode()
      } else {
        setError('Nu s-a putut prelua sesiunea. Încearcă din nou.')
      }
    } catch (error) {
      setError('Eroare la preluarea sesiunii')
    } finally {
      setIsProcessingTakeover(false)
    }
  }

  const validateAccessCode = async () => {
    if (!accessCode.trim()) {
      setError('Introdu codul de acces')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      // Prima verifică conflictele de sesiune
      const canAccess = await checkSessionConflict(accessCode)
      if (!canAccess) {
        setIsValidating(false)
        return // Așteaptă decizia utilizatorului despre takeover
      }

      // Validare normală
      const response = await fetch('/api/access-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: accessCode,
          deviceInfo: getDeviceInfo()
        })
      })

      const result = await response.json()

      if (result.valid) {
        setUserAccessCode(result.accessCode)
        setCurrentSession(result.session)
        
        // Salvează în localStorage pentru persistență
        localStorage.setItem('plipli9_access_code', accessCode)
        localStorage.setItem('plipli9_session_id', result.session?.sessionId || '')
      } else {
        setError(result.error || 'Cod invalid sau expirat')
      }
    } catch (error) {
      console.error('Eroare validare:', error)
      setError('Eroare de conectare. Încearcă din nou.')
    } finally {
      setIsValidating(false)
    }
  }

  // Verifică localStorage la încărcare
  useEffect(() => {
    const savedCode = localStorage.getItem('plipli9_access_code')
    const savedSessionId = localStorage.getItem('plipli9_session_id')
    
    if (savedCode && savedSessionId) {
      setAccessCode(savedCode)
      // Re-validează sesiunea salvată
      validateAccessCode()
    }
  }, [])

  // Fix hydration - doar pe client
  useEffect(() => {
    setMounted(true)
    
    // Calculează timpul pentru următorul LIVE doar pe client
    const calculateNextLiveTime = () => {
      const now = new Date()
      const nextSaturday = new Date()
      const daysUntilSaturday = (6 - now.getDay()) % 7 || 7
      nextSaturday.setDate(now.getDate() + daysUntilSaturday)
      nextSaturday.setHours(21, 0, 0, 0)
      
      const diff = nextSaturday.getTime() - now.getTime()
      if (diff <= 0) return 'În curând!'
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) return `${days}z ${hours}h ${minutes}m`
      if (hours > 0) return `${hours}h ${minutes}m`
      return `${minutes}m`
    }

    setNextLiveTime(calculateNextLiveTime())
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setNextLiveTime(calculateNextLiveTime())
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [])

  // Verifică status LIVE curent prin API - DISABLED pentru demo
  const checkLiveStatus = async () => {
    try {
      setConnectionStatus('checking')
      
      // DEMO MODE - simulăm răspuns
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulează că nu există sesiune activă
      setLiveSession(null)
      setIsLive(false)
      setConnectionStatus('connected')
      
      /* REAL API CALL - disabled pentru demo
      const response = await fetch('/api/live-sessions/current', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (data.session) {
        setLiveSession(data.session)
        setIsLive(data.session.status === 'active')
        setConnectionStatus('connected')
      } else {
        setLiveSession(null)
        setIsLive(false)
        setConnectionStatus('connected')
      }
      */
    } catch (error) {
      console.error('Error checking live status:', error)
      setConnectionStatus('connected') // Forțează connected în demo mode
      setIsLive(false)
    }
  }

  // Efecte pentru verificarea statusului LIVE
  useEffect(() => {
    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 15000) // Verifică la fiecare 15 secunde
    return () => clearInterval(interval)
  }, [])

  // Handle validare cod de acces prin API real - DEMO MODE
  const handleAccessCodeSubmit = async (code: string) => {
    setLoading(true)
    setError('')

    try {
      // REAL API CALL pentru validarea codurilor (inclusiv COS23091)
      const response = await fetch('/api/access-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code.trim().toUpperCase(),
          deviceInfo: getDeviceInfo()
        }),
      })

      const data = await response.json()

      if (data.valid && data.accessCode) {
        // Construim session data compatibil cu interfața existentă
        const sessionData = {
          code: data.accessCode.code,
          email: data.accessCode.email,
          expires_at: data.accessCode.expires_at,
          usage_count: data.accessCode.usage_count,
          time_remaining: {
            total_minutes: data.session?.unlimited ? 999999 : 480,
            hours: data.session?.unlimited ? 999999 : 8,
            minutes: 0,
            formatted: data.session?.unlimited ? 'NELIMITAT' : '8h 0m'
          },
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
          unlimited: data.session?.unlimited || false
        }
        
        setHasAccess(true)
        setAccessSession(sessionData)
        setError('')
        
        if (data.session?.unlimited) {
          console.log('🎯 SPECIAL CODE: Unlimited access granted for', data.accessCode.code)
        } else {
          console.log('✅ Access granted successfully:', sessionData)
        }
      } else {
        setError(data.error || 'Cod de acces invalid')
      }
    } catch (err) {
      console.error('Access validation error:', err)
      setError('Eroare de conexiune. Verifică internetul și încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  // Handle plată procesată cu succes
  const handlePaymentSuccess = (accessCode: string) => {
    // Automat încearcă să valideze codul nou primit
    handleAccessCodeSubmit(accessCode)
  }

  // Format următorul LIVE estimat - now using state
  const formatNextLiveTime = () => {
    return nextLiveTime || 'Se calculează...'
  }

  // Check pentru Twitch Live Demo
  useEffect(() => {
    if (DEMO_TWITCH_LIVE.enabled && hasAccess) {
      setIsTwitchLive(true)
      setTwitchChannel(DEMO_TWITCH_LIVE.channel)
      setIsLive(true)
      setConnectionStatus('connected')
      
      // Dezactivează YouTube dacă era activ
      setIsYouTubeLive(false)
      setYoutubeVideoId('')
      
      // Forțează status-ul ca fiind LIVE pentru demo
      console.log('🔴 DEMO: Twitch Live activated for @' + DEMO_TWITCH_LIVE.channel)
    }
  }, [hasAccess])

  // DEMO: Forțează live status când user-ul are acces
  useEffect(() => {
    if (hasAccess && DEMO_TWITCH_LIVE.enabled) {
      setIsLive(true)
      setIsTwitchLive(true)
      setTwitchChannel(DEMO_TWITCH_LIVE.channel)
    }
  }, [hasAccess, userAccessCode])

  // Nu renderiza timpurile dinamice până nu e mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-8 flex items-center justify-center">
        <LoadingSpinner 
          variant="paranormal" 
          size="lg" 
          message="Se încarcă experiența paranormală..."
        />
      </div>
    )
  }

  // Dacă utilizatorul nu are acces, afișează formularele de plată/acces
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-16 pb-20 sm:pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header cu status conexiune */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mystery-600 rounded-xl flex items-center justify-center mystery-glow">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-paranormal-800">
                LIVE <span className="text-mystery-600">Paranormal</span>
              </h1>
            </div>
            
            {/* Status LIVE și conexiune */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full text-sm ${
                  isLive 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                    isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="font-medium text-xs sm:text-sm">
                    {isLive ? 'LIVE ACUM' : 'OFFLINE'}
                  </span>
                  {liveSession && (
                    <span className="text-xs bg-black/10 px-2 py-1 rounded">
                      {liveSession.viewer_count} viewers
                    </span>
                  )}
                </div>
                
                {/* Connection Status */}
                <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                  connectionStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {connectionStatus === 'connected' ? <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : 
                   connectionStatus === 'checking' ? <LoadingSpinner size="sm" variant="mystery" message="" /> : 
                   <WifiOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  <span className="text-xs">
                    {connectionStatus === 'connected' ? 'Conectat' :
                     connectionStatus === 'checking' ? 'Verifică...' :
                     'Conexiune erorată'}
                  </span>
                </div>
              </div>
              
              {!isLive && (
                <div className="flex items-center space-x-2 text-paranormal-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    Următorul LIVE în: <strong>{formatNextLiveTime()}</strong>
                  </span>
                </div>
              )}
              
              {isLive && liveSession && (
                <div className="text-center">
                  <p className="text-ghost-600 font-medium text-sm sm:text-base">
                    📍 {liveSession.location}
                  </p>
                  <p className="text-xs sm:text-sm text-paranormal-500">
                    Început: {new Date(liveSession.started_at).toLocaleTimeString('ro-RO')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acces Protection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Access Code Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Key className="w-6 h-6 text-mystery-600" />
                <h2 className="text-2xl font-bold text-paranormal-800">Am deja acces</h2>
              </div>
              
              <p className="text-paranormal-600 mb-6">
                Introdu codul de acces de 8 ore primit prin email:
              </p>
              
              <AccessControl 
                onAccessGranted={handleAccessCodeSubmit}
                loading={loading}
                error={error}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Acces Flexibil 8 Ore</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Poți intra și ieși de câte ori vrei</li>
                  <li>• Chiar dacă se întrerupe LIVE-ul, codul rămâne valabil</li>
                  <li>• Funcționează pe orice device</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-ghost-600" />
                <h2 className="text-2xl font-bold text-paranormal-800">Cumpără acces</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-paranormal-50 rounded-lg">
                  <div>
                    <span className="text-paranormal-700 font-medium">Acces LIVE Paranormal</span>
                    <p className="text-xs text-paranormal-500">8 ore acces flexibil</p>
                  </div>
                  <span className="text-2xl font-bold text-mystery-600">25 RON</span>
                </div>
                
                <div className="space-y-2 text-sm text-paranormal-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Acces complet la LIVE-ul paranormal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Chat în timp real cu alți exploratori</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Acces flexibil: poți ieși și intra din nou</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Protecție: dacă se întrerupe, codul rămâne valabil</span>
                  </div>
                </div>
              </div>
              
              <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-paranormal-800 mb-4">
              Ce să te aștepți de la LIVE-ul paranormal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-mystery-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-mystery-600" />
                </div>
                <h4 className="font-semibold text-paranormal-800 mb-2">Experiență Autentică</h4>
                <p className="text-sm text-paranormal-600">
                  Investigații reale în locuri cu adevărat bântuite
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-ghost-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-ghost-600" />
                </div>
                <h4 className="font-semibold text-paranormal-800 mb-2">Comunitate</h4>
                <p className="text-sm text-paranormal-600">
                  Interacționează cu alți exploratori prin chat
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-paranormal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-paranormal-600" />
                </div>
                <h4 className="font-semibold text-paranormal-800 mb-2">Program Regulat</h4>
                <p className="text-sm text-paranormal-600">
                  LIVE-uri spontane și programate regulat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dacă utilizatorul are acces, afișează player-ul video și chat-ul
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Simple header - minimal & mobile optimized */}
      <div className="bg-black border-b border-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm sm:text-base">
            {isMobile ? 'PLIPLI9' : 'PLIPLI9 PARANORMAL'}
          </span>
          {isLive && (
            <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-white text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>
        
        {accessSession && (
          <div className="text-green-400 text-xs sm:text-sm font-medium">
            ⏰ {formatTimeRemaining()}
          </div>
        )}
      </div>

      {/* Main content area - responsive layout */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Mobile Layout - TikTok Style with Transparent Chat Overlay */}
        {isMobile ? (
          <>
            {/* Full screen video - covers entire screen */}
            <div className="absolute inset-0 bg-black">
              {(isLive && (liveSession || isYouTubeLive || isTwitchLive)) || (hasAccess && DEMO_TWITCH_LIVE.enabled) ? (
                <VideoPlayer 
                  playbackId={liveSession?.playback_id} 
                  isLive={true}
                  playbackUrl={liveSession?.playback_url}
                  isYouTubeLive={isYouTubeLive}
                  youtubeVideoId={youtubeVideoId}
                  isTwitchLive={isTwitchLive || (hasAccess && DEMO_TWITCH_LIVE.enabled)}
                  twitchChannel={twitchChannel || (hasAccess && DEMO_TWITCH_LIVE.enabled ? DEMO_TWITCH_LIVE.channel : '')}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white p-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">LIVE va începe în curând</h3>
                    <p className="text-gray-400 text-sm">Următorul stream în: {formatNextLiveTime()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* TikTok-style Chat Overlay - Right side, transparent */}
            <div 
              className={`absolute right-2 top-20 bottom-20 w-64 z-30 transition-all duration-300 ${
                showMobileChat ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
              style={{ 
                backgroundColor: `rgba(0, 0, 0, ${isTyping ? 0.9 : chatOpacity})`,
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(147, 51, 234, 0.3)'
              }}
              onTouchStart={() => setIsTyping(true)}
              onTouchEnd={() => setIsTyping(false)}
            >
              <div className="h-full flex flex-col">
                {/* Compact header for mobile overlay */}
                <div className="flex items-center justify-between p-2 border-b border-purple-500/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold text-sm">Chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-xs">{liveSession?.viewer_count || 0}</span>
                    <button
                      onClick={() => setShowMobileChat(!showMobileChat)}
                      className="text-purple-400 hover:text-purple-300 p-1"
                    >
                      {showMobileChat ? '→' : '←'}
                    </button>
                  </div>
                </div>

                {/* LiveChat Component - Full overlay */}
                <LiveChat 
                  isStreamerView={false}
                  streamId={liveSession?.session_id || 'plipli9-paranormal-live'}
                  viewerCount={liveSession?.viewer_count || 0}
                  isMobileOverlay={true}
                  onTypingChange={setIsTyping}
                />
              </div>
            </div>

            {/* Quick Chat Toggle Button - Always visible */}
            <button
              onClick={() => setShowMobileChat(!showMobileChat)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center z-40 border border-purple-400/50"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>

            {/* Opacity Control - Swipe area at bottom */}
            <div 
              className="absolute bottom-4 left-4 right-4 h-12 z-20 flex items-center justify-center"
              onTouchStart={(e) => {
                const startY = e.touches[0].clientY
                const handleTouchMove = (e: TouchEvent) => {
                  const currentY = e.touches[0].clientY
                  const deltaY = startY - currentY
                  const newOpacity = Math.max(0.3, Math.min(1, chatOpacity + deltaY / 200))
                  setChatOpacity(newOpacity)
                }
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove)
                  document.removeEventListener('touchend', handleTouchEnd)
                }
                document.addEventListener('touchmove', handleTouchMove)
                document.addEventListener('touchend', handleTouchEnd)
              }}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
                <span className="text-white text-xs">💬 Swipe ↕ pentru transparență chat</span>
              </div>
            </div>
          </>
        ) : (
          /* Desktop Layout - Side by side */
          <div className="flex h-full">
            {/* Video Player - takes most space */}
            <div className="flex-1 bg-black flex items-center justify-center">
              {(isLive && (liveSession || isYouTubeLive || isTwitchLive)) || (hasAccess && DEMO_TWITCH_LIVE.enabled) ? (
                <VideoPlayer 
                  playbackId={liveSession?.playback_id} 
                  isLive={true}
                  playbackUrl={liveSession?.playback_url}
                  isYouTubeLive={isYouTubeLive}
                  youtubeVideoId={youtubeVideoId}
                  isTwitchLive={isTwitchLive || (hasAccess && DEMO_TWITCH_LIVE.enabled)}
                  twitchChannel={twitchChannel || (hasAccess && DEMO_TWITCH_LIVE.enabled ? DEMO_TWITCH_LIVE.channel : '')}
                />
              ) : (
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">LIVE va începe în curând</h3>
                  <p className="text-gray-400">Următorul stream în: {formatNextLiveTime()}</p>
                </div>
              )}
            </div>

            {/* Chat Sidebar - fixed width on desktop */}
            <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
              <LiveChat 
                isStreamerView={false}
                streamId={liveSession?.session_id || 'plipli9-paranormal-live'}
                viewerCount={liveSession?.viewer_count || 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LivePage 