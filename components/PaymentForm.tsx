'use client'

import React, { useState } from 'react'
import { CreditCard, Lock, Loader, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentFormProps {
  onPaymentSuccess: (accessCode: string) => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email-ul este obligatoriu'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid'
    }

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

    try {
      // Simulează procesarea plății
      await new Promise(resolve => setTimeout(resolve, 3000))

      // În aplicația reală, aici ar fi integrarea cu Stripe/PayPal
      if (paymentMethod === 'stripe') {
        // Stripe payment processing
        console.log('Processing Stripe payment...', formData)
      } else {
        // PayPal payment processing
        console.log('Processing PayPal payment...', formData.email)
      }

      // Simulează generarea codului de acces
      const accessCode = `PLI${Date.now().toString().slice(-6)}`
      
      // Simulează trimiterea webhook către Make.com
      await fetch('/api/webhooks/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          accessCode,
          amount: 25.00,
          paymentMethod,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {
        // Silent fail pentru demo
        console.log('Webhook simulation (Make.com integration)')
      })

      // Apelează callback-ul cu codul de acces
      onPaymentSuccess(accessCode)

    } catch (error) {
      console.error('Payment failed:', error)
      setErrors({ general: 'Eroare la procesarea plății. Încearcă din nou.' })
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

  return (
    <div className="space-y-6">
      
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
          >
            <div className="w-4 h-4 mx-auto mb-1 bg-blue-600 rounded"></div>
            PayPal
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-paranormal-700 mb-2">
            Email pentru cod de acces
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
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
                  errors.cardNumber ? 'border-red-300' : 'border-paranormal-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                disabled={isProcessing}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry Date & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-paranormal-700 mb-2">
                  Data expirării
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
                    errors.expiryDate ? 'border-red-300' : 'border-paranormal-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                  disabled={isProcessing}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-paranormal-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 ${
                    errors.cvv ? 'border-red-300' : 'border-paranormal-300'
                  }`}
                  placeholder="123"
                  maxLength={3}
                  disabled={isProcessing}
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
                placeholder="Numele Complet"
                disabled={isProcessing}
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
              )}
            </div>
          </>
        )}

        {/* PayPal Message */}
        {paymentMethod === 'paypal' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Vei fi redirecționat către PayPal pentru a finaliza plata de 25 RON.
            </p>
          </div>
        )}

        {/* General Errors */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-paranormal-50 border border-paranormal-200 rounded-lg">
          <div className="flex items-center space-x-2 text-paranormal-700">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Plata este securizată și criptată. Vei primi codul de acces prin email în câteva minute.</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Se procesează plata...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Plătește 25 RON</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default PaymentForm 