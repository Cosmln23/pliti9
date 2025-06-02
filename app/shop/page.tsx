'use client'

import React, { useState } from 'react'
import { ShoppingBag, Mail, Bell, Gift, Shirt, Coffee } from 'lucide-react'
import ComingSoon from '@/components/ComingSoon'

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-paranormal-50 pt-8">
      <ComingSoon 
        title="Magazin Paranormal"
        subtitle="În curând vei putea achiziționa produse exclusive Plipli9 Paranormal"
        features={[
          'Tricouri și hanorace cu design paranormal',
          'Echipament pentru investigații',
          'Cărți și ghiduri paranormale',
          'Accesorii misterioase'
        ]}
      />
    </div>
  )
}

export default ShopPage 