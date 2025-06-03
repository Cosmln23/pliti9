'use client'

import React, { useState } from 'react'
import { Mail, Bell, CheckCircle, Loader } from 'lucide-react'

interface ComingSoonProps {
  title: string
  subtitle: string
  features: string[]
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, subtitle, features }) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulează subscription
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="space-y-8">
        
        {/* Icon */}
        <div className="w-24 h-24 bg-mystery-600 rounded-full flex items-center justify-center mx-auto mystery-glow">
          <Bell className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-paranormal-800">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-paranormal-600 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-mystery-600 mb-6">
            COMING SOON
          </h2>
          
          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-paranormal-700">
                <CheckCircle className="w-5 h-5 text-ghost-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Newsletter Subscription */}
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <h3 className="text-lg font-semibold text-paranormal-800 mb-4">
                Fii primul care află când se lansează!
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresa ta de email"
                  required
                  className="flex-1 px-4 py-3 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Abonează-te</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Mulțumim! Te vom anunța când se lansează.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComingSoon 