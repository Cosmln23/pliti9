import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pntbd5au'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

// Configure image URL builder
const builder = imageUrlBuilder(client)

// Helper function pentru a prelua setările site-ului
export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{
    branding{
      logo,
      siteName,
      tagline
    },
    heroSection{
      title,
      subtitle,
      description,
      backgroundImage,
      primaryButtonText,
      secondaryButtonText
    },
    liveSettings{
      schedule,
      nextLiveDate,
      nextLiveLocation,
      livePricing{
        individual,
        package3,
        monthly
      },
      liveStatus
    },
    aboutSection{
      title,
      story,
      photo,
      motto
    },
    contact{
      email,
      instagram,
      tiktok,
      youtube,
      phone
    },
    theme{
      primaryColor,
      secondaryColor,
      ghostColor
    },
    chatbot{
      welcomeMessage,
      eventsMessage,
      errorMessage
    },
    statistics{
      explorers,
      locations,
      liveStreams,
      hoursOfMystery
    },
    seo{
      metaTitle,
      metaDescription,
      keywords,
      ogImage
    }
  }`
  
  try {
    const settings = await client.fetch(query)
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

// Helper function pentru imagini - Fixed
export function urlFor(source) {
  if (!source) return null
  return builder.image(source)
} 