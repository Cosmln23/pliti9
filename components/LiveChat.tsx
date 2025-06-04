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
  streamId,
  viewerCount = 0 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(true)
  const [isUsernameSet, setIsUsernameSet] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Generate random anonymous username if not set
    if (!username) {
      const anonymousNames = [
        'Investigator', 'Seeker', 'Observer', 'Witness', 'Explorer',
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
        const response = await fetch(`/api/chat/messages?streamId=${streamId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            setMessages(data.messages)
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error)
        setIsConnected(false)
      }
    }

    // Poll every 2 seconds
    pollInterval.current = setInterval(pollMessages, 2000)
    pollMessages() // Initial load

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
    }
  }, [streamId, isUsernameSet])

  const sendMessage = async () => {
    if (!newMessage.trim() || !streamId) return

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          streamId,
          username,
          message: newMessage.trim(),
          isStreamer: isStreamerView
        })
      })

      if (response.ok) {
        setNewMessage('')
        // Message will appear through polling
      } else {
        console.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
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
    <div className={`bg-gray-900 border border-gray-700 rounded-lg flex flex-col ${
      isStreamerView ? 'h-80' : 'h-96'
    }`}>
      {/* Chat Header */}
      <div className="bg-purple-900/50 p-4 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white">Chat Live</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{viewerCount} spectatori</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Fii primul care comentează!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                <span className={`text-sm font-medium ${getMessageColor(msg.type)}`}>
                  {msg.username}
                  {msg.type === 'admin' && ' 👑'}
                </span>
              </div>
              <p className="text-white text-sm leading-relaxed break-words">
                {msg.message}
              </p>
              {msg.likes && msg.likes > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>{msg.likes}</span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrie un mesaj..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={200}
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{newMessage.length}/200</span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{isConnected ? 'Conectat' : 'Deconectat'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveChat 