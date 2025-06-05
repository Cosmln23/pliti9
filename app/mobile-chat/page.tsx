'use client'

import React, { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const MobileChatOverlay = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&limit=10&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages.slice(-5)) // Doar ultimele 5 pentru mobile
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        setIsConnected(false)
      }
    }

    // Fetch imediat și apoi la fiecare 3 secunde
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll la mesaje noi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!showOverlay) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowOverlay(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
        >
          💬
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-full px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-white text-xs">{messages.length}</span>
          <button
            onClick={() => setShowOverlay(false)}
            className="text-white/70 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages overlay - style TikTok/YouTube */}
      <div className="absolute bottom-20 left-4 right-4 pointer-events-none">
        <div className="max-h-80 overflow-hidden">
          {messages.length > 0 && (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className="animate-slideInUp opacity-95"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '0.5s'
                  }}
                >
                  <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-2 max-w-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {message.username.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        message.type === 'admin' ? 'text-yellow-400' : 'text-white'
                      }`}>
                        {message.username}
                        {message.type === 'admin' && ' 👑'}
                      </span>
                      <span className="text-xs text-gray-300">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Quick stats bar - bottom */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>💬</span>
              <span>{messages.length} mesaje</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'LIVE' : 'Offline'}</span>
            </div>
          </div>
          <div className="text-purple-300">
            PLIPLI9 👻
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default MobileChatOverlay 