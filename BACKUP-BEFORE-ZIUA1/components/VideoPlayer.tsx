'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface VideoPlayerProps {
  playbackId: string
  playbackUrl?: string
  isLive?: boolean
  poster?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  playbackId, 
  playbackUrl,
  isLive = false, 
  poster 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)

  // Livepeer HLS URLs
  const hlsUrl = playbackUrl || `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`
  
  useEffect(() => {
    // Simulează conectarea la stream
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (isLive) {
        setIsPlaying(true) // Auto-play pentru LIVE
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('connected')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isLive])

  // Simulează verificarea conexiunii pentru LIVE
  useEffect(() => {
    if (isLive) {
      const checkConnection = setInterval(() => {
        // În aplicația reală, aici ar fi verificarea statusului stream-ului
        const isConnected = Math.random() > 0.1 // 90% chance of connection
        setConnectionStatus(isConnected ? 'connected' : 'error')
        if (!isConnected) {
          setError('Conexiunea la LIVE s-a întrerupt temporar')
        } else {
          setError(null)
        }
      }, 10000) // Verifică la 10 secunde

      return () => clearInterval(checkConnection)
    }
  }, [isLive])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const retryConnection = () => {
    setIsLoading(true)
    setError(null)
    setConnectionStatus('connecting')
    
    setTimeout(() => {
      setIsLoading(false)
      setConnectionStatus('connected')
      setIsPlaying(true)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-mystery-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-semibold mb-2">
            {isLive ? 'Conectare la LIVE...' : 'Se încarcă video-ul...'}
          </p>
          <p className="text-sm text-paranormal-300">
            {isLive ? 'Așteptați să ne conectați la transmisia paranormală' : 'Pregătim experiența paranormală'}
          </p>
          <div className="mt-4 text-xs text-paranormal-400">
            Playback ID: {playbackId}
          </div>
        </div>
      </div>
    )
  }

  if (error && connectionStatus === 'error') {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Conexiune întreruptă</h3>
          <p className="text-paranormal-300 mb-6">{error}</p>
          <button
            onClick={retryConnection}
            className="bg-mystery-600 hover:bg-mystery-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Wifi className="w-4 h-4" />
            <span>Încearcă din nou</span>
          </button>
          <p className="text-xs text-paranormal-400 mt-4">
            Chiar dacă se întrerupe, codul tău de acces rămâne valabil
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'} bg-black rounded-lg overflow-hidden`}>
      
      {/* Livepeer Video Player - În producție ar fi componenta reală Livepeer */}
      <div className="w-full h-full relative">
        {/* Pentru demo, folosim un placeholder care arată ca un video player real */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative">
          
          {/* Video Content Simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/80">
            {isLive && isPlaying && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
            )}
            
            {/* Connection Status */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded text-white text-xs">
                  <Wifi className="w-3 h-3" />
                  <span>HD</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-white text-xs">
                  <WifiOff className="w-3 h-3" />
                  <span>Reconnecting...</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="relative z-10 w-20 h-20 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>

          {/* Video Title Overlay */}
          {isLive && (
            <div className="absolute bottom-16 left-4 right-4 text-white">
              <h3 className="text-lg font-semibold mb-1">
                🎃 LIVE Paranormal Investigation
              </h3>
              <p className="text-sm text-gray-300">
                Explorăm misterele necunoscute în timp real
              </p>
            </div>
          )}
        </div>

        {/* Main Click Area for Play/Pause */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 cursor-pointer"
        />
      </div>

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-all duration-300 ${isPlaying && isLive ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Progress Bar - Doar pentru VOD */}
        {!isLive && (
          <div className="w-full mb-4">
            <div className="w-full h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all">
              <div 
                className="h-full bg-mystery-500 rounded-full relative"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '25%' }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-mystery-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-mystery-400 transition-colors p-1"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-mystery-400 transition-colors p-1"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            {/* Volume Slider */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  setIsMuted(newVolume === 0)
                }}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #d946ef 0%, #d946ef ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
                }}
              />
            </div>

            {/* Time Display / LIVE Indicator */}
            {!isLive ? (
              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration || 3600)}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
                <span className="text-gray-300 text-xs">• HD Quality</span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Quality Selector */}
            <button className="text-white hover:text-mystery-400 transition-colors p-1">
              <Settings className="w-5 h-5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-mystery-400 transition-colors p-1"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Livepeer Integration Info (Hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
          <div>Playback ID: {playbackId}</div>
          {playbackUrl && <div>URL: {playbackUrl}</div>}
          <div>Mode: {isLive ? 'LIVE' : 'VOD'}</div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer 