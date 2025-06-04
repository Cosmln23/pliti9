'use client'

import React, { useState, useEffect } from 'react'
import { Video, MessageCircle, Users, Clock, Settings, Eye, Send } from 'lucide-react'
import LiveChat from '@/components/LiveChat'

interface StreamStats {
  isLive: boolean
  viewerCount: number
  streamId: string
  duration: string
  chatMessages: number
}

const StreamerDashboard = () => {
  const [stats, setStats] = useState<StreamStats>({
    isLive: false,
    viewerCount: 0,
    streamId: '',
    duration: '00:00:00',
    chatMessages: 0
  })
  const [currentStreamId, setCurrentStreamId] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    // Check if there's an active stream
    const checkStreamStatus = async () => {
      try {
        const response = await fetch('/api/live-sessions/current')
        const data = await response.json()
        
        if (data.success && data.session) {
          setCurrentStreamId(data.session.session_id)
          setIsStreaming(true)
          setStats(prev => ({
            ...prev,
            isLive: true,
            streamId: data.session.session_id,
            viewerCount: data.session.viewer_count || 0
          }))
        }
      } catch (error) {
        console.error('Error checking stream status:', error)
      }
    }

    checkStreamStatus()
    
    // Update stats every 10 seconds
    const interval = setInterval(checkStreamStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const startNewStream = async () => {
    try {
      console.log('🎥 Starting new stream...')
      
      const response = await fetch('/api/live-sessions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: 'Studio PLIPLI9'
        })
      })

      const data = await response.json()
      
      console.log('📦 Stream start response:', data)
      
      if (data.success && data.streamId) {
        setCurrentStreamId(data.streamId)
        setIsStreaming(true)
        setStats(prev => ({
          ...prev,
          isLive: true,
          streamId: data.streamId,
          viewerCount: 0
        }))
        
        // Show success message
        console.log('✅ Stream started successfully!')
        console.log('🔑 Stream Key:', data.streaming?.stream_key)
        console.log('📡 RTMP URL:', data.streaming?.rtmp_url)
        
        alert(`✅ Stream creat cu succes!\n\n🔑 Stream Key: ${data.streaming?.stream_key}\n📡 RTMP: ${data.streaming?.rtmp_url}`)
      } else {
        console.error('❌ Failed to start stream:', data)
        alert('❌ Nu s-a putut începe stream-ul. Încearcă din nou.')
      }
    } catch (error) {
      console.error('❌ Error starting stream:', error)
      alert('❌ Eroare de conexiune. Verifică internetul și încearcă din nou.')
    }
  }

  const endStream = async () => {
    if (!currentStreamId) return

    try {
      const response = await fetch(`/api/live-sessions/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: currentStreamId
        })
      })

      if (response.ok) {
        setIsStreaming(false)
        setCurrentStreamId('')
        setStats(prev => ({
          ...prev,
          isLive: false,
          streamId: '',
          viewerCount: 0
        }))
      }
    } catch (error) {
      console.error('Error ending stream:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="p-6">
        {/* Header */}
        <div className="bg-paranormal-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                🎥 PLIPLI9 Streamer Dashboard
              </h1>
              <p className="text-paranormal-300">
                Control panoul pentru transmisii live paranormale
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stats.isLive 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {stats.isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
              </div>
              
              {!isStreaming ? (
                <button
                  onClick={startNewStream}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Începe Live
                </button>
              ) : (
                <button
                  onClick={endStream}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Oprește Live
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-paranormal-900 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-paranormal-300">Spectatori</p>
                <p className="text-2xl font-bold text-white">{stats.viewerCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-paranormal-900 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-paranormal-300">Mesaje Chat</p>
                <p className="text-2xl font-bold text-white">{stats.chatMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-paranormal-900 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-paranormal-300">Durată Live</p>
                <p className="text-2xl font-bold text-white">{stats.duration}</p>
              </div>
            </div>
          </div>

          <div className="bg-paranormal-900 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Video className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-paranormal-300">Status Stream</p>
                <p className="text-sm font-bold text-white">
                  {stats.isLive ? 'Activ' : 'Inactiv'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stream Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Stream Details */}
            <div className="bg-paranormal-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informații Stream</h2>
              
              {isStreaming ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-paranormal-300 mb-1">Stream ID</label>
                      <input
                        type="text"
                        value={currentStreamId}
                        readOnly
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-paranormal-300 mb-1">RTMP URL</label>
                      <input
                        type="text"
                        value="rtmp://rtmp.livepeer.com/live/"
                        readOnly
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-paranormal-300 mb-1">Stream Key</label>
                    <input
                      type="text"
                      value={currentStreamId ? `${currentStreamId.substring(0, 4)}-${currentStreamId.substring(4, 8)}-${currentStreamId.substring(8, 12)}-${currentStreamId.substring(12, 16)}` : ''}
                      readOnly
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-2">📱 Setări Streamlabs Mobile:</h3>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• URL: rtmp://rtmp.livepeer.com/live/</li>
                      <li>• Stream Key: {currentStreamId ? `${currentStreamId.substring(0, 4)}-****-****-****` : 'Se generează...'}</li>
                      <li>• Rezoluție: 1280x720 (720p)</li>
                      <li>• Bitrate: 2500 kbps</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Nu există stream activ</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Apasă "Începe Live" pentru a genera credentialele de streaming
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-paranormal-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Acțiuni Rapide</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  📱 Ghid Streamlabs
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  💻 Ghid OBS
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  🔧 Test Audio/Video
                </button>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  📊 Statistici Detaliate
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  🚨 Moderare Chat
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  ⚙️ Setări Avansate
                </button>
              </div>
            </div>
          </div>

          {/* Live Chat for Streamer */}
          <div className="lg:col-span-1">
            <div className="bg-paranormal-900 rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Live - Vedere Streamer
              </h2>
              
              {currentStreamId ? (
                <LiveChat 
                  isStreamerView={true}
                  streamId={currentStreamId}
                  viewerCount={stats.viewerCount}
                />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Chat-ul va fi disponibil când începi stream-ul</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamerDashboard 