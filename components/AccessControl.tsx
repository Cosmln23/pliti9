'use client'

import React, { useState } from 'react'
import { Key, Lock, Loader, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

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
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accessCode.trim()) {
      return
    }

    setIsValidating(true)
    
    // Simulează validarea codului
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onAccessGranted(accessCode.trim())
    setIsValidating(false)
  }

  const formatAccessCode = (value: string) => {
    // Formatează codul ca: ABC-123-XYZ
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const formatted = cleaned.replace(/(.{3})/g, '$1-').slice(0, 11)
    return formatted
  }

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-mystery-600" />
        <h3 className="text-lg font-semibold text-paranormal-800">Cod de acces LIVE</h3>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-mystery-50 border border-mystery-200 rounded-lg">
        <p className="text-sm text-mystery-700">
          Introdu codul de acces primit prin email după achiziționarea accesului la LIVE-ul paranormal.
        </p>
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
              onChange={(e) => setAccessCode(formatAccessCode(e.target.value))}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 font-mono text-center tracking-wider ${
                error ? 'border-red-300 bg-red-50' : 'border-paranormal-300'
              }`}
              placeholder="PLI-123-ABC"
              maxLength={11}
              disabled={loading || isValidating}
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paranormal-400 hover:text-paranormal-600"
            >
              {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Format hint */}
          <p className="mt-1 text-xs text-paranormal-500">
            Format: PLI-123-ABC (se completează automat)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!accessCode.trim() || loading || isValidating}
          className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {(loading || isValidating) ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Se verifică codul...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Accesează LIVE-ul</span>
            </>
          )}
        </button>
      </form>

      {/* Help Section */}
      <div className="space-y-3 pt-4 border-t border-paranormal-200">
        <h4 className="font-medium text-paranormal-700">Ai probleme cu codul?</h4>
        <div className="space-y-2 text-sm text-paranormal-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Verifică folderul de spam din email</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Codul expiră după 24 de ore de la achiziționare</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-mystery-400 rounded-full mt-2"></div>
            <span>Contactează-ne la contact@plipli9paranormal.com pentru suport</span>
          </div>
        </div>
      </div>

      {/* Quick Purchase Link */}
      <div className="text-center pt-4">
        <p className="text-sm text-paranormal-500 mb-2">Nu ai încă un cod de acces?</p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-mystery-600 hover:text-mystery-500 text-sm font-medium underline"
        >
          Cumpără acces la LIVE (25 RON)
        </button>
      </div>
    </div>
  )
}

export default AccessControl 