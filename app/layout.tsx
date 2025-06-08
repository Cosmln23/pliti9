import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import SEOStructuredData from '@/components/SEOStructuredData'
import CanonicalURL from '@/components/CanonicalURL'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { getSiteSettings, urlFor } from '@/lib/sanity'

// Cache bust: Force rebuild for expand button + Twitch chat styling

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.plipli9.com'),
  title: 'Plipli9 Paranormal - Mistere Reale, Locuri Bântuite',
  description: 'Alătură-te lui Plipli9 în explorarea celor mai misterioase locuri bântuite din România. LIVE-uri exclusive, investigații paranormale autentice și experiențe de neuitat.',
  keywords: 'paranormal, fantome, bântuit, live streaming, investigații paranormale, Romania, mistere',
  authors: [{ name: 'Plipli9 Paranormal' }],
  creator: 'Plipli9 Paranormal',
  publisher: 'Plipli9 Paranormal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Plipli9 Paranormal - Mistere Reale, Locuri Bântuite',
    description: 'LIVE-uri paranormale exclusive cu Plipli9. Experiențe autentice în locurile cele mai bântuite.',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Plipli9 Paranormal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plipli9 Paranormal - Mistere Reale',
    description: 'LIVE-uri paranormale exclusive și investigații în locuri bântuite',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // De înlocuit cu codul real
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Preluăm setările pentru navbar
  const siteSettings = await getSiteSettings()
  const logoUrl = siteSettings?.branding?.logo ? urlFor(siteSettings.branding.logo)?.width(40).height(40).url() : undefined
  const siteName = siteSettings?.branding?.siteName || 'Plipli9 Paranormal'

  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Preload important fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Viewport meta pentru responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Canonical URL */}
        <CanonicalURL />
        
        {/* Enhanced SEO Structured Data */}
        <SEOStructuredData type="homepage" />
        
        {/* Schema.org pentru SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Plipli9 Paranormal",
              "description": "Creator de conținut paranormal cu LIVE-uri exclusive",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://plipli9paranormal.com",
              "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://plipli9paranormal.com"}/logo.png`,
              "sameAs": [
                process.env.TIKTOK_URL || "https://tiktok.com/@plipli9paranormal",
                process.env.INSTAGRAM_URL || "https://instagram.com/plipli9paranormal",
                process.env.YOUTUBE_URL || "https://youtube.com/@plipli9paranormal"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-paranormal-50 font-paranormal antialiased">
        <AnalyticsProvider>
          {/* Layout principal cu navbar fix sus */}
          <div className="flex flex-col min-h-screen">
            {/* Navbar fix în partea de sus */}
            <Navbar logoUrl={logoUrl} siteName={siteName} />
            
            {/* Conținutul principal cu padding pentru navbar */}
            <main className="flex-1 pt-16">
              {children}
            </main>
            
            {/* Footer */}
            <Footer siteSettings={siteSettings} />
          </div>
          
          {/* Chat Widget fix jos-stânga pe toate paginile */}
          <ChatWidget />
        </AnalyticsProvider>
        
        {/* Script pentru analytics (Google Analytics sau similar) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
} 