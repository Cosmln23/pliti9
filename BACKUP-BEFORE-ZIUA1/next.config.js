/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_MODE: 'true',
    NEXT_PUBLIC_DEMO_MODE: 'true'
  },
  experimental: {
    // appDir este activat automat în Next.js 14, nu mai e nevoie să îl specificăm
    serverComponentsExternalPackages: ['@planetscale/database']
  },
  
  // Optimizări pentru streaming video
  images: {
    domains: [
      'cdn.sanity.io',
      'images.unsplash.com',
      'via.placeholder.com',
      'lvpr.tv',
      'livepeer.studio'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers pentru securitate și CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  
  // Webpack pentru optimizări
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimizări pentru video streaming
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig 