'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Ghost, Video, Calendar, ShoppingBag, Zap } from 'lucide-react'

interface NavbarProps {
  logoUrl?: string
  siteName?: string
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl, siteName = 'Plipli9 Paranormal' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/', label: 'Acasă', icon: Ghost },
    { href: '/live', label: 'LIVE Paranormal', icon: Zap, highlight: true },
    { href: '/videos', label: 'Videoclipuri', icon: Video },
    { href: '/events', label: 'Evenimente', icon: Calendar },
    { href: '/shop', label: 'Magazin', icon: ShoppingBag },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 paranormal-gradient shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo și nume site */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              {logoUrl ? (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mystery-glow overflow-hidden">
                  <img 
                    src={logoUrl}
                    alt={siteName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-mystery-600 rounded-lg flex items-center justify-center mystery-glow">
                  <Ghost className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">
                  Plipli9 <span className="text-mystery-400">Paranormal</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Meniu desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    item.highlight
                      ? 'bg-mystery-600 text-white hover:bg-mystery-500 shadow-lg'
                      : 'text-paranormal-200 hover:text-white hover:bg-paranormal-600'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Buton meniu mobil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-paranormal-200 hover:text-white p-2 rounded-lg hover:bg-paranormal-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Meniu mobil */}
      {isOpen && (
        <div className="md:hidden bg-paranormal-800 border-t border-paranormal-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    item.highlight
                      ? 'bg-mystery-600 text-white'
                      : 'text-paranormal-200 hover:text-white hover:bg-paranormal-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 