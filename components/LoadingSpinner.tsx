'use client'

import React from 'react'
import { Loader2, Ghost, Zap, Eye } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  variant?: 'default' | 'paranormal' | 'ghost' | 'mystery'
  showIcon?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Se încarcă...',
  variant = 'default',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const containerSizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-8'
  }

  const messageSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'paranormal':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-purple-600 animate-pulse`} />
            </div>
          </div>
        )
      
      case 'ghost':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Ghost className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600 animate-bounce`} />
            </div>
          </div>
        )
      
      case 'mystery':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-pink-600 animate-pulse`} />
            </div>
          </div>
        )
      
      default:
        return <Loader2 className={`${sizeClasses[size]} text-mystery-600 animate-spin`} />
    }
  }

  const getMessageColor = () => {
    switch (variant) {
      case 'paranormal': return 'text-purple-600'
      case 'ghost': return 'text-gray-600'
      case 'mystery': return 'text-pink-600'
      default: return 'text-paranormal-600'
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}>
      <div className="relative mb-3">
        {renderSpinner()}
        
        {/* Outer glow ring for larger sizes */}
        {(size === 'lg' || size === 'md') && (
          <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-opacity-20 rounded-full animate-ping ${
            variant === 'paranormal' ? 'border-purple-400' :
            variant === 'ghost' ? 'border-gray-400' :
            variant === 'mystery' ? 'border-pink-400' :
            'border-mystery-400'
          }`}></div>
        )}
      </div>
      
      <p className={`${getMessageColor()} ${messageSizeClasses[size]} font-medium text-center animate-pulse`}>
        {message}
      </p>
      
      {/* Optional loading dots animation */}
      {size !== 'sm' && (
        <div className="flex space-x-1 mt-2">
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
            variant === 'paranormal' ? 'bg-purple-400' :
            variant === 'ghost' ? 'bg-gray-400' :
            variant === 'mystery' ? 'bg-pink-400' :
            'bg-mystery-400'
          }`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
            variant === 'paranormal' ? 'bg-purple-400' :
            variant === 'ghost' ? 'bg-gray-400' :
            variant === 'mystery' ? 'bg-pink-400' :
            'bg-mystery-400'
          }`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
            variant === 'paranormal' ? 'bg-purple-400' :
            variant === 'ghost' ? 'bg-gray-400' :
            variant === 'mystery' ? 'bg-pink-400' :
            'bg-mystery-400'
          }`} style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  )
}

export default LoadingSpinner 