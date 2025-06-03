'use client'

import React, { useState } from 'react'
import { CreditCard, Lock, Loader, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'

interface PaymentFormProps {
  onPaymentSuccess: (accessCode: string) => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email-ul este obligatoriu pentru codul de acces'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid'
    }

    // Phone number validation (optional but recommended)
    if (formData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Numărul de telefon nu este valid (format: +40123456789)'
    }

    // Card validation for Stripe
    if (paymentMethod === 'stripe') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Numărul cardului este obligatoriu'
      } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Numărul cardului trebuie să aibă 16 cifre'
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Data de expirare este obligatorie'
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Format invalid (MM/YY)'
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV-ul este obligatoriu'
      } else if (formData.cvv.length !== 3) {
        newErrors.cvv = 'CVV-ul trebuie să aibă 3 cifre'
      }

      if (!formData.cardholderName) {
        newErrors.cardholderName = 'Numele de pe card este obligatoriu'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      // Simulează delay pentru plată
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generează payment intent ID simulat
      const simulatedPaymentIntentId = `pi_${Math.random().toString(36).substr(2, 12)}`
      
      // Apelează API-ul nostru pentru crearea codului de acces
      const response = await fetch('/api/access-codes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone_number.trim() || undefined,
          amount: 25.00,
          paymentMethod,
          paymentIntentId: simulatedPaymentIntentId,
          sessionId: `session_${Date.now()}`
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.accessCode) {
        setSuccess(true)
        
        // Trigger success callback cu codul de acces generat
        setTimeout(() => {
          onPaymentSuccess(data.data.accessCode)
        }, 1500) // Delay pentru a arăta success message

        console.log('Payment processed successfully:', {
          accessCode: data.data.accessCode,
          email: data.data.email,
          expiresAt: data.data.expiresAt
        })
      } else {
        throw new Error(data.message || data.error || 'Eroare la procesarea plății')
      }

    } catch (error) {
      console.error('Payment failed:', error)
      setErrors({ 
        general: error instanceof Error ? error.message : 'Eroare la procesarea plății. Încearcă din nou.' 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits except +
    const cleaned = value.replace(/[^\d+]/g, '')
    return cleaned.slice(0, 15) // Max international phone length
  }

  // Success state
  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Plată procesată cu succes!</h3>
        <p className="text-green-700 mb-4">
          Codul de acces va fi trimis prin email și WhatsApp în maximum 2 minute.
        </p>
        <div className="inline-flex items-center space-x-2 text-sm text-green-600 bg-green-100 px-4 py-2 rounded-lg">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Se generează codul de acces...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-payment-section>
      
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <h4 className="font-semibold text-paranormal-800">Metoda de plată</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              paymentMethod === 'stripe'
                ? 'border-mystery-600 bg-mystery-50 text-mystery-700'
                : 'border-paranormal-300 text-paranormal-600 hover:border-paranormal-400'
            }`}
            disabled={isProcessing}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-1" />
            Card Bancar
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              paymentMethod === 'paypal'
                ? 'border-mystery-600 bg-mystery-50 text-mystery-700'
                : 'border-paranormal-300 text-paranormal-600 hover:border-paranormal-400'
            }`}
            disabled={isProcessing}
          >
            <div className="w-4 h-4 mx-auto mb-1 bg-blue-600 rounded"></div>
            PayPal
          </button>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errors.general}</span>
          </div>
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email - Required */}
        <div>
          <label className="block text-sm font-medium text-paranormal-700 mb-2">
            Email pentru cod de acces *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
              errors.email ? 'border-red-300' : 'border-paranormal-300'
            }`}
            placeholder="email@exemplu.com"
            disabled={isProcessing}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-paranormal-500">
            Codul de acces va fi trimis la acest email
          </p>
        </div>

        {/* Phone Number - Optional but recommended */}
        <div>
          <label className="block text-sm font-medium text-paranormal-700 mb-2">
            WhatsApp (opțional, recomandat)
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: formatPhoneNumber(e.target.value)})}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
              errors.phone_number ? 'border-red-300' : 'border-paranormal-300'
            }`}
            placeholder="+40712345678"
            disabled={isProcessing}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
          )}
          <div className="mt-1 flex items-center space-x-1 text-xs text-green-600">
            <Smartphone className="w-3 h-3" />
            <span>Primești codul și pe WhatsApp pentru siguranță</span>
          </div>
        </div>

        {/* Stripe Payment Fields */}
        {paymentMethod === 'stripe' && (
          <>
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-paranormal-700 mb-2">
                Numărul cardului
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 font-mono ${
                  errors.cardNumber ? 'border-red-300' : 'border-paranormal-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                disabled={isProcessing}
                required
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-paranormal-700 mb-2">
                  Data expirării
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 font-mono ${
                    errors.expiryDate ? 'border-red-300' : 'border-paranormal-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                  disabled={isProcessing}
                  required
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium text-paranormal-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 font-mono ${
                    errors.cvv ? 'border-red-300' : 'border-paranormal-300'
                  }`}
                  placeholder="123"
                  maxLength={3}
                  disabled={isProcessing}
                  required
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-paranormal-700 mb-2">
                Numele de pe card
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
                  errors.cardholderName ? 'border-red-300' : 'border-paranormal-300'
                }`}
                placeholder="JOHN SMITH"
                disabled={isProcessing}
                required
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
              )}
            </div>
          </>
        )}

        {/* PayPal Notice */}
        {paymentMethod === 'paypal' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Vei fi redirecționat către PayPal pentru a finaliza plata în siguranță.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-ghost-600 hover:bg-ghost-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Se procesează plata...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Plătește 25 RON - Acces 8h</span>
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-paranormal-500">
            🔒 Plată securizată • Datele cardului sunt protejate • Fără taxe ascunse
          </p>
        </div>
      </form>

      {/* Auto-delivery info */}
      <div className="p-4 bg-mystery-50 border border-mystery-200 rounded-lg">
        <h4 className="font-semibold text-mystery-800 mb-2">📧 Livrare Automată</h4>
        <ul className="text-sm text-mystery-700 space-y-1">
          <li>• Codul de acces se trimite automat în 1-2 minute</li>
          <li>• Primești pe email și WhatsApp (dacă ai completat)</li>
          <li>• Verifică și folderul de spam</li>
          <li>• Acces valid 8 ore de la prima utilizare</li>
        </ul>
      </div>
    </div>
  )
}

export default PaymentForm 