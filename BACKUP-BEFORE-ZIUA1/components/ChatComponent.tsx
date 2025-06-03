'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Users, MessageCircle, Ghost, Skull, Eye, Heart } from 'lucide-react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  isSystem?: boolean
  isModerator?: boolean
}

interface ChatComponentProps {
  isLive: boolean
  viewerCount: number
}

const ChatComponent: React.FC<ChatComponentProps> = ({ isLive, viewerCount }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'Plipli9',
      message: 'Bună seara, exploratori paranormali! 👻',
      timestamp: new Date(),
      isModerator: true
    },
    {
      id: '2',
      username: 'System',
      message: 'LIVE-ul paranormal a început! Pregătiți-vă pentru o experiență de neuitat.',
      timestamp: new Date(),
      isSystem: true
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [hasSetUsername, setHasSetUsername] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulează mesaje live random
  useEffect(() => {
    if (!isLive) return

    const messageTemplates = [
      'Se simte o energie străină aici... 😰',
      'Au auzit asta?! Ce a fost sunetul ăla?',
      'Termometrul arată 5 grade mai puțin dintr-odată!',
      'Plipli9, în spatele tău! 👻',
      'EMF-ul sare ca nebunul!',
      'Spiritele sunt active în seara asta',
      'Ce investigație incredibilă! 🔥',
      'Nu pot să cred ce văd...',
      'Telefonul îmi face probleme de când ai intrat în camera aia',
      'Cineva altcineva simte frigul ăsta?'
    ]

    const usernames = [
      'GhostHunter23', 'ParanormalFan', 'SpiritSeeker', 'MysteryLover', 
      'DarkExplorer', 'SupernaturalBelieve', 'NightWatcher', 'EntityHunter'
    ]

    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance pentru mesaj
        const randomMessage = messageTemplates[Math.floor(Math.random() * messageTemplates.length)]
        const randomUsername = usernames[Math.floor(Math.random() * usernames.length)]
        
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          username: randomUsername,
          message: randomMessage,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev.slice(-19), newMsg]) // Păstrează ultimele 20 mesaje
      }
    }, 8000 + Math.random() * 12000) // Entre 8-20 secunde

    return () => clearInterval(interval)
  }, [isLive])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    if (!hasSetUsername) {
      if (!username.trim()) return
      setHasSetUsername(true)
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: hasSetUsername ? username : 'Anonim',
      message: newMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getUserIcon = (msg: ChatMessage) => {
    if (msg.isSystem) return <MessageCircle className="w-4 h-4 text-blue-500" />
    if (msg.isModerator) return <Ghost className="w-4 h-4 text-mystery-500" />
    return <Users className="w-4 h-4 text-paranormal-400" />
  }

  return (
    <div className="h-full flex flex-col bg-paranormal-900">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-paranormal-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Chat Paranormal</span>
          </h3>
          <div className="flex items-center space-x-2 text-paranormal-300">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm">{isLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
        
        {/* Viewer Count */}
        <div className="flex items-center space-x-2 mt-2">
          <Users className="w-4 h-4 text-paranormal-400" />
          <span className="text-sm text-paranormal-300">{viewerCount} exploratori online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-1">
                {getUserIcon(msg)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    msg.isSystem 
                      ? 'text-blue-400'
                      : msg.isModerator 
                      ? 'text-mystery-400' 
                      : 'text-paranormal-200'
                  }`}>
                    {msg.username}
                  </span>
                  {msg.isModerator && (
                    <span className="px-1 py-0.5 bg-mystery-600 text-white text-xs rounded">
                      MOD
                    </span>
                  )}
                  <span className="text-xs text-paranormal-500">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className={`text-sm mt-1 break-words ${
                  msg.isSystem ? 'text-blue-300 italic' : 'text-white'
                }`}>
                  {msg.message}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-paranormal-700">
        {!hasSetUsername ? (
          /* Username Setup */
          <form onSubmit={(e) => {
            e.preventDefault()
            if (username.trim()) setHasSetUsername(true)
          }} className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introdu numele tău..."
              className="w-full px-3 py-2 bg-paranormal-800 border border-paranormal-600 rounded-lg text-white placeholder-paranormal-400 focus:outline-none focus:ring-2 focus:ring-mystery-500 text-sm"
              maxLength={20}
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Alătură-te chat-ului
            </button>
          </form>
        ) : (
          /* Message Input */
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isLive ? "Scrie un mesaj..." : "Chat-ul este offline"}
              disabled={!isLive}
              className="flex-1 px-3 py-2 bg-paranormal-800 border border-paranormal-600 rounded-lg text-white placeholder-paranormal-400 focus:outline-none focus:ring-2 focus:ring-mystery-500 text-sm disabled:opacity-50"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isLive}
              className="bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Chat Rules */}
        <div className="mt-3 text-xs text-paranormal-500">
          <p>💀 Respectă regulile: fii politicos și păstrează atmosfera paranormală!</p>
        </div>
      </div>

      {/* Quick Reactions */}
      {isLive && hasSetUsername && (
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            {['👻', '😱', '🔥', '❄️', '⚡'].map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  const reactionMsg: ChatMessage = {
                    id: Date.now().toString() + index,
                    username: username,
                    message: emoji,
                    timestamp: new Date()
                  }
                  setMessages(prev => [...prev, reactionMsg])
                }}
                className="w-8 h-8 bg-paranormal-800 hover:bg-paranormal-700 rounded-lg flex items-center justify-center text-sm transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatComponent 