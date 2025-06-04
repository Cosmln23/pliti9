'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Heart, Skull, Zap, MessageCircle, Users } from 'lucide-react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
  likes?: number
}

interface LiveChatProps {
  isStreamerView?: boolean
  streamId?: string
  viewerCount?: number
}

const LiveChat: React.FC<LiveChatProps> = ({ 
  isStreamerView = false, 
  streamId = 'plipli9-paranormal-live',
  viewerCount = 0 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isUsernameSet, setIsUsernameSet] = useState(isStreamerView)
  const [isConnected, setIsConnected] = useState(true)
  const [showEmojis, setShowEmojis] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollInterval = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Paranormal themed emoticons
  const paranormalEmojis = [
    '👻', '💀', '🔮', '🕯️', '🌙', '⚡', '🦇', '🕷️', 
    '🔱', '💜', '🖤', '☠️', '⚰️', '🌟', '✨', '🌌',
    '🕯️', '🔥', '❄️', '💎', '🗝️', '📿', '🔐', '⚗️'
  ]

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojis(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isStreamerView && !username) {
      const anonymousNames = [
        'Ghost', 'Spirit', 'Shadow', 'Mystery', 'Phantom', 'Seeker', 'Explorer',
        'Hunter', 'Believer', 'Curious', 'Watcher', 'Guest'
      ]
      const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
      const randomNum = Math.floor(Math.random() * 999) + 1
      setUsername(`${randomName}${randomNum}`)
    }
  }, [])

  useEffect(() => {
    if (!streamId || !isUsernameSet) return

    // Start polling for messages
    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=${streamId}&t=${Date.now()}`) // Cache busting for mobile
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            // Filter out temporary optimistic messages when real messages arrive
            setMessages(prevMessages => {
              const realMessages = data.messages
              const tempMessages = prevMessages.filter(m => m.id.startsWith('temp-'))
              
              // Remove temp messages that have been replaced by real ones
              const filteredTempMessages = tempMessages.filter(temp => 
                !realMessages.some((real: ChatMessage) => 
                  real.username === temp.username && 
                  real.message === temp.message &&
                  Math.abs(new Date(real.timestamp).getTime() - new Date(temp.timestamp).getTime()) < 10000
                )
              )
              
              return [...realMessages, ...filteredTempMessages]
            })
            setIsConnected(true)
            
            console.log(`📱 Mobile chat poll: ${data.messages.length} messages loaded`)
          }
        } else {
          console.error('Failed to fetch messages:', response.status)
          setIsConnected(false)
        }
      } catch (error) {
        console.error('❌ Mobile polling error:', error)
        setIsConnected(false)
      }
    }

    // Poll every 3 seconds (reduced from 2 seconds)
    pollInterval.current = setInterval(pollMessages, 3000)
    pollMessages() // Initial load

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
    }
  }, [streamId, isUsernameSet])

  const sendMessage = async () => {
    if (!newMessage.trim() || !streamId || isSending) return

    setIsSending(true)
    const messageToSend = newMessage.trim()
    
    // Optimistically add message to UI (mobile improvement)
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      username,
      message: messageToSend,
      timestamp: new Date().toISOString(),
      type: isStreamerView ? 'admin' : 'user',
      likes: 0
    }
    
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          streamId,
          username,
          message: messageToSend,
          isStreamer: isStreamerView
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message')
      }

      console.log('✅ Message sent successfully on mobile:', result)
      setIsConnected(true)
      
    } catch (error) {
      console.error('❌ Mobile chat error:', error)
      setIsConnected(false)
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
      setNewMessage(messageToSend) // Restore message
      
      // Show user-friendly error
      alert('Mesajul nu a putut fi trimis. Verifică conexiunea și încearcă din nou.')
    } finally {
      setIsSending(false)
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

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'admin': return 'text-red-400'
      case 'system': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  if (!isUsernameSet && !isStreamerView) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-4">Alătură-te conversației</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Numele tău (opțional)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              maxLength={20}
            />
            <button
              onClick={() => setIsUsernameSet(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Intră în Chat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="border-b border-gray-800 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Chat Live</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Users className="w-4 h-4" />
            <span>{viewerCount} spectatori</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {message.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-purple-400 font-semibold text-sm">{message.username}</span>
                  <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-white text-sm break-words">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Fii primul care scrie în chat!</p>
            <p className="text-xs text-gray-500 mt-1">Folosește emoji-urile paranormale 👻</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-3">
        {/* Emoji Selector */}
        {showEmojis && (
          <div className="mb-3 p-2 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Emoji paranormale:</div>
            <div className="grid grid-cols-8 gap-1">
              {paranormalEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="text-lg hover:bg-gray-700 rounded p-1 transition-colors"
                  title={`Adaugă ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors flex-shrink-0"
            title="Emoji paranormale"
          >
            👻
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrie un mesaj..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              maxLength={200}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {newMessage.length}/200
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0 touch-manipulation"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          {isConnected ? 'Conectat' : 'Deconectat'} • Mesajele sunt live pentru toți spectatorii
        </div>
      </div>
    </div>
  )
}

export default LiveChat 