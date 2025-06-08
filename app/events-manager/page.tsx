'use client';

import { useState, useEffect } from 'react';
import AdminAuth from '../../components/AdminAuth';

interface ParanormalEvent {
  id: string;
  title: string;
  type: 'live_session' | 'investigation' | 'special_event';
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  location: string;
  equipment: string[];
  scheduledDate: string;
  duration: number;
  description: string;
  maxViewers: number;
  priceRON: number;
}

const ROMANIAN_LOCATIONS = [
  'Castelul Bran, Brașov',
  'Castelul Corvinilor, Hunedoara', 
  'Castelul Peleș, Sinaia',
  'Casa Ceaușescu, București',
  'Mănăstirea Horezu, Vâlcea',
  'Castelul Banffy, Cluj',
  'Hotel Europa, Eforie Nord',
  'Casa cu Turla, Sighișoara',
  'Mănăstirea Putna, Suceava',
  'Teatrul Național, Timișoara'
];

const PARANORMAL_EQUIPMENT = [
  'Spirit Box',
  'EMF Detector', 
  'Digital Thermometer',
  'Infrared Camera',
  'Voice Recorder',
  'Motion Sensor',
  'Laser Grid',
  'REM Pod',
  'Ghost Box',
  'Trigger Objects'
];

const EVENT_TYPES = [
  { value: 'live_session', label: 'Sesiune Live', icon: '🔴' },
  { value: 'investigation', label: 'Investigație Paranormală', icon: '🔍' },
  { value: 'special_event', label: 'Eveniment Special', icon: '⭐' }
];

export default function EventsManager() {
  const [events, setEvents] = useState<ParanormalEvent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ParanormalEvent | null>(null);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState<Partial<ParanormalEvent>>({
    title: '',
    type: 'live_session',
    status: 'planned',
    location: ROMANIAN_LOCATIONS[0],
    equipment: [],
    scheduledDate: '',
    duration: 60,
    description: '',
    maxViewers: 100,
    priceRON: 25
  });

  useEffect(() => {
    // Load saved events from localStorage
    const savedEvents = localStorage.getItem('paranormal-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (eventsToSave: ParanormalEvent[]) => {
    localStorage.setItem('paranormal-events', JSON.stringify(eventsToSave));
    setEvents(eventsToSave);
  };

  const createEvent = () => {
    if (!newEvent.title || !newEvent.scheduledDate) return;

    const event: ParanormalEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      type: newEvent.type!,
      status: newEvent.status!,
      location: newEvent.location!,
      equipment: newEvent.equipment!,
      scheduledDate: newEvent.scheduledDate!,
      duration: newEvent.duration!,
      description: newEvent.description!,
      maxViewers: newEvent.maxViewers!,
      priceRON: newEvent.priceRON!
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);
    setIsCreating(false);
    setNewEvent({
      title: '',
      type: 'live_session',
      status: 'planned',
      location: ROMANIAN_LOCATIONS[0],
      equipment: [],
      scheduledDate: '',
      duration: 60,
      description: '',
      maxViewers: 100,
      priceRON: 25
    });
  };

  const updateEventStatus = (eventId: string, newStatus: ParanormalEvent['status']) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
  };

  const toggleEquipment = (equipment: string) => {
    const current = newEvent.equipment || [];
    const updated = current.includes(equipment)
      ? current.filter(e => e !== equipment)
      : [...current, equipment];
    setNewEvent({ ...newEvent, equipment: updated });
  };

  const startLiveSession = async (event: ParanormalEvent) => {
    setLoading(true);
    try {
      // Start live session
      await fetch('/api/live-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          location: event.location,
          equipment: event.equipment
        })
      });
      
      updateEventStatus(event.id, 'active');
      alert(`🔴 Sesiunea live "${event.title}" a început!`);
    } catch (error) {
      console.error('Error starting live session:', error);
      alert('Eroare la pornirea sesiunii live!');
    }
    setLoading(false);
  };

  const stopLiveSession = async (event: ParanormalEvent) => {
    setLoading(true);
    try {
      await fetch('/api/live-sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id })
      });
      
      updateEventStatus(event.id, 'completed');
      alert(`⏹️ Sesiunea live "${event.title}" s-a încheiat!`);
    } catch (error) {
      console.error('Error stopping live session:', error);
      alert('Eroare la oprirea sesiunii live!');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return '📅';
      case 'active': return '🔴';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⚪';
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  👻 Manager Evenimente Paranormale
                </h1>
                <p className="text-purple-200">
                  Controlul complet al sesiunilor live și investigațiilor paranormale
                </p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-purple-500/25"
              >
                ➕ Eveniment Nou
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Total Evenimente</p>
                  <p className="text-3xl font-bold text-white">{events.length}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm font-medium">Sesiuni Active</p>
                  <p className="text-3xl font-bold text-white">
                    {events.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <div className="text-4xl">🔴</div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Planificate</p>
                  <p className="text-3xl font-bold text-white">
                    {events.filter(e => e.status === 'planned').length}
                  </p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Complete</p>
                  <p className="text-3xl font-bold text-white">
                    {events.filter(e => e.status === 'completed').length}
                  </p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/30 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)} {event.status.toUpperCase()}
                    </span>
                    <div className="flex space-x-2">
                      {event.status === 'planned' && (
                        <button
                          onClick={() => startLiveSession(event)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                        >
                          🔴 START
                        </button>
                      )}
                      {event.status === 'active' && (
                        <button
                          onClick={() => stopLiveSession(event)}
                          disabled={loading}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                        >
                          ⏹️ STOP
                        </button>
                      )}
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-purple-200 text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-purple-200">
                      <span className="w-4">📍</span>
                      <span className="ml-2">{event.location}</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <span className="w-4">📅</span>
                      <span className="ml-2">{new Date(event.scheduledDate).toLocaleString('ro-RO')}</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <span className="w-4">⏱️</span>
                      <span className="ml-2">{event.duration} minute</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <span className="w-4">💰</span>
                      <span className="ml-2">{event.priceRON} RON</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <span className="w-4">👥</span>
                      <span className="ml-2">Max {event.maxViewers} vizitatori</span>
                    </div>
                  </div>

                  {event.equipment.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-purple-300 mb-2">Echipament:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.equipment.map(eq => (
                          <span key={eq} className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl font-semibold text-white mb-2">Niciun eveniment paranormal</h3>
              <p className="text-purple-200 mb-6">Creează primul eveniment pentru a începe investigațiile!</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                ➕ Creează Primul Eveniment
              </button>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">👻 Eveniment Paranormal Nou</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-purple-300 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Titlu Eveniment</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                    placeholder="ex: Investigație la Castelul Bran"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Tip Eveniment</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                      className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                    >
                      {EVENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Locație</label>
                    <select
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                    >
                      {ROMANIAN_LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Data & Ora</label>
                    <input
                      type="datetime-local"
                      value={newEvent.scheduledDate}
                      onChange={(e) => setNewEvent({ ...newEvent, scheduledDate: e.target.value })}
                      className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Durată (min)</label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                      className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                      min="30"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Preț (RON)</label>
                    <select
                      value={newEvent.priceRON}
                      onChange={(e) => setNewEvent({ ...newEvent, priceRON: parseInt(e.target.value) })}
                      className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value={25}>25 RON</option>
                      <option value={60}>60 RON</option>
                      <option value={150}>150 RON</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Descriere</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                    rows={3}
                    placeholder="Descrie evenimentul paranormal..."
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Echipament Paranormal</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PARANORMAL_EQUIPMENT.map(equipment => (
                      <label key={equipment} className="flex items-center space-x-2 text-purple-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newEvent.equipment?.includes(equipment) || false}
                          onChange={() => toggleEquipment(equipment)}
                          className="rounded border-purple-500 bg-black/20 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm">{equipment}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Numărul maxim de vizitatori</label>
                  <input
                    type="number"
                    value={newEvent.maxViewers}
                    onChange={(e) => setNewEvent({ ...newEvent, maxViewers: parseInt(e.target.value) })}
                    className="w-full bg-black/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                    min="10"
                    max="1000"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-2 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/10 transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={createEvent}
                    disabled={!newEvent.title || !newEvent.scheduledDate}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    👻 Creează Eveniment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  );
}