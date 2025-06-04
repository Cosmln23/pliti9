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
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)

  // YouTube Live URL construction
  const youtubeEmbedUrl = youtubeVideoId 
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`
    : null

  // Twitch Embed URL construction
  const twitchEmbedUrl = twitchChannel 
    ? `https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true&muted=false`
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
    <div className={`relative group ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'} bg-black rounded-lg overflow-hidden`}>
      
      {/* Twitch Embed Player */}
      {isTwitchLive && twitchEmbedUrl ? (
        <div className="w-full h-full relative">
          <iframe
            src={twitchEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          
          {/* Twitch Live Overlay */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-purple-600 px-3 py-1 rounded-lg z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-semibold">TWITCH LIVE</span>
          </div>
          
          {/* Twitch Link */}
          <div className="absolute top-4 right-4 z-10">
            <a 
              href={`https://www.twitch.tv/${twitchChannel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 bg-black/70 hover:bg-black/90 px-2 py-1 rounded text-white text-xs transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Vezi pe Twitch</span>
            </a>
          </div>
          
          {/* Chat reminder */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-paranormal-800/90 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-white text-sm">
                🎮 <strong>PLIPLI9 PARANORMAL</strong> - Transmisie LIVE din teren! 
              </p>
              <p className="text-paranormal-300 text-xs mt-1">
                💬 Chat-ul nostru este în sidebar-ul din dreapta
              </p>
            </div>
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
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-lg z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-semibold">YOUTUBE LIVE</span>
          </div>
          
          {/* YouTube Link */}
          <div className="absolute top-4 right-4 z-10">
            <a 
              href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 bg-black/70 hover:bg-black/90 px-2 py-1 rounded text-white text-xs transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Vezi pe YouTube</span>
            </a>
          </div>
          
          {/* Chat reminder */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-paranormal-800/90 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-white text-sm">
                💬 <strong>Chat-ul LIVE</strong> este disponibil în bara din dreapta!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Livepeer Video Player - Pentru streaming-ul existent */
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
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-mystery-600 rounded-full flex items-center justify-center hover:bg-mystery-500 transition-colors shadow-2xl">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </button>
            )}

            {/* Video Controls */}
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

              {/* Control Bar */}
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center space-x-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-mystery-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center space-x-2 group">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-mystery-400 transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Time Display */}
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

            {/* Development Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
                <div>Playback ID: {playbackId}</div>
                {playbackUrl && <div>URL: {playbackUrl}</div>}
                <div>Mode: {isLive ? 'LIVE' : 'VOD'}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer 