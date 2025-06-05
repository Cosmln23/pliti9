'use client'

import React, { useState, useEffect } from 'react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const StreamlabsWidget = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Fetch messages every 3 seconds
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&limit=5&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages.slice(-5)) // Show only last 5 messages
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
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
    <div className="fixed inset-0 bg-transparent p-4 font-sans text-white overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-green-400">PLIPLI9 CHAT</span>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
        <span className="text-xs text-gray-400">{messages.length} mesaje</span>
      </div>

      {/* Messages */}
      <div className="space-y-2 max-h-96 overflow-hidden">
        {messages.map((message, index) => (
          <div 
            key={message.id}
            className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 animate-fadeInUp"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                {message.username.slice(0, 2).toUpperCase()}
              </div>
              <span className={`text-sm font-semibold ${
                message.type === 'admin' ? 'text-red-400' : 'text-purple-400'
              }`}>
                {message.username}
                {message.type === 'admin' && ' 👑'}
              </span>
              <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            </div>
            <p className="text-white text-sm pl-8">{message.message}</p>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">👻 Așteptând mesaje...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default StreamlabsWidget 