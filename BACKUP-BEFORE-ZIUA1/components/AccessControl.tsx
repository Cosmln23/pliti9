'use client'

import React, { useState } from 'react'
import { Key, Lock, Loader, CheckCircle, AlertCircle, Eye, EyeOff, Info } from 'lucide-react'

interface AccessControlProps {
  onAccessGranted: (code: string) => void
  loading?: boolean
  error?: string
}

const AccessControl: React.FC<AccessControlProps> = ({ 
  onAccessGranted, 
  loading = false, 
  error = '' 
}) => {
  const [accessCode, setAccessCode] = useState('')
  const [showCode, setShowCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accessCode.trim()) {
      return
    }

    // Normalizează codul (uppercase, remove spaces/dashes)
    const normalizedCode = accessCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    if (normalizedCode.length < 6) {
      return
    }

    onAccessGranted(normalizedCode)
  }

  const formatAccessCode = (value: string) => {
    // Păstrează doar litere și cifre, uppercase
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    // Format PLI123ABC (fără separatori pentru usability)
    return cleaned.slice(0, 12) // Max 12 caractere
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAccessCode(e.target.value)
    setAccessCode(formatted)
  }

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-mystery-600" />
        <h3 className="text-lg font-semibold text-paranormal-800">Cod de acces 8 ore</h3>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-mystery-50 border border-mystery-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-mystery-600 mt-0.5" />
          <div className="text-sm text-mystery-700">
            <p className="font-medium mb-1">Introdu codul primit prin email:</p>
            <p>Format: PLI123ABC (8-12 caractere, litere și cifre)</p>
          </div>
        </div>
      </div>

      {/* Access Code Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-paranormal-700 mb-2">
            Codul de acces
          </label>
          <div className="relative">
            <input
              type={showCode ? "text" : "password"}
              value={accessCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 font-mono text-center tracking-wider text-lg ${
                error ? 'border-red-300 bg-red-50' : 'border-paranormal-300'
              }`}
              placeholder="PLI123ABC"
              maxLength={12}
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paranormal-400 hover:text-paranormal-600"
              disabled={loading}
            >
              {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Real-time validation hint */}
          <div className="mt-1 text-xs text-paranormal-500">
            {accessCode.length > 0 && (
              <span className={accessCode.length >= 6 ? 'text-green-600' : 'text-orange-600'}>
                {accessCode.length >= 6 ? '✓ Cod valid pentru verificare' : `${accessCode.length}/6 caractere minime`}
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2 text-red-800">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Cod invalid</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!accessCode.trim() || accessCode.length < 6 || loading}
          className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Se verifică accesul...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Verifică & Accesează</span>
            </>
          )}
        </button>
      </form>

      {/* Flexible Access Info */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">🔄 Acces Flexibil 8 Ore</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Poți intra și ieși de câte ori vrei</li>
          <li>• Dacă LIVE-ul se întrerupe, codul rămâne valabil</li>
          <li>• Funcționează pe telefon, tablet și computer</li>
          <li>• Timp de acces: 8 ore de la prima utilizare</li>
        </ul>
      </div>

      {/* Help Section */}
      <div className="space-y-3 pt-4 border-t border-paranormal-200">
        <h4 className="font-medium text-paranormal-700">Ai probleme cu codul?</h4>
        <div className="space-y-2 text-sm text-paranormal-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Verifică folderul de spam/junk din email</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Codul expiră după 8 ore de la prima utilizare</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Dacă plata a fost procesată, codul vine în max 2 minute</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Pentru suport: contact@plipli9paranormal.com</span>
          </div>
        </div>
      </div>

      {/* Quick Purchase Link */}
      <div className="text-center pt-4">
        <p className="text-sm text-paranormal-500 mb-2">Nu ai încă un cod de acces?</p>
        <button
          type="button"
          onClick={() => {
            const paymentSection = document.querySelector('[data-payment-section]')
            if (paymentSection) {
              paymentSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="text-mystery-600 hover:text-mystery-500 text-sm font-medium underline transition-colors"
        >
          Cumpără acces instant • 25 RON
        </button>
      </div>
    </div>
  )
}

export default AccessControl 