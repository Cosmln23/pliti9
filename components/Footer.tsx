'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, Mail, MapPin } from 'lucide-react'

interface FooterProps {
  siteSettings?: any
}

const Footer: React.FC<FooterProps> = ({ siteSettings }) => {
  const currentYear = new Date().getFullYear()
  
  // Preluăm datele de contact din Sanity
  const contact = siteSettings?.contact || {}
  const email = contact.email || 'contact@plipli9paranormal.com'
  const instagram = contact.instagram || 'plipli9paranormal'
  const tiktok = contact.tiktok || 'plipli9paranormal'
  const youtube = contact.youtube || 'plipli9paranormal'

  return (
    <footer className="bg-paranormal-900 text-paranormal-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Descriere fără logo */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">
              Plipli9 <span className="text-mystery-400">Paranormal</span>
            </h3>
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

          {/* Contact & Social cu datele din Sanity */}
          <div>
            <h4 className="font-semibold text-white mb-4">Conectează-te</h4>
            <div className="space-y-3">
              <a 
                href={`mailto:${email}`} 
                className="flex items-center space-x-2 text-paranormal-300 hover:text-mystery-400 transition-colors text-sm"
              >
                <Mail size={16} />
                <span>{email}</span>
              </a>
              
              {/* Social Media Links cu datele din Sanity */}
              <div className="flex space-x-3 pt-2">
                <a 
                  href={`https://tiktok.com/@${tiktok}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-bold">TT</span>
                </a>
                <a 
                  href={`https://instagram.com/${instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a 
                  href={`https://youtube.com/@${youtube}`} 
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