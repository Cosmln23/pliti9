'use client'

import { useState } from 'react'
import { X, Monitor, Smartphone, Clock, MapPin } from 'lucide-react'

interface CurrentDevice {
  userAgent: string
  ip: string
  connectedAt: string
  sessionId: string
}

interface SessionTakeoverModalProps {
  isOpen: boolean
  onClose: () => void
  onTakeover: () => Promise<void>
  currentDevice: CurrentDevice
  loading?: boolean
}

export default function SessionTakeoverModal({ 
  isOpen, 
  onClose, 
  onTakeover, 
  currentDevice, 
  loading = false 
}: SessionTakeoverModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isOpen) return null

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile') || userAgent.toLowerCase().includes('android')) {
      return <Smartphone className="w-6 h-6" />
    }
    return <Monitor className="w-6 h-6" />
  }

  const getDeviceName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Browser necunoscut'
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffMinutes < 1) return 'acum'
    if (diffMinutes < 60) return `acum ${diffMinutes} minute`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `acum ${diffHours} ore`
    
    return 'acum mai mult de o zi'
  }

  const handleTakeover = async () => {
    setIsConfirming(true)
    try {
      await onTakeover()
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🚨 Cod în folosință
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading || isConfirming}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Device Info */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-blue-400">
              {getDeviceIcon(currentDevice.userAgent)}
            </div>
            <div>
              <div className="text-white font-semibold">
                {getDeviceName(currentDevice.userAgent)}
              </div>
              <div className="text-gray-400 text-sm">
                pe {currentDevice.userAgent.includes('Windows') ? 'Windows' : 
                     currentDevice.userAgent.includes('Mac') ? 'Mac' : 
                     currentDevice.userAgent.includes('Android') ? 'Android' : 'alt sistem'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Conectat {getTimeAgo(currentDevice.connectedAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>IP: {currentDevice.ip}</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="text-amber-400 text-sm">
            ⚠️ <strong>Atenție:</strong> Dacă continui, celălalt dispozitiv va fi deconectat automat și nu va mai putea accesa LIVE-ul cu acest cod.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading || isConfirming}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anulează
          </button>
          
          <button
            onClick={handleTakeover}
            disabled={loading || isConfirming}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Preluez...
              </>
            ) : (
              <>
                🔄 Preiau sesiunea
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Această acțiune nu poate fi anulată
        </div>
      </div>
    </div>
  )
} 