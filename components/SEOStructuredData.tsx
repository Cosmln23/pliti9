'use client'

import React from 'react'

interface SEOStructuredDataProps {
  type: 'homepage' | 'live' | 'video' | 'event' | 'article'
  data?: {
    title?: string
    description?: string
    url?: string
    image?: string
    date?: string
    location?: string
    price?: number
    videoUrl?: string
    duration?: string
  }
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ type, data = {} }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plipli9paranormal.com'
  
  // Organization Schema (pentru toate paginile)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Plipli9 Paranormal",
    "alternateName": "Plipli9",
    "description": "Creator de conținut paranormal cu investigații live în locuri bântuite din România",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "image": `${baseUrl}/og-image.png`,
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "name": "România"
    },
    "founder": {
      "@type": "Person",
      "name": "Plipli9",
      "description": "Investigator paranormal și creator de conținut"
    },
    "sameAs": [
      "https://tiktok.com/@plipli9paranormal",
      "https://instagram.com/plipli9paranormal", 
      "https://youtube.com/@plipli9paranormal"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@plipli9paranormal.com",
      "availableLanguage": ["Romanian"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "România"
    },
    "knowsAbout": [
      "investigații paranormale",
      "locuri bântuite", 
      "fenomene supranaturale",
      "streaming live",
      "România mistică"
    ]
  }

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Plipli9 Paranormal",
    "url": baseUrl,
    "description": "Site oficial Plipli9 Paranormal - investigații live în locuri bântuite",
    "publisher": {
      "@type": "Organization", 
      "name": "Plipli9 Paranormal"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "ro"
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": baseUrl
      }
    ]
  }

  // Schemas specifice pe tipuri de pagină
  let specificSchemas: any[] = []

  if (type === 'homepage') {
    // Service Schema pentru homepage
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Investigații Paranormale Live",
      "description": "LIVE streaming în locuri bântuite cu investigații paranormale autentice",
      "provider": {
        "@type": "Organization",
        "name": "Plipli9 Paranormal"
      },
      "areaServed": {
        "@type": "Country", 
        "name": "România"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pachete Live Paranormal",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Live Individual"
            },
            "price": "25",
            "priceCurrency": "RON"
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Pachet 3 Live-uri"
            },
            "price": "60",
            "priceCurrency": "RON"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Acces Lunar"
            },
            "price": "150",
            "priceCurrency": "RON"
          }
        ]
      }
    }
    specificSchemas.push(serviceSchema)
  }

  if (type === 'live') {
    // VideoObject + LiveStream Schema
    const liveStreamSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject", 
      "name": data.title || "LIVE Paranormal cu Plipli9",
      "description": data.description || "Investigație paranormală live în locuri bântuite",
      "thumbnailUrl": data.image || `${baseUrl}/live-thumbnail.jpg`,
      "uploadDate": new Date().toISOString(),
      "publication": {
        "@type": "BroadcastEvent",
        "isLiveBroadcast": true,
        "startDate": new Date().toISOString(),
        "endDate": new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() // +3 ore
      },
      "publisher": {
        "@type": "Organization",
        "name": "Plipli9 Paranormal"
      },
      "contentLocation": {
        "@type": "Place",
        "name": data.location || "Locație Misterioare, România"
      },
      "genre": ["Paranormal", "Horror", "Documentary", "Live Streaming"],
      "inLanguage": "ro"
    }

    // Event Schema pentru live
    const eventSchema = {
      "@context": "https://schema.org", 
      "@type": "Event",
      "name": data.title || "LIVE Investigație Paranormală",
      "description": data.description || "Explorare în timp real a fenomenelor paranormale",
      "startDate": new Date().toISOString(),
      "endDate": new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "url": `${baseUrl}/live`
      },
      "image": data.image || `${baseUrl}/live-event.jpg`,
      "performer": {
        "@type": "Person",
        "name": "Plipli9"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Plipli9 Paranormal"
      },
      "offers": {
        "@type": "Offer",
        "price": data.price || 25,
        "priceCurrency": "RON",
        "availability": "https://schema.org/InStock"
      }
    }
    
    specificSchemas.push(liveStreamSchema, eventSchema)
    
    // Breadcrumb pentru live
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem",
      "position": 2, 
      "name": "LIVE Paranormal",
      "item": `${baseUrl}/live`
    })
  }

  if (type === 'video') {
    // VideoObject Schema
    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": data.title || "Videoclip Paranormal",
      "description": data.description || "Investigație paranormală înregistrată",
      "thumbnailUrl": data.image || `${baseUrl}/video-thumbnail.jpg`,
      "uploadDate": data.date || new Date().toISOString(),
      "duration": data.duration || "PT15M", // 15 minute default
      "embedUrl": data.videoUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Plipli9 Paranormal"
      },
      "genre": ["Paranormal", "Horror", "Documentary"],
      "inLanguage": "ro"
    }
    specificSchemas.push(videoSchema)
    
    // Breadcrumb pentru video
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem", 
      "position": 2,
      "name": "Videoclipuri",
      "item": `${baseUrl}/videos`
    })
  }

  // Combină toate schemas
  const allSchemas = [
    organizationSchema,
    websiteSchema, 
    breadcrumbSchema,
    ...specificSchemas
  ]

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  )
}

export default SEOStructuredData 