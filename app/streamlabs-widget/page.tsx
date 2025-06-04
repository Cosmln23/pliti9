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
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  useEffect(() => {
    // Test de conectivitate
    const testConnection = async () => {
      try {
        const response = await fetch('/api/health')
        setConnectionStatus(response.ok ? 'connected' : 'error')
      } catch (error) {
        setConnectionStatus('error')
        console.error('Connection test failed:', error)
      }
    }

    testConnection()

    // Polling pentru mesaje noi
    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=plipli9-paranormal-live&t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.messages && Array.isArray(data.messages)) {
            // Păstrăm doar ultimele 5 mesaje pentru overlay
            setMessages(data.messages.slice(-5))
            setConnectionStatus('connected')
          }
        } else {
          setConnectionStatus('error')
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        setConnectionStatus('error')
      } finally {
        setIsLoading(false)
      }
    }

    // Poll la fiecare 3 secunde (mai conservativ pentru mobile)
    const interval = setInterval(pollMessages, 3000)
    pollMessages() // Initial load

    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return new Date().toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getUsernameColor = (username: string, type: string) => {
    if (type === 'admin') return 'text-purple-300'
    
    // Generate consistent color based on username
    const colors = [
      'text-blue-300', 'text-green-300', 'text-yellow-300', 
      'text-pink-300', 'text-red-300', 'text-indigo-300',
      'text-cyan-300', 'text-emerald-300'
    ]
    const index = username.length % colors.length
    return colors[index]
  }

  // Demo messages pentru test
  const demoMessages = [
    {
      id: 'demo-1',
      username: 'ParanormalFan',
      message: 'Salut PLIPLI9! 👻',
      timestamp: new Date().toISOString(),
      type: 'user' as const
    },
    {
      id: 'demo-2', 
      username: 'PLIPLI9',
      message: 'Bună seara tuturor! Să începem investigația! 🔍',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      type: 'admin' as const
    }
  ]

  // Afișează demo dacă nu sunt mesaje și e loading
  const displayMessages = messages.length > 0 ? messages : (isLoading ? demoMessages : [])

  return (
    <div className="fixed inset-0 w-full h-full p-3 pointer-events-none">
      {/* Connection Status pentru debugging */}
      <div className="fixed top-2 left-2 opacity-50 pointer-events-none">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-500' : 
          connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
      </div>

      {/* Chat Container - Fixed height pentru Streamlabs */}
      <div className="flex flex-col-reverse justify-start h-full max-h-[600px] space-y-reverse space-y-2 overflow-hidden">
        {displayMessages.map((message, index) => (
          <div 
            key={message.id}
            className="animate-in slide-in-from-bottom duration-300 opacity-0"
            style={{ 
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Message Bubble - Mai mic pentru mobile */}
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2.5 border border-purple-400/40 shadow-xl max-w-[350px]">
              <div className="flex items-center space-x-2 mb-1">
                {/* Username cu culoare */}
                <span className={`font-bold text-xs ${getUsernameColor(message.username, message.type)}`}>
                  {message.username}
                  {message.type === 'admin' && ' 👑'}
                </span>
                
                {/* Timestamp */}
                <span className="text-gray-400 text-[10px]">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {/* Message content */}
              <div className="text-white text-sm leading-relaxed break-words">
                {message.message}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state doar dacă nu e loading */}
        {displayMessages.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 opacity-40">
            <div className="bg-black/70 rounded-lg p-3 border border-purple-500/20 max-w-[300px]">
              <p className="text-xs">💬 Așteptăm mesaje...</p>
              <p className="text-[10px] mt-1 opacity-60">Status: {connectionStatus}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* PLIPLI9 Branding - Mai mic */}
      <div className="fixed bottom-3 right-3 opacity-50 pointer-events-none">
        <div className="bg-purple-600/80 backdrop-blur-sm rounded px-2 py-1 border border-purple-400/30">
          <span className="text-white text-[10px] font-semibold">PLIPLI9</span>
        </div>
      </div>
    </div>
  )
}

export default StreamlabsWidget 