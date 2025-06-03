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
  WifiOff
} from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import PaymentForm from '@/components/PaymentForm'
import AccessControl from '@/components/AccessControl'
import ChatComponent from '@/components/ChatComponent'
import LoadingSpinner from '@/components/LoadingSpinner'

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

const LivePage = () => {
  const [hasAccess, setHasAccess] = useState(false)
  const [accessSession, setAccessSession] = useState<AccessSession | null>(null)
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [mounted, setMounted] = useState(false)
  const [nextLiveTime, setNextLiveTime] = useState('')

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
      // DEMO MODE - simulăm validarea
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulăm că orice cod care începe cu PLI este valid
      if (code.startsWith('PLI') && code.length >= 6) {
        const simulatedSession = {
          code: code,
          email: 'demo@example.com',
          expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          usage_count: 0,
          time_remaining: {
            total_minutes: 480,
            hours: 8,
            minutes: 0,
            formatted: '8h 0m'
          },
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString()
        }
        
        setHasAccess(true)
        setAccessSession(simulatedSession)
        setError('')
        
        console.log('DEMO: Access granted successfully:', simulatedSession)
      } else {
        setError('Cod de acces invalid. Folosește un cod care începe cu PLI (ex: PLI123ABC)')
      }

      /* REAL API CALL - disabled pentru demo
      const response = await fetch('/api/access-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (data.success && data.session) {
        setHasAccess(true)
        setAccessSession(data.session)
        setError('')
        
        // Notifică utilizatorul de succes
        console.log('Access granted successfully:', {
          code: data.session.code,
          timeRemaining: data.session.time_remaining.formatted,
          email: data.session.email
        })
      } else {
        setError(data.message || data.error || 'Cod de acces invalid')
      }
      */
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

  // Format timp rămas din sesiunea de acces
  const formatTimeRemaining = () => {
    if (!accessSession?.time_remaining) return ''
    
    const { hours, minutes } = accessSession.time_remaining
    if (hours > 0) return `${hours}h ${minutes}m rămas`
    return `${minutes}m rămas`
  }

  // Format următorul LIVE estimat - now using state
  const formatNextLiveTime = () => {
    return nextLiveTime || 'Se calculează...'
  }

  // Nu renderiza timpurile dinamice până nu e mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mystery-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-paranormal-600">Se încarcă experiența paranormală...</p>
        </div>
      </div>
    )
  }

  // Dacă utilizatorul nu are acces, afișează formularele de plată/acces
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header cu status conexiune */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-mystery-600 rounded-xl flex items-center justify-center mystery-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-paranormal-800">
                LIVE <span className="text-mystery-600">Paranormal</span>
              </h1>
            </div>
            
            {/* Status LIVE și conexiune */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isLive 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="font-medium">
                    {isLive ? 'LIVE ACUM' : 'OFFLINE'}
                  </span>
                  {liveSession && (
                    <span className="text-xs bg-black/10 px-2 py-1 rounded">
                      {liveSession.viewer_count} viewers
                    </span>
                  )}
                </div>
                
                {/* Connection Status */}
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                  connectionStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {connectionStatus === 'connected' ? <Wifi className="w-3 h-3" /> : 
                   connectionStatus === 'checking' ? <LoadingSpinner /> : 
                   <WifiOff className="w-3 h-3" />}
                  <span>
                    {connectionStatus === 'connected' ? 'Conectat' :
                     connectionStatus === 'checking' ? 'Verifică...' :
                     'Conexiune erorată'}
                  </span>
                </div>
              </div>
              
              {!isLive && (
                <div className="flex items-center space-x-2 text-paranormal-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Următorul LIVE în: <strong>{formatNextLiveTime()}</strong>
                  </span>
                </div>
              )}
              
              {isLive && liveSession && (
                <div className="text-center">
                  <p className="text-ghost-600 font-medium">
                    📍 {liveSession.location}
                  </p>
                  <p className="text-sm text-paranormal-500">
                    Început: {new Date(liveSession.started_at).toLocaleTimeString('ro-RO')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acces Protection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
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
    <div className="min-h-screen bg-black">
      <div className="flex flex-col lg:flex-row h-screen pt-16">
        
        {/* Video Player - ocupă majoritatea spațiului */}
        <div className="flex-1 flex flex-col">
          <div className="bg-paranormal-900 px-6 py-4 border-b border-paranormal-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-white font-medium">
                    {isLive ? 'LIVE PARANORMAL' : 'OFFLINE'}
                  </span>
                  {liveSession && (
                    <span className="text-xs bg-black/20 px-2 py-1 rounded text-paranormal-300">
                      {liveSession.location}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-paranormal-300">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {liveSession?.viewer_count || 0} exploratori online
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {accessSession && (
                  <div className="text-ghost-400 text-sm">
                    ⏰ {formatTimeRemaining()}
                  </div>
                )}
                <div className="text-ghost-400 text-sm">
                  Cod: ****{accessSession?.code.slice(-4)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-black">
            {isLive && liveSession ? (
              <VideoPlayer 
                playbackId={liveSession.playback_id} 
                isLive={true}
                playbackUrl={liveSession.playback_url}
              />
            ) : (
              <div className="text-center text-white p-12">
                <div className="w-24 h-24 bg-paranormal-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-paranormal-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {connectionStatus === 'checking' ? 'Verifică status LIVE...' : 'LIVE-ul va începe în curând'}
                </h3>
                <p className="text-paranormal-300 mb-6">
                  Următorul LIVE în: {formatNextLiveTime()}
                </p>
                <p className="text-sm text-paranormal-400">
                  Rămâi pe pagină pentru a fi notificat automat când începe transmisia.
                </p>
                
                {accessSession && (
                  <div className="mt-6 p-4 bg-paranormal-800/50 rounded-lg inline-block">
                    <p className="text-ghost-400 text-sm">
                      ✅ Cod activ • Timp rămas: {formatTimeRemaining()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 bg-paranormal-900 border-l border-paranormal-700">
          <ChatComponent 
            isLive={isLive}
            viewerCount={liveSession?.viewer_count || 0}
          />
        </div>
      </div>
    </div>
  )
}

export default LivePage 