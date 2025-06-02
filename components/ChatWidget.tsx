'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Ghost } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isLoading?: boolean
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salut! Sunt spiritul virtual al lui Plipli9! 👻 Te pot ajuta cu întrebări despre LIVE-urile paranormale, evenimente sau orice mistere dorești să discuți! Îndrăznește să întrebi... 🔮',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Adaugă mesaj de loading
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Spiritele îmi șoptesc răspunsul... 👻',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      // Elimină mesajul de loading și adaugă răspunsul real
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: data.message || 'Spiritele sunt prea puternice acum... încearcă din nou! 👻',
          isUser: false,
          timestamp: new Date()
        }]
      })

    } catch (error) {
      console.error('Chat error:', error)
      
      // Elimină mesajul de loading și adaugă mesaj de eroare
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, {
          id: (Date.now() + 3).toString(),
          text: 'Conexiunea cu lumea spiritelor a fost întreruptă... 👻 Încearcă din nou în câteva momente! 🔮',
          isUser: false,
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
    }

    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 left-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="chat-widget w-14 h-14 rounded-full shadow-lg hover:shadow-mystery transition-all duration-300 flex items-center justify-center group animate-bounce-gentle"
            aria-label="Deschide chat paranormal"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-mystery-500 rounded-full flex items-center justify-center">
              <Ghost className="w-2 h-2 text-white" />
            </div>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-widget w-80 h-96 rounded-xl shadow-2xl flex flex-col animate-slide-up">
            {/* Header */}
            <div className="bg-paranormal-800 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-mystery-600 rounded-full flex items-center justify-center mystery-glow">
                  <Ghost className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Spirit Asistent Plipli9</h3>
                  <p className="text-paranormal-300 text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online și misterios 👻
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-paranormal-300 hover:text-white p-1 rounded-lg hover:bg-paranormal-700 transition-colors"
                aria-label="Închide chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-paranormal-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.isUser
                        ? 'bg-mystery-600 text-white rounded-br-none'
                        : msg.isLoading
                        ? 'bg-mystery-100 text-mystery-700 rounded-bl-none shadow-sm italic animate-pulse'
                        : 'bg-white text-paranormal-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white rounded-b-xl border-t border-paranormal-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder={isLoading ? "Spiritele lucrează..." : "Întreabă spiritul Plipli9..."}
                  className="flex-1 px-3 py-2 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className="w-10 h-10 bg-mystery-600 text-white rounded-lg hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Trimite mesaj"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p className="text-xs text-paranormal-500 mt-2 text-center">
                🔮 Conectat la spiritul AI al lui Plipli9
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ChatWidget 