'use client'

import React, { useState } from 'react'
import { 
  Play, 
  Square, 
  Users, 
  Key,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminPage() {
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState(120)
  const [error, setError] = useState('')

  const startLiveSession = async () => {
    console.log('🎬 START LIVE SESSION CLICKED!')
    console.log('Location input:', location)
    
    const finalLocation = location.trim() || 'Locație Necunoscută'
    console.log('Final location:', finalLocation)
    
    setIsStartingSession(true)
    setError('')
    console.log('Setting starting session to true...')

    // Test imediat fără setTimeout
    const mockSession = {
      session_id: `live_${Date.now()}`,
      location: finalLocation,
      started_at: new Date().toISOString(),
      viewer_count: 0,
      status: 'active'
    }
    
    console.log('Mock session created:', mockSession)
    
    // Simulează pornirea sesiunii cu delay mai mic
    setTimeout(() => {
      console.log('Setting current session...')
      setCurrentSession(mockSession)
      setLocation('')
      setIsStartingSession(false)
      console.log('✅ Session started successfully!')
    }, 1000) // Redus de la 2000 la 1000ms
  }

  const endLiveSession = () => {
    setCurrentSession(null)
  }

  return (
    <div className="min-h-screen bg-paranormal-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-paranormal-800 mb-2">
            🎃 Admin Dashboard - Plipli9 Paranormal
          </h1>
          <p className="text-paranormal-600">
            Gestionează sesiunile LIVE și monitorizează accesul utilizatorilor
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Live Session Control */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-4 h-4 rounded-full ${currentSession ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <h2 className="text-xl font-bold text-paranormal-800">
                {currentSession ? 'LIVE ACTIV' : 'OFFLINE'}
              </h2>
            </div>

            {currentSession ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">{currentSession.location}</span>
                  </div>
                  <div className="text-sm text-red-700">
                    <div>Început: {new Date(currentSession.started_at).toLocaleTimeString('ro-RO')}</div>
                    <div>Viewers: {currentSession.viewer_count}</div>
                  </div>
                </div>

                <button
                  onClick={endLiveSession}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Square className="w-4 h-4" />
                  <span>Oprește LIVE-ul</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-paranormal-700 mb-2">
                    Locația investigației
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500"
                    placeholder="Ex: Castelul Bran, Camera 13"
                    disabled={isStartingSession}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-paranormal-700 mb-2">
                    Durata estimată (minute)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500"
                    min="30"
                    max="480"
                    disabled={isStartingSession}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={startLiveSession}
                  disabled={isStartingSession}
                  className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  {isStartingSession ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Se pornește LIVE-ul...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Pornește LIVE-ul</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-mystery-600" />
              <h2 className="text-xl font-bold text-paranormal-800">Statistici Coduri</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-800">12</div>
                <div className="text-sm text-green-600">Coduri active</div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">3</div>
                <div className="text-sm text-yellow-600">Expiră în &lt;2h</div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">45</div>
                <div className="text-sm text-gray-600">Coduri expirate</div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">375 RON</div>
                <div className="text-sm text-blue-600">Venituri azi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-paranormal-800 mb-4">
            📱 Instrucțiuni Streaming Mobile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-paranormal-700 mb-2">Aplicații recomandate:</h4>
              <ul className="space-y-2 text-sm text-paranormal-600">
                <li>• Streamlabs Mobile (recomandat)</li>
                <li>• OBS Studio Mobile</li>
                <li>• Prism Live Studio</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-paranormal-700 mb-2">Setări optimale:</h4>
              <ul className="space-y-2 text-sm text-paranormal-600">
                <li>• Rezoluție: 720p (1280x720)</li>
                <li>• Bitrate: 2000 kbps</li>
                <li>• FPS: 30</li>
              </ul>
            </div>
          </div>

          {currentSession && (
            <div className="mt-6 p-4 bg-mystery-50 border border-mystery-200 rounded-lg">
              <h4 className="font-semibold text-mystery-800 mb-2">🔗 Stream Key Info:</h4>
              <div className="bg-white p-2 rounded border text-sm font-mono">
                {currentSession.session_id}
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-paranormal-800 mb-4">
            ⚡ Status Sistem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Database</div>
                <div className="text-xs text-green-600">PlanetScale OK</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Livepeer</div>
                <div className="text-xs text-green-600">Streaming OK</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Make.com</div>
                <div className="text-xs text-green-600">Automation OK</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Email/SMS</div>
                <div className="text-xs text-green-600">Delivery OK</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Dashboard-ul rulează în modul demonstrativ funcțional. 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 