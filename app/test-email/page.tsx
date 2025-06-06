'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    setTesting(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-webhook', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🧪 <span className="text-purple-400">Test Email</span>
            </h1>
            <p className="text-slate-300">
              Testează sistemul de email fără să plătești
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-400 mb-3">📧 Detalii Test:</h3>
            <div className="space-y-2 text-slate-300">
                             <p><span className="text-purple-400">Email:</span> scinterim09@gmail.com</p>
              <p><span className="text-purple-400">Cod:</span> PLITEST1</p>
              <p><span className="text-purple-400">Valabilitate:</span> 8 ore</p>
              <p><span className="text-purple-400">URL Live:</span> plipli9.com/live</p>
            </div>
          </div>

          {/* Test Button */}
          <div className="text-center mb-6">
            <button
              onClick={testEmail}
              disabled={testing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              {testing ? (
                <>
                  <span className="animate-spin inline-block mr-2">🔄</span>
                  Se trimite...
                </>
              ) : (
                <>
                  📨 Trimite Email Test
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className={`rounded-xl p-6 ${result.success ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
              <h3 className={`text-xl font-semibold mb-3 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? '✅ Succes!' : '❌ Eroare!'}
              </h3>
              
              {result.success ? (
                <div className="space-y-2 text-slate-300">
                  <p className="text-green-400 font-semibold">{result.message}</p>
                                     <p>🎯 <strong>Email trimis la:</strong> scinterim09@gmail.com</p>
                  <p>🔑 <strong>Cod de acces:</strong> PLITEST1</p>
                  <p>⏰ <strong>Status:</strong> {result.debug_info.friendly_text}</p>
                  
                  <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-yellow-400 font-medium">📱 Next Steps:</p>
                    <ol className="list-decimal list-inside text-sm text-slate-300 mt-2 space-y-1">
                                             <li>Verifică inbox-ul la scinterim09@gmail.com</li>
                      <li>Caută email-ul de la Plipli9 Paranormal</li>
                      <li>Testează codul PLITEST1 pe site</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-red-300">
                  <p><strong>Eroare:</strong> {result.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              După test, mergi la <a href="/live" className="text-purple-400 hover:underline">plipli9.com/live</a> și folosește codul PLITEST1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 