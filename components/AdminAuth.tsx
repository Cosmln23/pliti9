'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Shield } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
  title?: string
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children, title = "Admin Dashboard" }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const authToken = localStorage.getItem('plipli9_admin_auth')
    const authTime = localStorage.getItem('plipli9_admin_auth_time')
    
    if (authToken && authTime) {
      const elapsed = Date.now() - parseInt(authTime)
      const oneHour = 60 * 60 * 1000
      
      if (elapsed < oneHour && authToken === 'authenticated') {
        setIsAuthenticated(true)
      }
    }
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'plipli9admin2024'
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('plipli9_admin_auth', 'authenticated')
      localStorage.setItem('plipli9_admin_auth_time', Date.now().toString())
      setPassword('')
    } else {
      setError('Parola incorectă!')
    }
    
    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('plipli9_admin_auth')
    localStorage.removeItem('plipli9_admin_auth_time')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paranormal-900 to-mystery-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-paranormal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-paranormal-600" />
            </div>
            <h1 className="text-2xl font-bold text-paranormal-800 mb-2">🔒 {title}</h1>
            <p className="text-paranormal-600 text-sm">Acces restricționat administrator</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-paranormal-700 mb-2">
                Parola Administrator
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="block w-full px-4 py-3 border border-paranormal-300 rounded-lg focus:ring-2 focus:ring-paranormal-500"
                placeholder="Introduceți parola..."
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !password.trim()}
              className="w-full bg-paranormal-600 hover:bg-paranormal-700 disabled:bg-paranormal-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Verificare...' : 'Accesează Dashboard'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      {children}
    </div>
  )
}

export default AdminAuth 