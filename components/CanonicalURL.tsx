'use client'

import { usePathname } from 'next/navigation'

interface CanonicalURLProps {
  customUrl?: string
}

const CanonicalURL: React.FC<CanonicalURLProps> = ({ customUrl }) => {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plipli9paranormal.com'
  
  // Construiește URL-ul canonical
  const canonicalUrl = customUrl || `${baseUrl}${pathname}`
  
  // Curăță URL-ul (elimină parametri de query unde nu sunt necesari)
  const cleanUrl = canonicalUrl.split('?')[0].split('#')[0]
  
  return (
    <link rel="canonical" href={cleanUrl} />
  )
}

export default CanonicalURL 