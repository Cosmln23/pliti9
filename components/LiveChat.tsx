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
  isMobileOverlay?: boolean
  onTypingChange?: (isTyping: boolean) => void
}

const LiveChat: React.FC<LiveChatProps> = ({ 
  isStreamerView = false, 
  streamId = 'plipli9-paranormal-live',
  viewerCount = 0,
  isMobileOverlay = false,
  onTypingChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isUsernameSet, setIsUsernameSet] = useState(isStreamerView)
  const [isConnected, setIsConnected] = useState(true)
  const [showEmojis, setShowEmojis] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showTwitchBridge, setShowTwitchBridge] = useState(false)
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

    let currentPollInterval = 3000; // Start with 3 seconds
    let lastMessageCount = 0;
    let inactivityCounter = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    // Start polling for messages with smart interval adjustment
    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?streamId=${streamId}&t=${Date.now()}`) // Cache busting for mobile
        if (response.ok) {
          const data = await response.json()
          if (data.messages) {
            // Smart polling: adjust interval based on activity
            if (data.messages.length > lastMessageCount) {
              // New messages - increase frequency
              currentPollInterval = Math.max(2000, currentPollInterval - 500);
              inactivityCounter = 0;
            } else {
              // No new messages - decrease frequency gradually
              inactivityCounter++;
              if (inactivityCounter > 3) {
                currentPollInterval = Math.min(10000, currentPollInterval + 1000); // Max 10s
              }
            }
            lastMessageCount = data.messages.length;

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
            
            console.log(`📱 Smart chat poll: ${data.messages.length} messages (interval: ${currentPollInterval}ms)`)
          }
        } else {
          console.error('Failed to fetch messages:', response.status)
          setIsConnected(false)
          currentPollInterval = Math.min(8000, currentPollInterval + 1000); // Slow down on errors
        }
      } catch (error) {
        console.error('❌ Mobile polling error:', error)
        setIsConnected(false)
        currentPollInterval = Math.min(8000, currentPollInterval + 1000); // Slow down on errors
      }
    }

    const scheduleNextPoll = () => {
      timeoutId = setTimeout(() => {
        pollMessages().then(scheduleNextPoll);
      }, currentPollInterval);
    };

    pollMessages().then(scheduleNextPoll); // Initial load

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
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

  const handleSendClick = () => {
    // Force focus away from input to prevent mobile keyboard issues
    if (inputRef.current) {
      inputRef.current.blur()
    }
    sendMessage()
  }

  // Handle typing change for mobile overlay
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    onTypingChange?.(e.target.value.length > 0)
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
            {isStreamerView && (
              <button
                onClick={() => setShowTwitchBridge(!showTwitchBridge)}
                className="ml-2 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                title="Toggle Twitch Bridge"
              >
                🎮 Twitch
              </button>
            )}
          </div>
        </div>
        
        {/* Twitch Bridge for Streamers */}
        {showTwitchBridge && isStreamerView && (
          <div className="mt-3 p-3 bg-purple-900/30 border border-purple-600/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-purple-400 text-xs font-semibold">🎮 BRIDGE pentru Streamlabs/OBS</span>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto text-xs">
              {messages.slice(-3).map((msg) => (
                <div key={msg.id} className="flex items-center space-x-2">
                  <span className="text-purple-300">{msg.username}:</span>
                  <span className="text-white flex-1">{msg.message}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${msg.username}: ${msg.message}`)
                      // Show success feedback
                      const button = document.activeElement as HTMLButtonElement
                      if (button) {
                        button.textContent = '✅'
                        setTimeout(() => {
                          button.textContent = '📋'
                        }, 1000)
                      }
                    }}
                    className="text-purple-400 hover:text-purple-300 text-xs px-1"
                    title="Copy pentru Streamlabs"
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-purple-300">
              💡 Mesajele se copiază automat - paste în Streamlabs pentru a le vedea în live
            </div>
          </div>
        )}
      </div>

      {/* Messages Area - Twitch Style */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className="group hover:bg-gray-800/30 px-2 py-1 rounded text-sm leading-tight">
            <div className="flex items-baseline space-x-1">
              {/* Twitch-style badges for special users */}
              {message.username.includes('👾') && (
                <span className="text-purple-400 text-xs">🎮</span>
              )}
              {message.type === 'admin' && (
                <span className="bg-red-600 text-white text-xs px-1 rounded">ADMIN</span>
              )}
              
              {/* Username with color coding like Twitch */}
              <span className={`font-bold text-sm ${
                message.username.includes('👾') ? 'text-purple-300' :
                message.type === 'admin' ? 'text-red-400' :
                message.type === 'system' ? 'text-yellow-400' :
                `text-${['blue', 'green', 'yellow', 'pink', 'purple', 'indigo', 'red', 'orange'][
                  message.username.charCodeAt(0) % 8
                ]}-400`
              }`}>
                {message.username.replace('👾 ', '')}:
              </span>
              
              {/* Message content */}
              <span className="text-white break-words flex-1">
                {message.message}
              </span>
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
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Scrie un mesaj..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-base"
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
              maxLength={200}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {newMessage.length}/200
            </div>
          </div>
          
          <button
            onClick={handleSendClick}
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
        
        <div className="mt-1 text-xs text-gray-600 text-center">
          ⚠️ Anti-spam: max 4 caractere identice, 3s cooldown
        </div>
      </div>
    </div>
  )
}

export default LiveChat 