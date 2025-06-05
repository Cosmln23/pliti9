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

    // Validare doar email pentru Stripe Checkout
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Email valid este obligatoriu' })
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      // Creează Stripe Checkout Session
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone_number.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect către Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Eroare la crearea sesiunii de plată')
      }

    } catch (error) {
      console.error('Checkout failed:', error)
      setErrors({ 
        general: error instanceof Error ? error.message : 'Eroare la procesarea plății. Încearcă din nou.' 
      })
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
      
      {/* Payment Method Info */}
      <div className="space-y-3">
        <h4 className="font-semibold text-paranormal-800">Plată cu Card Bancar</h4>
        <div className="flex items-center space-x-3 p-3 bg-white border border-mystery-200 rounded-lg">
          <CreditCard className="w-5 h-5 text-mystery-600" />
          <div>
            <p className="font-medium text-paranormal-800">Stripe Checkout</p>
            <p className="text-sm text-paranormal-600">Visa, Mastercard, American Express</p>
          </div>
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

        {/* Payment Security Info */}
        <div className="bg-mystery-50 border border-mystery-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-mystery-700 mb-2">
            <Lock className="w-4 h-4" />
            <span className="font-medium">Plată 100% Securizată cu Stripe</span>
          </div>
          <p className="text-sm text-mystery-600">
            Vei fi redirecționat către pagina de plată Stripe unde poți introduce datele cardului în siguranță. 
            Nu stocăm informațiile tale financiare.
          </p>
        </div>



        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-ghost-600 hover:bg-ghost-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Se deschide Stripe Checkout...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Plătește 25 RON cu Stripe</span>
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