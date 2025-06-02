'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'

interface VideoPlayerProps {
  playbackId: string
  isLive?: boolean
  poster?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  playbackId, 
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

  // În aplicația reală, aici ar fi integrarea cu Livepeer
  // Pentru demo, simulăm un player video
  const videoSrc = isLive 
    ? `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`
    : `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`

  useEffect(() => {
    // Simulează încărcarea video-ului
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (isLive) {
        setIsPlaying(true) // Auto-play pentru LIVE
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLive])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-mystery-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Se încarcă video-ul paranormal...</p>
          {isLive && <p className="text-sm text-paranormal-300 mt-2">Conectare la LIVE...</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'} bg-black rounded-lg overflow-hidden`}>
      
      {/* Video Element - În aplicația reală ar fi Livepeer Player */}
      <div className="w-full h-full bg-gradient-to-br from-paranormal-900 to-black flex items-center justify-center">
        {/* Simulare video placeholder */}
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-mystery-600 rounded-full flex items-center justify-center mx-auto mb-4 mystery-glow">
            {isPlaying ? (
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </div>
          {isLive ? (
            <>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">LIVE PARANORMAL</span>
              </div>
              <p className="text-paranormal-300">Investigație în curs...</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">Video Paranormal</h3>
              <p className="text-paranormal-300">Playback ID: {playbackId}</p>
            </>
          )}
        </div>
        
        {/* Click overlay pentru play/pause */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
        >
          <div className={`w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Progress Bar - Doar pentru VOD */}
        {!isLive && (
          <div className="w-full mb-4">
            <div className="w-full h-1 bg-gray-600 rounded-full cursor-pointer">
              <div 
                className="h-full bg-mystery-500 rounded-full"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-mystery-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-mystery-400 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Time Display */}
            {!isLive && (
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            )}
            
            {isLive && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-mystery-400 transition-colors">
              <Settings className="w-6 h-6" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-mystery-400 transition-colors"
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      )}

      {/* Quality/Settings overlay */}
      <div className="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        {isLive ? 'Auto' : '1080p'}
      </div>
    </div>
  )
}

export default VideoPlayer 