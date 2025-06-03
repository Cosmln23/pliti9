'use client'

import React from 'react'
import { Ghost } from 'lucide-react'

/**
 * LOGO PLACEHOLDER - EDITABIL
 * 
 * Pentru a înlocui cu logo-ul real:
 * 1. Adaugă imaginea logo-ului în folderul /public (ex: /public/logo.png)
 * 2. Înlocuiește conținutul acestei componente cu:
 *    <img src="/logo.png" alt="Plipli9 Paranormal" className="h-10 w-auto" />
 * 3. Sau folosește Next.js Image component pentru optimizare:
 *    <Image src="/logo.png" alt="Plipli9 Paranormal" width={40} height={40} />
 */

const LogoPlaceholder = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Logo temporar cu iconă Ghost */}
      <div className="w-10 h-10 bg-mystery-600 rounded-lg flex items-center justify-center mystery-glow">
        <Ghost className="w-6 h-6 text-white" />
      </div>
      
      {/* Text alternative pentru logo */}
      <span className="sr-only">Plipli9 Paranormal Logo</span>
    </div>
  )
}

// Versiune alternativă cu text (decomentează pentru a folosi text în loc de iconă)
/*
const LogoPlaceholder = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-mystery-600 px-3 py-2 rounded-lg mystery-glow">
        <span className="text-white font-bold text-lg">P9</span>
      </div>
    </div>
  )
}
*/

export default LogoPlaceholder 