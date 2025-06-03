'use client'

import React, { useState } from 'react'
import { Calendar, MapPin, Users, Clock, CreditCard, Ghost, Skull, Building, Star } from 'lucide-react'

interface EventData {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  maxParticipants: number
  currentParticipants: number
  category: string
  featured?: boolean
}

interface EventCardProps {
  event: EventData
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isBooking, setIsBooking] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Castell': return Building
      case 'Cemetery': return Skull
      case 'Abandoned': return Ghost
      default: return Calendar
    }
  }

  const getAvailabilityStatus = () => {
    const remaining = event.maxParticipants - event.currentParticipants
    if (remaining === 0) return { status: 'full', text: 'Complet rezervat', color: 'text-red-600' }
    if (remaining <= 2) return { status: 'limited', text: `Doar ${remaining} locuri libere`, color: 'text-orange-600' }
    return { status: 'available', text: `${remaining} locuri disponibile`, color: 'text-green-600' }
  }

  const availability = getAvailabilityStatus()

  const handleBooking = async () => {
    setIsBooking(true)
    
    // Simulează procesul de rezervare
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // În aplicația reală, aici ar fi logica de rezervare
    alert(`Rezervare pentru "${event.title}" a fost inițiată!`)
    
    setIsBooking(false)
  }

  const CategoryIcon = getCategoryIcon(event.category)

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      event.featured ? 'ring-2 ring-mystery-500 ring-opacity-50' : ''
    }`}>
      
      {/* Event Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-paranormal-800 to-paranormal-900">
        {/* Placeholder background - în aplicația reală ar fi o imagine */}
        <div className="absolute inset-0 bg-gradient-to-br from-paranormal-700 to-black opacity-80"></div>
        
        {/* Event Info Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            {event.featured && (
              <div className="bg-mystery-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Eveniment special</span>
              </div>
            )}
            <div className="bg-black bg-opacity-50 p-2 rounded-lg">
              <CategoryIcon className="w-6 h-6" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        
        {/* Description */}
        <p className="text-paranormal-600 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-mystery-600" />
          <span className="text-paranormal-700 font-medium">{event.location}</span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-paranormal-600" />
            <span className="text-paranormal-700">
              {event.currentParticipants}/{event.maxParticipants} participanți
            </span>
          </div>
          <span className={`text-sm font-medium ${availability.color}`}>
            {availability.text}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-paranormal-200 rounded-full h-2 mb-4">
          <div
            className="bg-mystery-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(event.currentParticipants / event.maxParticipants) * 100}%` 
            }}
          ></div>
        </div>

        {/* Price and Booking */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-mystery-600">{event.price} RON</span>
            <span className="text-sm text-paranormal-500 block">per persoană</span>
          </div>
          
          <button
            onClick={handleBooking}
            disabled={availability.status === 'full' || isBooking}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              availability.status === 'full'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-mystery-600 hover:bg-mystery-500 text-white'
            }`}
          >
            {isBooking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Se rezervă...</span>
              </>
            ) : availability.status === 'full' ? (
              <span>Complet</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Rezervă acum</span>
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-paranormal-50 rounded-lg">
          <div className="text-xs text-paranormal-600 space-y-1">
            <p>🎒 Echipament furnizat: EMF detector, termometru digital</p>
            <p>⚠️ Vârstă minimă: 18 ani</p>
            <p>📱 Grup WhatsApp pentru coordonare</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard 