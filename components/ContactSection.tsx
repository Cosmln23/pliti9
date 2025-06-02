'use client'

import React, { useState } from 'react'
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactSectionProps {
  siteSettings?: {
    contact?: {
      email?: string
      instagram?: string
      tiktok?: string
      youtube?: string
      phone?: string
    }
    liveSettings?: {
      livePricing?: {
        individual?: number
        package3?: number
        monthly?: number
      }
      schedule?: string
    }
  }
}

const ContactSection = ({ siteSettings }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulează trimiterea emailului
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitStatus('success')
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  // Datele din Sanity sau fallback
  const contact = siteSettings?.contact || {}
  const liveSettings = siteSettings?.liveSettings || {}
  
  const email = contact.email || 'contact@plipli9paranormal.com'
  const instagram = contact.instagram || '@plipli9paranormal'
  const tiktok = contact.tiktok || '@plipli9paranormal'
  const youtube = contact.youtube || '@plipli9paranormal'
  const phone = contact.phone || ''
  const individualPrice = liveSettings?.livePricing?.individual || 25
  const packagePrice = liveSettings?.livePricing?.package3 || 60
  const monthlyPrice = liveSettings?.livePricing?.monthly || 150
  const schedule = liveSettings?.schedule || 'De obicei vinerea și sâmbăta seara, începând cu ora 21:00'

  const faqItems = [
    {
      question: 'Cât costă accesul la un LIVE paranormal?',
      answer: `LIVE-urile paranormale costă ${individualPrice} RON și includ acces complet la transmisiune, chat în timp real și înregistrarea pentru 24h.`
    },
    {
      question: 'Există pachete disponibile?',
      answer: `Da! Avem pachetul de 3 LIVE-uri la ${packagePrice} RON și accesul lunar complet la ${monthlyPrice} RON pentru toate transmisiunile.`
    },
    {
      question: 'Cum primesc codul de acces după plată?',
      answer: 'Imediat după finalizarea plății, vei primi automat codul de acces prin email. Verifică și folderul spam.'
    },
    {
      question: 'Când se desfășoară LIVE-urile?',
      answer: schedule
    },
    {
      question: 'Pot participa fizic la investigații?',
      answer: 'Da! Organizăm evenimente speciale pentru participarea fizică. Consultă secțiunea Evenimente pentru detalii.'
    }
  ]

  return (
    <section id="contact" className="bg-paranormal-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-mystery-400">Contact</span> & Întrebări
          </h2>
          <p className="text-xl text-paranormal-200 max-w-3xl mx-auto">
            Ai întrebări despre investigațiile paranormale? Contactează-ne sau consultă întrebările frecvente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Trimite un mesaj</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Numele tău"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-paranormal-800 border border-paranormal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-white placeholder-paranormal-400"
                />
                <input
                  type="email"
                  placeholder="Email-ul tău"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-paranormal-800 border border-paranormal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-white placeholder-paranormal-400"
                />
              </div>
              
              <input
                type="text"
                placeholder="Subiectul mesajului"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
                className="w-full px-4 py-3 bg-paranormal-800 border border-paranormal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-white placeholder-paranormal-400"
              />
              
              <textarea
                placeholder="Mesajul tău..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                className="w-full px-4 py-3 bg-paranormal-800 border border-paranormal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500 text-white placeholder-paranormal-400 resize-none"
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-mystery-600 hover:bg-mystery-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Trimite Mesajul</span>
                  </>
                )}
              </button>
            </form>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
                <div className="flex items-center space-x-2 text-green-200">
                  <CheckCircle className="w-5 h-5" />
                  <span>Mesajul a fost trimis cu succes!</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                <div className="flex items-center space-x-2 text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span>Eroare la trimiterea mesajului. Încearcă din nou.</span>
                </div>
              </div>
            )}

            {/* Contact Info din Sanity */}
            <div className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-white">Contact Direct</h4>
              <div className="space-y-3">
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center space-x-3 text-paranormal-200 hover:text-mystery-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{email}</span>
                </a>
                
                {phone && (
                  <a 
                    href={`tel:${phone}`}
                    className="flex items-center space-x-3 text-paranormal-200 hover:text-mystery-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{phone}</span>
                  </a>
                )}
                
                <div className="flex items-center space-x-3 text-paranormal-200">
                  <MapPin className="w-5 h-5" />
                  <span>România</span>
                </div>
              </div>

              {/* Social Media din Sanity */}
              <div className="pt-4">
                <h4 className="text-lg font-semibold text-white mb-3">Urmărește-ne</h4>
                <div className="flex space-x-4">
                  <a 
                    href={`https://tiktok.com/${tiktok.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                    title={`TikTok: ${tiktok}`}
                  >
                    <span className="text-sm font-bold">TT</span>
                  </a>
                  <a 
                    href={`https://instagram.com/${instagram.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                    title={`Instagram: ${instagram}`}
                  >
                    <span className="text-sm font-bold">IG</span>
                  </a>
                  <a 
                    href={`https://youtube.com/${youtube.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-paranormal-800 rounded-lg flex items-center justify-center hover:bg-mystery-600 transition-colors"
                    title={`YouTube: ${youtube}`}
                  >
                    <span className="text-sm font-bold">YT</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section cu prețuri din Sanity */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Întrebări Frecvente</h3>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-paranormal-800 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">{item.question}</h4>
                  <p className="text-paranormal-200 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 