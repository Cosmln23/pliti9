'use client'

import React from 'react'
import { Play, Clock, Eye, MapPin, Calendar, Star } from 'lucide-react'

interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  date: string
  category: string
  location: string
  featured?: boolean
}

interface VideoCardProps {
  video: VideoData
  featured?: boolean
}

const VideoCard: React.FC<VideoCardProps> = ({ video, featured = false }) => {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Castele': return 'bg-mystery-100 text-mystery-700'
      case 'Cimitire': return 'bg-gray-100 text-gray-700'
      case 'Case Abandonate': return 'bg-orange-100 text-orange-700'
      case 'Experimente Paranormale': return 'bg-purple-100 text-purple-700'
      default: return 'bg-paranormal-100 text-paranormal-700'
    }
  }

  return (
    <div className={`group cursor-pointer transition-all duration-300 ${
      featured 
        ? 'card-paranormal p-2' 
        : 'bg-white rounded-xl shadow-md hover:shadow-lg'
    }`}>
      
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-paranormal-800 to-black rounded-lg overflow-hidden">
        {/* Placeholder thumbnail - în aplicația reală ar fi imaginea din video.thumbnail */}
        <div className="w-full h-full bg-gradient-to-br from-paranormal-700 to-paranormal-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
            <p className="text-xs opacity-75">Video Paranormal</p>
          </div>
        </div>
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <Play className="w-6 h-6 text-paranormal-800 ml-1" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 left-2 bg-mystery-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Recomandat</span>
          </div>
        )}

        {/* Category badge */}
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${getCategoryColor(video.category)}`}>
          {video.category}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className={`font-semibold text-paranormal-800 mb-2 line-clamp-2 group-hover:text-mystery-600 transition-colors ${
          featured ? 'text-lg' : 'text-base'
        }`}>
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-paranormal-600 mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          {/* Views and Date */}
          <div className="flex items-center justify-between text-xs text-paranormal-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{formatViews(video.views)} vizualizări</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(video.date)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-xs text-paranormal-500">
            <MapPin className="w-3 h-3" />
            <span>{video.location}</span>
          </div>
        </div>

        {/* Action Button */}
        {featured && (
          <div className="mt-4">
            <button className="w-full bg-mystery-600 hover:bg-mystery-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Urmărește acum</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard 