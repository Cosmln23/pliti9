import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Plipli9 Paranormal - Mistere Reale, Locuri Bântuite',
    short_name: 'Plipli9 Paranormal', 
    description: 'Alătură-te lui Plipli9 în explorarea celor mai misterioase locuri bântuite din România. LIVE-uri exclusive, investigații paranormale autentice.',
    
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#1f1b2e',
    theme_color: '#6B46C1',
    
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png', 
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192', 
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    
    categories: ['entertainment', 'lifestyle'],
    scope: '/',
    lang: 'ro'
  }
} 