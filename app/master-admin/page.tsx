'use client'

import React from 'react'
import AdminAuth from '@/components/AdminAuth'
import Link from 'next/link'
import { 
  BarChart3, 
  Settings, 
  Video, 
  MessageCircle, 
  Shield,
  ChevronRight,
  Clock,
  Smartphone
} from 'lucide-react'

const MasterAdminDashboard = () => {
  const adminTools = [
    {
      category: "📊 Analytics & Monitoring",
      tools: [
        {
          name: "Analytics Dashboard",
          description: "Statistici live: revenue, users, engagement",
          url: "/analytics-dashboard",
          icon: BarChart3,
          color: "from-blue-500 to-blue-600",
          features: ["Real-time data", "Auto-refresh", "System health"]
        },
        {
          name: "Admin Dashboard",
          description: "Control general: live sessions, coduri acces",
          url: "/admin",
          icon: Settings,
          color: "from-purple-500 to-purple-600",
          features: ["Live control", "Access codes", "Status monitoring"]
        }
      ]
    },
    {
      category: "🎥 Streaming & Content",
      tools: [
        {
          name: "Streamer Dashboard",
          description: "Control live streaming, viewer stats",
          url: "/streamer",
          icon: Video,
          color: "from-red-500 to-red-600",
          features: ["Stream control", "Viewer count", "Duration tracking"]
        }
      ]
    },
    {
      category: "💬 Chat & Communication",
      tools: [
        {
          name: "Chat Management",
          description: "Monitorizare și moderare chat live",
          url: "/chat",
          icon: MessageCircle,
          color: "from-green-500 to-green-600",
          features: ["Live messages", "User management", "Moderation"]
        },
        {
          name: "Mobile Chat",
          description: "Interface chat optimizat pentru mobil",
          url: "/mobile-chat",
          icon: Smartphone,
          color: "from-teal-500 to-teal-600",
          features: ["Touch optimized", "Responsive design", "Quick access"]
        }
      ]
    }
  ]

  return (
    <AdminAuth title="Master Admin Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-paranormal-50 to-mystery-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="bg-gradient-to-r from-paranormal-600 to-mystery-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-paranormal-800 mb-4">
                🎮 Master Admin Dashboard
              </h1>
              <p className="text-xl text-paranormal-600 mb-6">
                Control central pentru întreaga platformă Plipli9 Paranormal
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-800">5</div>
                  <div className="text-sm text-blue-600">Admin Tools</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-800">24/7</div>
                  <div className="text-sm text-green-600">Monitoring</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-800">100%</div>
                  <div className="text-sm text-purple-600">Protected</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-800">Live</div>
                  <div className="text-sm text-orange-600">Status</div>
                </div>
              </div>
            </div>
          </div>

          {adminTools.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-paranormal-800 mb-6">
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => {
                  const IconComponent = tool.icon
                  return (
                    <div key={toolIndex} className="group">
                      <Link href={tool.url}>
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                          <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                            <div className="flex items-center justify-between">
                              <IconComponent className="w-8 h-8" />
                              <ChevronRight className="w-5 h-5 opacity-75 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-paranormal-800 mb-2">
                              {tool.name}
                            </h3>
                            <p className="text-paranormal-600 text-sm mb-4">
                              {tool.description}
                            </p>
                            <div className="space-y-1">
                              {tool.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center text-xs text-paranormal-500">
                                  <div className="w-1.5 h-1.5 bg-paranormal-400 rounded-full mr-2"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-paranormal-600">
              <Clock className="w-5 h-5" />
              <span>Ultima actualizare: {new Date().toLocaleString('ro-RO')}</span>
            </div>
            <p className="text-paranormal-500 text-sm mt-2">
              Toate instrumentele sunt protejate cu autentificare și monitorizate 24/7
            </p>
          </div>
        </div>
      </div>
    </AdminAuth>
  )
}

export default MasterAdminDashboard 