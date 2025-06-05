'use client'

import React, { useState, useEffect } from 'react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const MobilePage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages.slice(-5)) // Ultimele 5 mesaje
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error('Error:', error)
        setIsConnected(false)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-transparent overflow-hidden">
      {/* Status indicator */}
      <div className="absolute top-5 right-5 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-white text-xs font-bold">{messages.length} LIVE</span>
        </div>
      </div>

      {/* Messages overlay - bottom like TikTok */}
      <div className="absolute bottom-16 left-4 right-4 z-40">
        <div className="space-y-2 max-h-80 overflow-hidden">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="transform transition-all duration-500 ease-out"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="bg-black/70 backdrop-blur-md rounded-2xl px-4 py-3 max-w-sm shadow-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
                <p className="text-white text-base leading-relaxed font-medium">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom brand bar */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white text-xs">
            <span>💬</span>
            <span className="font-bold">PLIPLI9 CHAT</span>
          </div>
          <div className="text-purple-300 text-xs font-bold">
            👻 PARANORMAL LIVE
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default MobilePage 