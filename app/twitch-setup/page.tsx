'use client'

import React, { useState, useEffect } from 'react'

const TwitchSetupPage = () => {
  const [botUsername, setBotUsername] = useState('')
  const [oauth, setOauth] = useState('')
  const [channel, setChannel] = useState('')
  const [status, setStatus] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    // Check current status from server
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/twitch/configure')
        if (response.ok) {
          const data = await response.json()
          setStatus(data.status)
          
          if (data.status.configured) {
            setBotUsername(data.status.botUsername || '')
            setChannel(data.status.channel || '')
          }
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }
    
    fetchStatus()
  }, [])

  const handleConfigure = async () => {
    if (!botUsername || !oauth || !channel) {
      alert('❌ Completează toate câmpurile!')
      return
    }

    setIsConnecting(true)
    
    try {
      // Configure the server bot via API
      const response = await fetch('/api/twitch/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botUsername,
          oauth,
          channel
        })
      })

      const data = await response.json()
      
      if (data.success && data.connected) {
        setStatus(data.status)
        alert('✅ Bot-ul Twitch a fost configurat și conectat pe server!')
      } else {
        alert('❌ Conectarea a eșuat. Verifică credențialele.')
        console.error('Configuration failed:', data)
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert('❌ Eroare la configurare: ' + error)
    }
    
    setIsConnecting(false)
  }

  const handleTestMessage = async () => {
    if (!testMessage) return
    
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          streamId: 'plipli9-paranormal-live',
          username: 'TEST_USER',
          message: testMessage,
          isStreamer: false
        })
      })

      const data = await response.json()
      
      if (data.success && data.twitchForwarded) {
        alert('✅ Mesaj trimis în Twitch!')
        setTestMessage('')
      } else {
        alert('❌ Nu s-a putut trimite mesajul în Twitch')
      }
    } catch (error) {
      alert('❌ Eroare la trimitere: ' + error)
    }
  }

  const handleDisconnect = async () => {
    // For now, just refresh status since disconnect would need another API endpoint
    try {
      const response = await fetch('/api/twitch/configure')
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to refresh status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🎮 <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Twitch Bot Setup
              </span>
            </h1>
            <p className="text-gray-300">
              Conectează chat-ul site-ului direct la Twitch IRC
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              📊 Status Bot
              <div className={`ml-auto w-3 h-3 rounded-full ${status?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Configurat:</span>
                <span className={`ml-2 ${status?.configured ? 'text-green-400' : 'text-red-400'}`}>
                  {status?.configured ? '✅ Da' : '❌ Nu'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Conectat:</span>
                <span className={`ml-2 ${status?.connected ? 'text-green-400' : 'text-red-400'}`}>
                  {status?.connected ? '✅ Da' : '❌ Nu'}
                </span>
              </div>
              {status?.channel && (
                <div className="col-span-2">
                  <span className="text-gray-400">Channel:</span>
                  <span className="ml-2 text-purple-300">#{status.channel}</span>
                </div>
              )}
            </div>
          </div>

          {/* OAuth Guide */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-6 border border-purple-500/10">
            <h3 className="text-lg font-bold mb-3 text-yellow-400">⚠️ Înainte să continui:</h3>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Creează aplicația</strong>: <a href="https://dev.twitch.tv/console/apps" target="_blank" className="text-blue-400 underline">dev.twitch.tv/console/apps</a></p>
              <p>2. <strong>Generează token</strong>: <a href="https://twitchtokengenerator.com/" target="_blank" className="text-blue-400 underline">twitchtokengenerator.com</a></p>
              <p>3. <strong>Alege "Bot Chat Token"</strong> și copiază token-ul</p>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4">🔧 Configurare Bot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bot Username</label>
                <input
                  type="text"
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  placeholder="ex: plipli9_bot"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OAuth Token</label>
                <input
                  type="password"
                  value={oauth}
                  onChange={(e) => setOauth(e.target.value)}
                  placeholder="oauth:xxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitch Channel</label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="ex: plipli9"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleConfigure}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {isConnecting ? '🔄 Conectez...' : '✅ Configurează și Conectează'}
              </button>
            </div>
          </div>

          {/* Test Section */}
          {status?.connected && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-green-500/20">
              <h3 className="text-xl font-bold mb-4 text-green-400">🧪 Test Mesaj</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Scrie un mesaj de test..."
                  className="flex-1 bg-white/5 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleTestMessage()}
                />
                <button
                  onClick={handleTestMessage}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  📤 Trimite
                </button>
              </div>
              
              <p className="text-sm text-green-300 mt-2">
                Mesajul va apărea în chatul Twitch ca: [SITE] TEST_USER: mesajul tău
              </p>
            </div>
          )}

          {/* Controls */}
          {status?.connected && (
            <div className="flex justify-center">
              <button
                onClick={handleDisconnect}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
              >
                🔌 Deconectează Bot
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-500/10 mt-6">
            <h3 className="text-lg font-bold mb-3">🎯 Cum funcționează:</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1. Spectatorii scriu pe <strong>plipli9.com/chat</strong></p>
              <p>2. Mesajele apar <strong>automat în Twitch chat</strong></p>
              <p>3. Tu vezi mesajele în <strong>aplicația Twitch</strong> pe telefon</p>
              <p>4. <strong>Nu mai trebuie overlay!</strong> Chat direct în Twitch!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwitchSetupPage 