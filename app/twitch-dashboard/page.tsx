'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Copy, RefreshCw, MessageCircle, Users, Eye } from 'lucide-react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const TwitchDashboard = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages)
            setMessageCount(data.messages.length)
            setIsConnected(true)
            setLastUpdate(new Date().toLocaleTimeString('ro-RO'))
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        setIsConnected(false)
      }
    }

    // Fetch imediat și apoi la fiecare 2 secunde
    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Feedback visual
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      const originalText = button.textContent
      button.textContent = '✅ Copiat!'
      setTimeout(() => {
        if (button.textContent === '✅ Copiat!') {
          button.textContent = originalText
        }
      }, 2000)
    }
  }

  const copyAllMessages = () => {
    const allText = messages.map(msg => 
      `[${formatTime(msg.timestamp)}] ${msg.username}: ${msg.message}`
    ).join('\n')
    copyToClipboard(allText)
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-900/50 border-red-500/50 text-red-200'
      case 'system': return 'bg-yellow-900/50 border-yellow-500/50 text-yellow-200'
      default: return 'bg-gray-900/50 border-gray-600/50 text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-purple-400" />
              <span>PLIPLI9 - Dashboard Chat LIVE</span>
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              Mesajele de pe site vor apărea aici în timp real
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm">{isConnected ? 'Conectat' : 'Deconectat'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{messageCount} mesaje</span>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-1">
              Ultimul update: {lastUpdate}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={copyAllMessages}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copiază toate pentru Twitch</span>
            </button>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-scroll</span>
            </label>
          </div>
          
          <div className="text-sm text-gray-400">
            💡 Tip: Copiază mesajele și paste în Twitch chat
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-900 rounded-lg h-96 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">👻 Așteptând mesaje de pe site...</p>
            <p className="text-sm">Spectatorii pot scrie pe /chat</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-lg p-3 ${getMessageTypeColor(message.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {message.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-purple-300">
                      {message.username}
                      {message.type === 'admin' && ' 👑'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(`[SITE] ${message.username}: ${message.message}`)}
                    className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
                    title="Copiază pentru Twitch"
                  >
                    📋 Copy
                  </button>
                </div>
                
                <p className="text-white pl-10">{message.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 bg-indigo-900/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">🎬 Pentru Twitch Live:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-indigo-200 mb-1">• Spectatorii scriu pe: <code>plipli9.com/chat</code></p>
            <p className="text-indigo-200 mb-1">• Mesajele apar aici automat</p>
            <p className="text-indigo-200">• Copiază și paste în Twitch chat</p>
          </div>
          <div>
            <p className="text-indigo-200 mb-1">• Update automat la 2 secunde</p>
            <p className="text-indigo-200 mb-1">• Click "Copy" pentru mesaje individuale</p>
            <p className="text-indigo-200">• "Copiază toate" pentru batch</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwitchDashboard 