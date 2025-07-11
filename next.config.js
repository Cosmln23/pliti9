/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_MODE: 'false',
    NEXT_PUBLIC_DEMO_MODE: 'false',
    // Database Cloud - Railway PostgreSQL - SECURE
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/plipli9_local',
    
    // Make.com Webhooks - SECURE
    MAKE_PAYMENT_WEBHOOK_URL: process.env.MAKE_PAYMENT_WEBHOOK_URL || 'https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n',
    MAKE_LIVE_STARTED_WEBHOOK_URL: process.env.MAKE_LIVE_STARTED_WEBHOOK_URL || 'https://hook.eu1.make.com/placeholder_live_started',
    MAKE_REMINDER_WEBHOOK_URL: process.env.MAKE_REMINDER_WEBHOOK_URL || 'https://hook.eu1.make.com/placeholder_reminder',
    MAKE_WEBHOOK_SECRET: process.env.MAKE_WEBHOOK_SECRET || 'dev_webhook_secret_2024',
    
    // OpenAI ChatGPT pentru chat widget
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-placeholder-openai-key-here',
    
    // Email & WhatsApp - REAL KEYS
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'SG-placeholder-sendgrid-key-here',
    SENDGRID_FROM_EMAIL: 'noreply@plipli9paranormal.com',
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'AC_placeholder_twilio_sid',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'placeholder_twilio_token',
    TWILIO_WHATSAPP_FROM: 'whatsapp:+14155238886',
    
    // Stripe (ENVIRONMENT VARIABLES - NO HARDCODED KEYS)
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_stripe_secret',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder_stripe_webhook',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_stripe_publishable',
    
    // Site URLs
    NEXT_PUBLIC_SITE_URL: 'https://www.plipli9.com',
    NEXT_PUBLIC_API_URL: 'https://www.plipli9.com/api'
  },
  
  experimental: {
    // appDir este activat automat în Next.js 14, nu mai e nevoie să îl specificăm
    serverComponentsExternalPackages: ['@planetscale/database']
  },

  // Memory leak prevention compatible cu sistemul de curățare
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Cleanup rapid pentru memory safety
    pagesBufferLength: 2, // Limit pages în memory
  },
  
  // Optimizare fără cache problematic
  swcMinify: true,
  
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