/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_MODE: 'false',
    NEXT_PUBLIC_DEMO_MODE: 'false',
    // Database Cloud - Railway PostgreSQL - HARDCODED
    DATABASE_URL: 'postgresql://postgres:NtTMWwpdqEwadluQVrxtSnbGHOOMGePn@switchyard.proxy.rlwy.net:16053/railway',
    
    // Make.com Webhooks - HARDCODED
    MAKE_PAYMENT_WEBHOOK_URL: 'https://hook.eu2.make.com/ic87oy9mss8xsodyiqtm6r6khnuqdjs8',
    MAKE_LIVE_STARTED_WEBHOOK_URL: 'https://hook.eu1.make.com/placeholder_live_started',
    MAKE_REMINDER_WEBHOOK_URL: 'https://hook.eu1.make.com/placeholder_reminder',
    MAKE_WEBHOOK_SECRET: 'plipli9_paranormal_webhook_secret_2024',
    
    // OpenAI ChatGPT pentru chat widget
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-placeholder-openai-key-here',
    
    // Email & WhatsApp - REAL KEYS
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'SG-placeholder-sendgrid-key-here',
    SENDGRID_FROM_EMAIL: 'noreply@plipli9paranormal.com',
    TWILIO_ACCOUNT_SID: 'ACplaceholder_twilio_sid',
    TWILIO_AUTH_TOKEN: 'placeholder_twilio_token',
    TWILIO_WHATSAPP_FROM: 'whatsapp:+14155238886',
    
    // Stripe (placeholder keys - configurate în ZIUA 2)
    STRIPE_SECRET_KEY: 'sk_live_placeholder_stripe_secret',
    STRIPE_WEBHOOK_SECRET: 'whsec_placeholder_stripe_webhook',
    
    // Site URLs
    NEXT_PUBLIC_SITE_URL: 'https://www.plipli9.com',
    NEXT_PUBLIC_API_URL: 'https://www.plipli9.com/api'
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
      'livepeer.studio',
      'images.unsplash.com',
      'assets.aceternity.com',
      'localhost',
      'plipli9.com',
      'www.plipli9.com'
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

  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health'
      }
    ]
  }
}

module.exports = nextConfig 