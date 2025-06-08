import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plipli9paranormal.com'
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      images: [
        `${baseUrl}/og-image.png`,
        `${baseUrl}/hero-paranormal.jpg`,
        `${baseUrl}/plipli9-photo.jpg`
      ]
    },
    {
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      images: [
        `${baseUrl}/live-thumbnail.jpg`,
        `${baseUrl}/live-chat.png`
      ],
      videos: [
        {
          thumbnail: `${baseUrl}/live-thumb.jpg`,
          title: 'LIVE Paranormal cu Plipli9',
          description: 'Investigații live în locuri bântuite'
        }
      ]
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 0.8,
      images: [`${baseUrl}/videos-gallery.jpg`]
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      images: [`${baseUrl}/events-calendar.jpg`]
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
      images: [`${baseUrl}/shop-products.jpg`]
    }
  ]

  // Categoriile video pentru SEO
  const videoCategories = [
    'castele',
    'cimitire', 
    'case-abandonate',
    'experimente-paranormale',
    'investigatii-live'
  ]

  const categoryPages = videoCategories.map(category => ({
    url: `${baseUrl}/videos/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6
  }))

  const allPages: any[] = [...staticPages, ...categoryPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- 🎃 Plipli9 Paranormal - Sitemap for Search Engines -->
  
  ${allPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
    ${page.images ? page.images.map((img: string) => `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:caption>Plipli9 Paranormal - Investigații în locuri bântuite</image:caption>
    </image:image>`).join('') : ''}
    ${page.videos ? page.videos.map((video: any) => `
    <video:video>
      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${page.url}</video:content_loc>
    </video:video>`).join('') : ''}
  </url>`).join('')}
  
  <!-- Special paranormal investigation pages -->
  <url>
    <loc>${baseUrl}/live/paranormal-investigation</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
  </url>
  
  <url>
    <loc>${baseUrl}/videos/featured</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>
  
  <!-- Contact and info pages -->
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
  </url>
  
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  })
} 