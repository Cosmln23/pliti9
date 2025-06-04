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

  useEffect(() => {
    // Polling pentru mesaje noi
    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            // Păstrăm doar ultimele 5 mesaje pentru overlay
            setMessages(data.messages.slice(-5))
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    // Poll la fiecare 2 secunde
    const interval = setInterval(pollMessages, 2000)
    pollMessages() // Initial load

    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUsernameColor = (username: string, type: string) => {
    if (type === 'admin') return 'text-purple-400'
    
    // Generate consistent color based on username
    const colors = [
      'text-blue-400', 'text-green-400', 'text-yellow-400', 
      'text-pink-400', 'text-red-400', 'text-indigo-400',
      'text-cyan-400', 'text-emerald-400'
    ]
    const index = username.length % colors.length
    return colors[index]
  }

  return (
    <div className="w-full h-screen p-4 overflow-hidden">
      {/* Chat Container */}
      <div className="flex flex-col-reverse h-full space-y-reverse space-y-3">
        {messages.map((message, index) => (
          <div 
            key={message.id}
            className="animate-in slide-in-from-bottom duration-500"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            {/* Message Bubble */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-lg">
              <div className="flex items-center space-x-2 mb-1">
                {/* Username cu culoare */}
                <span className={`font-bold text-sm ${getUsernameColor(message.username, message.type)}`}>
                  {message.username}
                  {message.type === 'admin' && ' 👑'}
                </span>
                
                {/* Timestamp */}
                <span className="text-gray-400 text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {/* Message content */}
              <div className="text-white text-base leading-relaxed">
                {message.message}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center text-gray-400 opacity-50">
            <div className="bg-black/60 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm">💬 Chat-ul va apărea aici...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* PLIPLI9 Branding */}
      <div className="fixed bottom-4 right-4 opacity-60">
        <div className="bg-purple-600/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-purple-400/30">
          <span className="text-white text-xs font-semibold">PLIPLI9 PARANORMAL</span>
        </div>
      </div>
    </div>
  )
}

export default StreamlabsWidget 