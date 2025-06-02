'use client'

import React from 'react'
import Link from 'next/link'
import { Ghost, Heart, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-paranormal-900 text-paranormal-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo și descriere */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-mystery-600 rounded-lg flex items-center justify-center mystery-glow">
                <Ghost className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Plipli9 <span className="text-mystery-400">Paranormal</span>
              </h3>
            </div>
            <p className="text-paranormal-300 mb-4 leading-relaxed">
              Mistere reale, locuri bântuite, LIVE-uri autentice! Alătură-te comunității celor mai curajoși exploratori ai paranormalului din România.
            </p>
            <div className="flex items-center space-x-2 text-paranormal-400">
              <MapPin size={16} />
              <span className="text-sm">România</span>
            </div>
          </div>

          {/* Navigare rapidă */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigare</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-paranormal-300 hover:text-mystery-400 transition-colors text-sm">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/live" className="text-paranormal-300 hover:text-mystery-400 transition-colors text-sm">
                  LIVE Paranormal
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-paranormal-300 hover:text-mystery-400 transition-colors text-sm">
                  Videoclipuri
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-paranormal-300 hover:text-mystery-400 transition-colors text-sm">
                  Evenimente
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-paranormal-300 hover:text-mystery-400 transition-colors text-sm">
                  Magazin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Conectează-te</h4>
            <div className="space-y-3">
              <a 
                href="mailto:contact@plipli9paranormal.com" 
                className="flex items-center space-x-2 text-paranormal-300 hover:text-mystery-400 transition-colors text-sm"
              >
                <Mail size={16} />
                <span>contact@plipli9paranormal.com</span>
              </a>
              
              {/* Social Media Links */}
              <div className="flex space-x-3 pt-2">
                <a 
                  href="https://tiktok.com/@plipli9paranormal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-bold">TT</span>
                </a>
                <a 
                  href="https://instagram.com/plipli9paranormal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a 
                  href="https://youtube.com/@plipli9paranormal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                  aria-label="YouTube"
                >
                  <span className="text-xs font-bold">YT</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-paranormal-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-paranormal-400 text-sm">
              <span>&copy; {currentYear} Plipli9 Paranormal. Toate drepturile rezervate.</span>
            </div>
            
            <div className="flex items-center space-x-1 text-paranormal-400 text-sm">
              <span>Creat cu</span>
              <Heart size={14} className="text-mystery-400" />
              <span>pentru exploratorii paranormalului</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 