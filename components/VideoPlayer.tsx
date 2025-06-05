'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Wifi, WifiOff, AlertCircle, ExternalLink } from 'lucide-react'

interface VideoPlayerProps {
  playbackId?: string
  playbackUrl?: string
  youtubeVideoId?: string
  twitchChannel?: string
  isLive?: boolean
  poster?: string
  isYouTubeLive?: boolean
  isTwitchLive?: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  playbackId, 
  playbackUrl,
  youtubeVideoId,
  twitchChannel,
  isLive = false, 
  poster,
  isYouTubeLive = false,
  isTwitchLive = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // Start unmuted
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)
  const [showEndOverlay, setShowEndOverlay] = useState(false)
  const [wasLive, setWasLive] = useState(false)

  // YouTube Live URL construction
  const youtubeEmbedUrl = youtubeVideoId 
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0`
    : null

  // Twitch Embed URL construction
  const twitchEmbedUrl = twitchChannel 
    ? `https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true&muted=false&volume=1.0`
    : null

  // Livepeer HLS URLs
  const hlsUrl = playbackUrl || (playbackId ? `https://livepeercdn.studio/hls/${playbackId}/index.m3u8` : null)
  
  useEffect(() => {
    // Simulează conectarea la stream
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (isLive || isYouTubeLive || isTwitchLive) {
        setIsPlaying(true) // Auto-play pentru LIVE
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('connected')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLive, isYouTubeLive, isTwitchLive])

  // Simulează verificarea conexiunii pentru LIVE
  useEffect(() => {
    if (isLive || isYouTubeLive || isTwitchLive) {
      // REMOVED: Error simulation - keep connection always stable for live streaming
      // Video player MUST be 100% reliable during live streams
      setConnectionStatus('connected')
      setError(null)
      
      // Optional: Real connection check (without fake errors)
      const checkConnection = setInterval(() => {
        // Only check if iframe/video is actually loaded
        // For Twitch embeds, assume always connected since Twitch handles this
        if (isTwitchLive || isYouTubeLive) {
          setConnectionStatus('connected')
          setError(null)
        }
      }, 30000) // Check every 30 seconds only

      return () => clearInterval(checkConnection)
    }
  }, [isLive, isYouTubeLive, isTwitchLive])

  useEffect(() => {
    // Track when stream goes from live to offline
    if (isLive || isYouTubeLive || isTwitchLive) {
      setWasLive(true)
      setShowEndOverlay(false) // Hide overlay when live
    } else if (wasLive && !(isLive || isYouTubeLive || isTwitchLive)) {
      // Stream just ended - show overlay after delay
      console.log('🎬 Stream ended, showing thank you overlay...')
      const timer = setTimeout(() => {
        setShowEndOverlay(true)
      }, 3000) // Show overlay 3 seconds after stream ends
      
      return () => clearTimeout(timer)
    }
  }, [isLive, isYouTubeLive, isTwitchLive, wasLive])

  // Also listen for Twitch iframe offline events
  useEffect(() => {
    if (isTwitchLive && typeof window !== 'undefined') {
      // Check if Twitch player is offline every 10 seconds
      const checkTwitchStatus = setInterval(() => {
        // In real implementation, you could listen to Twitch embed events
        // For now, we'll detect manually when stream ends
        console.log('🔍 Checking Twitch stream status...')
      }, 10000)
      
      return () => clearInterval(checkTwitchStatus)
    }
  }, [isTwitchLive])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    setIsMuted(value === 0)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00'
    
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-paranormal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {isTwitchLive ? 'Conectare Twitch Live...' : 
             isYouTubeLive ? 'Conectare YouTube Live...' : 
             'Se încarcă stream-ul...'}
          </p>
          <p className="text-paranormal-300 text-sm mt-2">
            {isTwitchLive ? 'Pregătim transmisia paranormală...' :
             isYouTubeLive ? 'Verificăm transmisia live' : 
             'Pregătim totul pentru tine'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center border border-red-600">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-400 text-xl mb-2">Problemă de conexiune</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              setConnectionStatus('connecting')
              setIsLoading(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'} bg-black overflow-hidden`}>
      
      {/* Twitch Embed Player */}
      {isTwitchLive && twitchEmbedUrl ? (
        <div className="w-full h-full relative">
          <iframe
            src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true&muted=false&volume=1.0&controls=false`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="w-full h-full"
            style={{
              border: 'none',
              outline: 'none',
            }}
          ></iframe>
          
          {/* Stream Ended Overlay - appears when stream goes offline */}
          <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/95 via-black/90 to-gray-900/95 backdrop-blur-sm flex items-center justify-center transition-opacity duration-1000 ${showEndOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center p-8 max-w-md relative">
              
              {/* Close button pentru testare */}
              <button
                onClick={() => setShowEndOverlay(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                title="Închide overlay"
              >
                ✕
              </button>
              
              {/* Paranormal decoration */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-3xl">👻</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
              </div>
              
              {/* Thank you message */}
              <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
                🌟 PLIPLI9 VĂ MULȚUMEȘTE! 🌟
              </h2>
              <p className="text-purple-300 text-lg mb-4 font-medium">
                pentru vizionarea investigației paranormale
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>✨ Spiritele au fost contactate cu succes</p>
                <p>🔮 Misterul continuă în următoarea sesiune</p>
                <p>👻 Rămâi conectat pentru mai multe aventuri</p>
              </div>
              
              {/* Next stream info */}
              <div className="mt-6 p-4 bg-black/40 border border-purple-500/30 rounded-lg">
                <p className="text-purple-400 text-sm font-semibold mb-1">
                  📅 Următorul LIVE
                </p>
                <p className="text-white text-xs">
                  Sâmbătă, 21:00 - Locația va fi anunțată
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-8 left-4 text-purple-400/30 text-2xl animate-spin-slow">⚡</div>
              <div className="absolute bottom-4 right-4 text-blue-400/30 text-xl animate-bounce">🌙</div>
              <div className="absolute top-1/2 -left-2 text-purple-300/20 text-lg animate-pulse">✨</div>
              <div className="absolute top-1/3 -right-2 text-yellow-400/30 text-sm animate-ping">🔮</div>
            </div>
          </div>
          
          {/* Simple Live Indicator */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-white text-sm font-semibold">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
            
            {/* Demo button pentru testare overlay */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => setShowEndOverlay(true)}
                className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white text-xs"
                title="Test End Overlay"
              >
                🎬 Test Final
              </button>
            )}
          </div>
        </div>
      ) : 
      
      /* YouTube Embed Player */
      isYouTubeLive && youtubeEmbedUrl ? (
        <div className="w-full h-full relative">
          <iframe
            src={youtubeEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          
          {/* YouTube Live Overlay */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-white text-sm font-semibold z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>YOUTUBE LIVE</span>
          </div>
        </div>
      ) :
      
      /* Livepeer HLS Player pentru stream-uri normale */
      hlsUrl ? (
        <>
          <video
            className="w-full h-full object-cover"
            autoPlay={isLive}
            controls={!isLive}
            muted={isMuted}
            poster={poster}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          >
            <source src={hlsUrl} type="application/x-mpegURL" />
            Browser-ul tău nu suportă redarea video.
          </video>

          {/* Video Controls pentru stream-uri non-live */}
          {!isLive && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-white hover:text-paranormal-400 transition-colors">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button onClick={toggleMute} className="text-white hover:text-paranormal-400 transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-paranormal-500 h-1 rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>
                
                <button onClick={toggleFullscreen} className="text-white hover:text-paranormal-400 transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Live Stream Status */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-white text-sm font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
              
              {/* Connection Status */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                connectionStatus === 'connected' ? 'bg-green-600 text-white' :
                connectionStatus === 'connecting' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {connectionStatus === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span className="hidden sm:inline">
                  {connectionStatus === 'connected' ? 'Conectat' : 
                   connectionStatus === 'connecting' ? 'Conectare...' : 'Deconectat'}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Fallback pentru cazuri fără URL */
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Stream indisponibil momentan</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer 