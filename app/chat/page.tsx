'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// PLIPLI9 Chat Page - Ver 1.1
interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Încarcă username din localStorage
    const savedUsername = localStorage.getItem('plipli9-username')
    if (savedUsername) {
      setUsername(savedUsername)
    }

    // Încarcă mesajele existente
    fetchMessages()

    // Polling pentru mesaje noi
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        if (data.messages) {
          setMessages(data.messages)
          setIsConnected(true)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setIsConnected(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !username.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamId: 'plipli9-paranormal-live',
          username: username.trim(),
          message: newMessage.trim(),
          type: 'user'
        }),
      })

      if (response.ok) {
        setNewMessage('')
        // Salvează username pentru următoarele mesaje
        localStorage.setItem('plipli9-username', username.trim())
        // Refresh mesajele imediat
        fetchMessages()
      } else {
        alert('Eroare la trimiterea mesajului!')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Eroare la trimiterea mesajului!')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUsernameColor = (username: string, type: string) => {
    if (type === 'admin') return 'text-purple-400'
    
    const colors = [
      'text-blue-400', 'text-green-400', 'text-yellow-400', 
      'text-pink-400', 'text-red-400', 'text-indigo-400',
      'text-cyan-400', 'text-emerald-400'
    ]
    const index = username.length % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-400">💬 PLIPLI9 Chat LIVE</h1>
            <p className="text-gray-400 text-sm">
              Mesajele tale vor apărea în stream! {isConnected ? '🟢 Conectat' : '🔴 Deconectat'}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            ← Înapoi
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Chat Messages */}
        <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-purple-500/30">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">👻 Aici vor apărea mesajele</p>
              <p className="text-sm">Scrie primul mesaj pentru PLIPLI9!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="bg-black/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-bold text-sm ${getUsernameColor(message.username, message.type)}`}>
                      {message.username}
                      {message.type === 'admin' && ' 👑'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-white">{message.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/30">
          <div className="space-y-3">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Numele tău:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Scrie numele tău..."
                className="w-full bg-black border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                maxLength={20}
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mesajul tău:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrie mesajul pentru PLIPLI9..."
                  className="flex-1 bg-black border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  maxLength={200}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim() || !username.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? '📤' : '💬 Trimite'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Apasă Enter pentru a trimite • Max 200 caractere
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">📺 Cum funcționează?</h3>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• Mesajele tale vor apărea în timpul stream-ului LIVE</li>
            <li>• Folosește un nume recognoscibil pentru PLIPLI9</li>
            <li>• Respectă regulile comunității paranormale</li>
            <li>• Chat-ul se sincronizează automat cu stream-ul</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChatPage 