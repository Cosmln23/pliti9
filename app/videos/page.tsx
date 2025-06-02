'use client'

import React, { useState, useEffect } from 'react'
import { 
  Video, 
  Play, 
  Clock, 
  Eye, 
  Filter, 
  Search,
  Calendar,
  MapPin,
  Ghost,
  Skull,
  Building,
  TreePine,
  ChevronDown
} from 'lucide-react'
import VideoCard from '@/components/VideoCard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  date: string
  category: 'Locuri Bântuite' | 'Experimente Paranormale' | 'Castele' | 'Cimitire' | 'Case Abandonate'
  location: string
  featured: boolean
}

const VideosPage = () => {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Toate')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'duration'>('date')

  const categories = [
    'Toate',
    'Locuri Bântuite', 
    'Experimente Paranormale',
    'Castele',
    'Cimitire',
    'Case Abandonate'
  ]

  // Simulează încărcarea videoclipurilor
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true)
      
      // Simulează API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockVideos: VideoData[] = [
        {
          id: '1',
          title: 'Investigație LIVE la Castelul Corvinilor',
          description: 'O noapte întreagă de investigație paranormală în unul dintre cele mai bântuite castele din România.',
          thumbnail: '/video-thumbs/corvins-castle.jpg',
          duration: '2:45:32',
          views: 15420,
          date: '2024-01-15',
          category: 'Castele',
          location: 'Hunedoara',
          featured: true
        },
        {
          id: '2',
          title: 'Spirite în Cimitirul Bellu - Experiență Șocantă',
          description: 'Am petrecut o noapte în cimitirul cel mai bântuit din București. Ce am descoperit m-a marcat pentru totdeauna.',
          thumbnail: '/video-thumbs/bellu-cemetery.jpg',
          duration: '1:23:45',
          views: 8930,
          date: '2024-01-10',
          category: 'Cimitire',
          location: 'București',
          featured: false
        },
        {
          id: '3',
          title: 'Casa Abandonată din Slatina - Fenomene Inexplicabile',
          description: 'O casă părăsită de 20 de ani ascunde secrete înfricoșătoare. Activitate paranormală intensă surprinsă pe cameră.',
          thumbnail: '/video-thumbs/abandoned-house-slatina.jpg',
          duration: '1:56:12',
          views: 12350,
          date: '2024-01-05',
          category: 'Case Abandonate',
          location: 'Slatina',
          featured: true
        },
        {
          id: '4',
          title: 'Experiment cu Tabla Ouija - Contact cu Spiritele',
          description: 'Am încercat să contactez spiritele folosind tabla Ouija într-un loc cu activitate paranormală cunoscută.',
          thumbnail: '/video-thumbs/ouija-experiment.jpg',
          duration: '45:23',
          views: 18750,
          date: '2023-12-28',
          category: 'Experimente Paranormale',
          location: 'Locație Secretă',
          featured: false
        },
        {
          id: '5',
          title: 'Castelul Peleș Noaptea - Investigație Paranormală',
          description: 'Prima investigație oficială nocturnă la Castelul Peleș. Fenomene inexplicabile în camerele regale.',
          thumbnail: '/video-thumbs/peles-castle.jpg',
          duration: '3:12:45',
          views: 22100,
          date: '2023-12-20',
          category: 'Castele',
          location: 'Sinaia',
          featured: true
        },
        {
          id: '6',
          title: 'Cimitirul din Săpânța - Legende și Aparițiilor',
          description: 'Investigație în celebrul cimitir vesel din Săpânța, unde localnicii raportează aparitii misterioase.',
          thumbnail: '/video-thumbs/sapanta-cemetery.jpg',
          duration: '1:34:56',
          views: 9870,
          date: '2023-12-15',
          category: 'Cimitire',
          location: 'Săpânța, Maramureș',
          featured: false
        }
      ]
      
      setVideos(mockVideos)
      setFilteredVideos(mockVideos)
      setLoading(false)
    }

    loadVideos()
  }, [])

  // Filtrare și căutare
  useEffect(() => {
    let filtered = videos

    // Filtrare după categorie
    if (selectedCategory !== 'Toate') {
      filtered = filtered.filter(video => video.category === selectedCategory)
    }

    // Căutare
    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sortare
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'views':
          return b.views - a.views
        case 'duration':
          return b.duration.localeCompare(a.duration)
        default:
          return 0
      }
    })

    setFilteredVideos(filtered)
  }, [videos, selectedCategory, searchTerm, sortBy])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Castele': return Building
      case 'Cimitire': return Skull
      case 'Case Abandonate': return Ghost
      case 'Experimente Paranormale': return Eye
      default: return Video
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paranormal-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-ghost-600 rounded-xl flex items-center justify-center ghost-glow">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-paranormal-800">
              Videoclipuri <span className="text-ghost-600">Paranormale</span>
            </h1>
          </div>
          <p className="text-xl text-paranormal-600 max-w-3xl mx-auto">
            Explorează arhiva completă de investigații paranormale. Locuri bântuite, experiențe autentic înfricoșătoare și mistere nerezolvate.
          </p>
        </div>

        {/* Featured Videos */}
        {filteredVideos.some(video => video.featured) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-paranormal-800 mb-6 flex items-center space-x-2">
              <Ghost className="w-6 h-6 text-mystery-600" />
              <span>Investigații Recomandate</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos
                .filter(video => video.featured)
                .slice(0, 3)
                .map(video => (
                  <VideoCard key={video.id} video={video} featured />
                ))
              }
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paranormal-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Caută videoclipuri paranormale..."
                  className="w-full pl-10 pr-4 py-3 border border-paranormal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mystery-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-paranormal-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-mystery-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paranormal-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'duration')}
                className="appearance-none bg-white border border-paranormal-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-mystery-500"
              >
                <option value="date">Cel mai recent</option>
                <option value="views">Cele mai vizualizate</option>
                <option value="duration">Durata</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paranormal-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => {
              const Icon = getCategoryIcon(category)
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-mystery-600 text-white'
                      : 'bg-paranormal-100 text-paranormal-700 hover:bg-paranormal-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-paranormal-600">
            <span className="font-medium">{filteredVideos.length}</span> videoclipuri găsite
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-paranormal-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-paranormal-400" />
            </div>
            <h3 className="text-xl font-bold text-paranormal-600 mb-2">
              Nu s-au găsit videoclipuri
            </h3>
            <p className="text-paranormal-500">
              Încearcă să modifici criteriile de căutare sau filtrele.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideosPage 