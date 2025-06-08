'use client'

import React, { useState, useEffect } from 'react'
import AdminAuth from '@/components/AdminAuth'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Eye, 
  MessageCircle, 
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'

interface AnalyticsData {
  live: {
    isActive: boolean
    viewerCount: number
    sessionDuration: number
    chatMessages: number
    location: string
  }
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    currency: string
  }
  users: {
    activeNow: number
    activeToday: number
    totalCodesSold: number
    conversionRate: string
  }
  systemHealth: {
    database: string
    streaming: string
    payments: string
    notifications: string
    uptime: string
  }
  topEvents: Array<{
    event: string
    count: number
  }>
  lastUpdated: string
}

const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics/realtime')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
      setError('')
      setLastRefresh(new Date())
      
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Nu s-au putut încărca datele analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchAnalytics, 30000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const formatCurrency = (amount: number, currency: string = 'RON') => {
    return `${amount.toFixed(0)} ${currency}`
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <Pause className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-paranormal-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paranormal-600 mx-auto mb-4"></div>
          <p className="text-paranormal-600">Se încarcă analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminAuth title="Analytics Dashboard">
      <div className="min-h-screen bg-paranormal-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-paranormal-800 mb-2 flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-paranormal-600" />
              <span>Analytics Dashboard</span>
            </h1>
            <p className="text-paranormal-600">
              Monitorizare în timp real - Plipli9 Paranormal
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={async () => {
                try {
                  setLoading(true)
                  const response = await fetch('/api/system/total-control', { method: 'POST' })
                  const systemData = await response.json()
                  console.log('🚀 SISTEM CONTROL TOTAL ACTIVAT:', systemData)
                  alert(`🚀 CONTROL TOTAL SISTEM ACTIVAT!\n\nStatus: ${systemData.overallStatus.toUpperCase()}\nSiguranta: ${systemData.securityLevel.toUpperCase()}\nUtilizatori activi: ${systemData.activeUsers}\n\nVerifica consola pentru detalii complete!`)
                  await fetchAnalytics()
                } catch (error) {
                  console.error('Eroare sistem control:', error)
                  alert('❌ Eroare la activarea sistemului de control!')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 hover:shadow-red-500/25 disabled:opacity-50 border-2 border-red-400"
            >
              🚀 CONTROL TOTAL SISTEM
            </button>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="p-2 bg-paranormal-100 text-paranormal-700 rounded-lg hover:bg-paranormal-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="text-sm text-paranormal-600">
              Ultima actualizare: {lastRefresh.toLocaleTimeString('ro-RO')}
            </div>
          </div>
        </div>

        {data && (
          <>
            {/* Live Stream Status */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-paranormal-800 flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-red-500" />
                  <span>Status LIVE Stream</span>
                </h2>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  data.live.isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    data.live.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span>{data.live.isActive ? 'LIVE ACUM' : 'OFFLINE'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-800">{data.live.viewerCount}</div>
                      <div className="text-sm text-red-600">Spectatori</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-800">{data.live.sessionDuration}m</div>
                      <div className="text-sm text-blue-600">Durată</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-800">{data.live.chatMessages}</div>
                      <div className="text-sm text-green-600">Mesaje Chat</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="text-lg font-bold text-purple-800">{data.live.location}</div>
                      <div className="text-sm text-purple-600">Locația</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Revenue */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-paranormal-800 mb-4 flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <span>Venituri</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">Astăzi</span>
                    <span className="text-2xl font-bold text-green-800">
                      {formatCurrency(data.revenue.today, data.revenue.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Săptămâna aceasta</span>
                    <span className="text-xl font-bold text-blue-800">
                      {formatCurrency(data.revenue.thisWeek, data.revenue.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Users */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-paranormal-800 mb-4 flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  <span>Utilizatori</span>
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">{data.users.activeNow}</div>
                    <div className="text-sm text-blue-600">Activi acum</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">{data.users.activeToday}</div>
                    <div className="text-sm text-green-600">Activi astăzi</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{data.users.totalCodesSold}</div>
                    <div className="text-sm text-purple-600">Coduri vândute</div>
                  </div>
                  
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">{data.users.conversionRate}</div>
                    <div className="text-sm text-yellow-600">Rata conversie</div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-paranormal-800 mb-4 flex items-center space-x-2">
                <Activity className="w-6 h-6 text-green-500" />
                <span>System Health</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-paranormal-600">Database</span>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(data.systemHealth.database)}
                    <span className="text-sm font-medium">{data.systemHealth.database}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-paranormal-600">Streaming</span>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(data.systemHealth.streaming)}
                    <span className="text-sm font-medium">{data.systemHealth.streaming}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-paranormal-600">Payments</span>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(data.systemHealth.payments)}
                    <span className="text-sm font-medium">{data.systemHealth.payments}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="text-green-700 font-medium">Uptime</span>
                  <span className="text-green-800 font-bold">{data.systemHealth.uptime}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </AdminAuth>
  )
}

export default AnalyticsDashboard 