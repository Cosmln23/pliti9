'use client'

import React, { useState } from 'react'
import { Calendar, MapPin, Users, Clock, CreditCard, Ghost, Skull, Building } from 'lucide-react'
import EventCard from '@/components/EventCard'

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const events = [
    {
      id: '1',
      title: 'Investigație de Halloween la Castelul Bran',
      description: 'Participă la cea mai înfricoșătoare investigație paranormală din an!',
      date: '2024-10-31',
      time: '20:00',
      location: 'Castelul Bran, Brașov',
      price: 150,
      maxParticipants: 12,
      currentParticipants: 8,
      category: 'Castell',
      featured: true
    },
    {
      id: '2', 
      title: 'Noapte în Cimitirul Bellu',
      description: 'Explorează cel mai bântuit cimitir din București',
      date: '2024-02-14',
      time: '22:00',
      location: 'Cimitirul Bellu, București',
      price: 80,
      maxParticipants: 8,
      currentParticipants: 3,
      category: 'Cemetery',
      featured: false
    }
  ]

  return (
    <div className="min-h-screen bg-paranormal-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-paranormal-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-paranormal-800">
              Evenimente <span className="text-paranormal-600">Paranormale</span>
            </h1>
          </div>
          <p className="text-xl text-paranormal-600 max-w-3xl mx-auto">
            Participă fizic la investigații exclusive. Experiențe paranormale autentice pentru cei mai curajoși exploratori.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventsPage 