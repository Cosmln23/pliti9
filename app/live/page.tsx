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
  AlertCircle
} from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import PaymentForm from '@/components/PaymentForm'
import AccessControl from '@/components/AccessControl'
import ChatComponent from '@/components/ChatComponent'
import LoadingSpinner from '@/components/LoadingSpinner'

const LivePage = () => {
  const [hasAccess, setHasAccess] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [nextLiveTime, setNextLiveTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Simulează data următorului LIVE (sâmbătă la 21:00)
  useEffect(() => {
    const getNextSaturday = () => {
      const now = new Date()
      const nextSaturday = new Date()
      const daysUntilSaturday = (6 - now.getDay()) % 7 || 7
      nextSaturday.setDate(now.getDate() + daysUntilSaturday)
      nextSaturday.setHours(21, 0, 0, 0)
      return nextSaturday
    }

    setNextLiveTime(getNextSaturday())
    setViewerCount(Math.floor(Math.random() * 200) + 50) // Simulează viewers
  }, [])

  // Verifică status LIVE (în aplicația reală, aceasta ar fi o chiamare API)
  useEffect(() => {
    const checkLiveStatus = async () => {
      // Simulează verificarea status-ului LIVE
      // În realitate, aceasta ar fi o chiamare către Livepeer API
      setIsLive(Math.random() > 0.7) // 30% șanse să fie live pentru demo
    }

    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 30000) // Verifică la fiecare 30 sec

    return () => clearInterval(interval)
  }, [])

  const handleAccessCodeSubmit = async (code: string) => {
    setLoading(true)
    setError('')

    try {
      // Simulează verificarea codului (în realitate ar fi API call)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Pentru demo, orice cod cu mai mult de 6 caractere este valid
      if (code.length >= 6) {
        setHasAccess(true)
        setAccessCode(code)
      } else {
        setError('Cod de acces invalid. Verifică emailul sau achiziționează acces.')
      }
    } catch (err) {
      setError('Eroare la verificarea codului. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeUntilLive = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff <= 0) return 'LIVE ACUM!'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}z ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Dacă utilizatorul nu are acces, afișează formularele de plată/acces
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-mystery-600 rounded-xl flex items-center justify-center mystery-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-paranormal-800">
                LIVE <span className="text-mystery-600">Paranormal</span>
              </h1>
            </div>
            
            {/* Status LIVE */}
            <div className="flex items-center justify-center space-x-4 mb-8">
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
              </div>
              
              {!isLive && nextLiveTime && (
                <div className="flex items-center space-x-2 text-paranormal-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Următorul LIVE în: <strong>{formatTimeUntilLive(nextLiveTime)}</strong>
                  </span>
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
                Introdu codul de acces primit prin email după achiziționare:
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
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-ghost-600" />
                <h2 className="text-2xl font-bold text-paranormal-800">Cumpără acces</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-paranormal-50 rounded-lg">
                  <span className="text-paranormal-700">Acces LIVE Paranormal</span>
                  <span className="text-2xl font-bold text-mystery-600">25 RON</span>
                </div>
                
                <div className="space-y-2 text-sm text-paranormal-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Acces complet la LIVE-ul paranormal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Chat în timp real cu ceilalți exploratori</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Acces la înregistrarea completă 24h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-ghost-500" />
                    <span>Experiență paranormală autentică</span>
                  </div>
                </div>
              </div>
              
              <PaymentForm onPaymentSuccess={(code) => handleAccessCodeSubmit(code)} />
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
                <h4 className="font-semibold text-paranormal-800 mb-2">Program Fix</h4>
                <p className="text-sm text-paranormal-600">
                  LIVE-uri regulate vinerea și sâmbăta seara
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
                </div>
                
                <div className="flex items-center space-x-2 text-paranormal-300">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{viewerCount} exploratori</span>
                </div>
              </div>
              
              <div className="text-ghost-400 text-sm">
                Cod acces: ****{accessCode.slice(-4)}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-black">
            {isLive ? (
              <VideoPlayer 
                playbackId="demo-playback-id" 
                isLive={true}
              />
            ) : (
              <div className="text-center text-white p-12">
                <div className="w-24 h-24 bg-paranormal-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-paranormal-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">LIVE-ul va începe în curând</h3>
                <p className="text-paranormal-300 mb-6">
                  {nextLiveTime && `Următorul LIVE în: ${formatTimeUntilLive(nextLiveTime)}`}
                </p>
                <p className="text-sm text-paranormal-400">
                  Rămâi pe pagină pentru a fi notificat când începe transmisia.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 bg-paranormal-900 border-l border-paranormal-700">
          <ChatComponent 
            isLive={isLive}
            viewerCount={viewerCount}
          />
        </div>
      </div>
    </div>
  )
}

export default LivePage 