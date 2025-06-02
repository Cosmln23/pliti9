'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Play, 
  Calendar, 
  Video, 
  Zap, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Ghost,
  Skull,
  Eye,
  Moon
} from 'lucide-react'
import ContactSection from '@/components/ContactSection'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Mesaj de bun venit cu teaser */}
      <section className="relative bg-gradient-to-br from-paranormal-900 via-paranormal-800 to-paranormal-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-mystery-400 opacity-30">
            <Ghost size={100} />
          </div>
          <div className="absolute bottom-10 right-10 text-mystery-400 opacity-20">
            <Skull size={80} />
          </div>
          <div className="absolute top-1/2 left-1/3 text-mystery-300 opacity-25">
            <Eye size={60} />
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Logo și nume evidențiat */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-mystery-600 rounded-xl flex items-center justify-center mystery-glow">
                <Ghost className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                Plipli9 <span className="text-mystery-400 text-glow">Paranormal</span>
              </h1>
            </div>

            {/* Motto principal */}
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl font-semibold text-mystery-200 leading-relaxed">
                Mistere reale, locuri bântuite,
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                LIVE-uri autentice!
              </p>
            </div>

            {/* Descriere */}
            <p className="text-xl text-paranormal-200 max-w-3xl mx-auto leading-relaxed">
              Alătură-te în explorarea celor mai misterioase și înfricoșătoare locuri din România. 
              Experiențe paranormale autentice, investigate în timp real.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/live" className="btn-mystery group flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>LIVE Paranormal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/videos" className="btn-ghost group flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Vezi Videoclipuri</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teaser Content Section */}
      <section className="py-16 bg-paranormal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-mystery-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-mystery-600" />
              </div>
              <div className="text-2xl font-bold text-paranormal-800">5000+</div>
              <div className="text-sm text-paranormal-600">Exploratori</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-ghost-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-ghost-600" />
              </div>
              <div className="text-2xl font-bold text-paranormal-800">50+</div>
              <div className="text-sm text-paranormal-600">Locuri Investigate</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-mystery-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-mystery-600" />
              </div>
              <div className="text-2xl font-bold text-paranormal-800">100+</div>
              <div className="text-sm text-paranormal-600">LIVE-uri</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-ghost-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-ghost-600" />
              </div>
              <div className="text-2xl font-bold text-paranormal-800">500+</div>
              <div className="text-sm text-paranormal-600">Ore de Mistere</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LIVE Paranormal */}
            <div className="card-paranormal p-8 text-center">
              <div className="w-16 h-16 bg-mystery-600 rounded-xl flex items-center justify-center mx-auto mb-6 mystery-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-paranormal-800 mb-4">LIVE Paranormal</h3>
              <p className="text-paranormal-600 mb-6">
                Investigații în timp real în cele mai bântuite locuri. Interacționează prin chat și simte fiorii alături de noi.
              </p>
              <Link href="/live" className="btn-mystery inline-flex items-center space-x-2">
                <span>Acces LIVE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Videoclipuri */}
            <div className="card-paranormal p-8 text-center">
              <div className="w-16 h-16 bg-ghost-600 rounded-xl flex items-center justify-center mx-auto mb-6 ghost-glow">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-paranormal-800 mb-4">Arhivă Video</h3>
              <p className="text-paranormal-600 mb-6">
                Revizualizează momentele cele mai intense din investigațiile trecute. Organizate pe categorii și locații.
              </p>
              <Link href="/videos" className="btn-ghost inline-flex items-center space-x-2">
                <span>Vezi Videouri</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Evenimente */}
            <div className="card-paranormal p-8 text-center">
              <div className="w-16 h-16 bg-paranormal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-paranormal-800 mb-4">Evenimente</h3>
              <p className="text-paranormal-600 mb-6">
                Participă fizic la investigații speciale. Experiențe exclusive pentru cei mai curajoși.
              </p>
              <Link href="/events" className="btn-paranormal inline-flex items-center space-x-2">
                <span>Vezi Evenimente</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-paranormal-800 mb-12">
            Ce spun exploratorii paranormali
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-paranormal-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-paranormal-700 mb-4">
                "Cel mai autentic creator paranormal! LIVE-urile sunt incredibile, simți că ești acolo cu el."
              </p>
              <div className="font-medium text-paranormal-800">Alexandra M.</div>
            </div>
            
            <div className="bg-paranormal-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-paranormal-700 mb-4">
                "M-am speriat de câteva ori, dar nu pot să nu mă uit! Conținut paranormal de calitate."
              </p>
              <div className="font-medium text-paranormal-800">Marius R.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secțiunea Contact integrată */}
      <ContactSection />
    </div>
  )
}

export default HomePage 