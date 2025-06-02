'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Ghost, Skull, Eye } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salut! Sunt spiritul virtual al lui Plipli9. Te pot ajuta cu întrebări despre LIVE-urile paranormale, evenimente, sau povestiți-mi experiențele voastre mysterioase! 👻',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Răspunsuri paranormale pre-definite
  const paranormalResponses = [
    "Hmm... simt o energie puternică în jurul acestei întrebări... 🔮",
    "Spiritele îmi șoptesc că ar trebui să vezi ultimul nostru LIVE! 👻",
    "Această întrebare mă face să mă gândesc la castelul bântuit din ultima investigație... 🏰",
    "Ai simțit vreodată prezența unei entități? Plipli9 explorează astfel de mistere! 🌙",
    "Pentru întrebări oficiale, scrie-ne la contact@plipli9paranormal.com 📧",
    "Următorul LIVE va fi EPIC! Ești gata pentru o experiență paranormală autentică? ⚡",
    "Știai că unele spirite se manifestă mai tare noaptea? Plipli9 investighează doar atunci! 🌒",
    "Această întrebare îmi dă fiori... exact ca locurile pe care le explorează Plipli9! ❄️"
  ]

  const easterEggResponses = [
    "👻 *susur misterios* Cineva a spus 'Plipli9' de trei ori în oglindă?",
    "🔮 Văd în bila de cristal... multe LIVE-uri paranormale în viitorul tău!",
    "💀 Hmm, oasele de zombi îmi spun să-ți recomand să te abonezi!",
    "👁️ Al treilea ochi îmi spune că ai potențial paranormal... interesant!",
    "🌙 La următoarea lună plină, marile secrete vor fi dezvăluite în LIVE!"
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getRandomResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Easter eggs pentru cuvinte speciale
    if (lowerMessage.includes('fantom') || lowerMessage.includes('ghost')) {
      return easterEggResponses[0]
    }
    if (lowerMessage.includes('viitor') || lowerMessage.includes('prezice')) {
      return easterEggResponses[1]
    }
    if (lowerMessage.includes('moarte') || lowerMessage.includes('zombi')) {
      return easterEggResponses[2]
    }
    if (lowerMessage.includes('pot') || lowerMessage.includes('talent')) {
      return easterEggResponses[3]
    }
    if (lowerMessage.includes('când') || lowerMessage.includes('data')) {
      return easterEggResponses[4]
    }
    
    // FAQ responses
    if (lowerMessage.includes('live') || lowerMessage.includes('pret') || lowerMessage.includes('cost')) {
      return "LIVE-urile paranormale costă 25 RON și durează în medie 2-3 ore. Primești cod de acces după plată! 💳"
    }
    if (lowerMessage.includes('cum') || lowerMessage.includes('access')) {
      return "După plată vei primi automat un cod de acces prin email. Introdu codul pe pagina LIVE! 🔑"
    }
    if (lowerMessage.includes('când') || lowerMessage.includes('program')) {
      return "LIVE-urile se fac de obicei vinerea și sâmbăta seara. Urmărește anunțurile pentru data exactă! 📅"
    }
    if (lowerMessage.includes('locuri') || lowerMessage.includes('unde')) {
      return "Plipli9 explorează castele, cimitire, case abandonate și alte locuri misterioase din România! 🏚️"
    }
    
    // Răspuns random pentru alte întrebări
    return paranormalResponses[Math.floor(Math.random() * paranormalResponses.length)]
  }

  const sendMessage = () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulează răspuns automat după o mică întârziere
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(message),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)

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
                <div className="w-8 h-8 bg-mystery-600 rounded-full flex items-center justify-center">
                  <Ghost className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Spirit Asistent</h3>
                  <p className="text-paranormal-300 text-xs">Online și misterios 👻</p>
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
                  placeholder="Întreabă spiritul..."
                  className="flex-1 px-3 py-2 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="w-10 h-10 bg-mystery-600 text-white rounded-lg hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Trimite mesaj"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ChatWidget 