'use client'

import React, { useState, useEffect } from 'react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
}

const OverlayPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 10, y: 100 })

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages.slice(-3)) // Doar 3 mesaje pentru a nu încurca
            setIsConnected(true)
          }
        }
      } catch (error) {
        setIsConnected(false)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 2000) // Update mai rapid
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isMinimized) {
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute pointer-events-auto cursor-pointer"
          style={{ left: position.x, top: position.y }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="bg-black/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-purple-500/50">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-white text-xs font-bold">{messages.length}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Draggable chat window */}
      <div 
        className="absolute pointer-events-auto"
        style={{ left: position.x, top: position.y }}
      >
        <div className="bg-black/85 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-2xl max-w-xs">
          {/* Header bar */}
          <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-white text-xs font-bold">PLIPLI9 CHAT</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/70 hover:text-white text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
                title="Minimizează"
              >
                −
              </button>
              <button
                onClick={() => window.close()}
                className="text-white/70 hover:text-red-400 text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
                title="Închide"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-3 max-h-60 overflow-hidden">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                <span className="text-xs">👻 Fără mesaje</span>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="flex items-center space-x-1 mb-1">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">
                            {message.username.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${
                          message.type === 'admin' ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {message.username}
                          {message.type === 'admin' && ' 👑'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-white text-xs leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-purple-500/20">
            <div className="text-center text-[10px] text-purple-300">
              👻 {messages.length} mesaje LIVE • Update la 2s
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default OverlayPage 