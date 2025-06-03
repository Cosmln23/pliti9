import React from 'react'
import Link from 'next/link'
import { 
  Play, 
  Calendar, 
  Video, 
  Zap, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Ghost,
  Skull,
  Eye,
  Moon
} from 'lucide-react'
import ContactSection from '@/components/ContactSection'
import { getSiteSettings, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next/types'

// Metadata dinamic din Sanity
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()
  
  const ogImageUrl = siteSettings?.seo?.ogImage ? urlFor(siteSettings.seo.ogImage)?.url() : null
  
  return {
    title: siteSettings?.seo?.metaTitle || 'Plipli9 Paranormal - Mistere Reale, Locuri Bântuite',
    description: siteSettings?.seo?.metaDescription || 'Alătură-te lui Plipli9 în explorarea celor mai misterioase locuri bântuite din România. LIVE-uri exclusive, investigații paranormale autentice.',
    keywords: siteSettings?.seo?.keywords || ['paranormal', 'fantome', 'bântuit', 'live streaming', 'investigații paranormale', 'România', 'mistere'],
    openGraph: {
      title: siteSettings?.seo?.metaTitle || 'Plipli9 Paranormal',
      description: siteSettings?.seo?.metaDescription || 'Mistere reale, locuri bântuite, LIVE-uri autentice!',
      images: ogImageUrl ? [ogImageUrl] : [],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: siteSettings?.seo?.metaTitle || 'Plipli9 Paranormal',
      description: siteSettings?.seo?.metaDescription || 'Mistere reale, locuri bântuite, LIVE-uri autentice!',
      images: ogImageUrl ? [ogImageUrl] : []
    }
  }
}

// Server Component pentru a obține datele din Sanity
async function HomePage() {
  // Preluăm setările site-ului din Sanity CMS
  const siteSettings = await getSiteSettings()

  // Fallback values dacă Sanity nu răspunde
  const defaultSettings = {
    branding: {
      siteName: 'Plipli9 Paranormal',
      tagline: 'Mistere Reale, Locuri Bântuite'
    },
    heroSection: {
      title: 'Plipli9 Paranormal',
      subtitle: 'Mistere reale, locuri bântuite, LIVE-uri autentice!',
      description: 'Alătură-te în explorarea celor mai misterioase și înfricoșătoare locuri din România. Experiențe paranormale autentice, investigated în timp real.',
      primaryButtonText: 'LIVE Paranormal',
      secondaryButtonText: 'Vezi Videoclipuri'
    },
    aboutSection: {
      title: 'Despre Plipli9',
      motto: 'Trebuie să crezi în paranormal, trebuie să vrai – și cu siguranță implicarea aduce rezultate.'
    }
  }

  // Folosim datele din Sanity sau fallback-ul
  const settings = siteSettings || defaultSettings
  const { branding, heroSection, aboutSection } = settings

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Conectat la Sanity CMS */}
      <section className="relative bg-gradient-to-br from-paranormal-900 via-paranormal-800 to-paranormal-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Hero Background Image din Sanity */}
        {heroSection?.backgroundImage && (
          <div className="absolute inset-0">
            <img 
              src={urlFor(heroSection.backgroundImage)?.url() || ''} 
              alt="Paranormal Background"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-mystery-400 opacity-30">
            <Ghost size={100} />
          </div>
          <div className="absolute bottom-10 right-10 text-mystery-400 opacity-20">
            <Skull size={80} />
          </div>
          <div className="absolute top-1/2 left-1/3 text-mystery-300 opacity-25">
            <Eye size={60} />
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Logo principal din Sanity - centrat și deasupra textului */}
            <div className="flex justify-center mb-6">
              {branding?.logo && (
                <div className="w-32 h-32 rounded-xl flex items-center justify-center mystery-glow overflow-hidden">
                  <img 
                    src={urlFor(branding.logo)?.width(128).height(128).url() || ''} 
                    alt={branding.siteName || 'Plipli9 Paranormal Logo'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!branding?.logo && (
                <div className="w-32 h-32 bg-mystery-600 rounded-xl flex items-center justify-center mystery-glow">
                  <Ghost className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Titlul principal fără logo lângă */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold">
                {heroSection?.title || branding?.siteName || 'Plipli9'} <span className="text-mystery-400 text-glow">Paranormal</span>
              </h1>
            </div>

            {/* Tagline și descriere din Sanity */}
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl font-semibold text-mystery-200 leading-relaxed">
                {branding?.tagline || 'Mistere reale, locuri bântuite,'}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                {heroSection?.subtitle || 'LIVE-uri autentice!'}
              </p>
            </div>

            {/* Descriere din Sanity */}
            <p className="text-xl text-paranormal-200 max-w-3xl mx-auto leading-relaxed">
              {heroSection?.description || 'Alătură-te în explorarea celor mai misterioase și înfricoșătoare locuri din România. Experiențe paranormale autentice, investigated în timp real.'}
            </p>

            {/* CTA Buttons cu texte din Sanity */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/live" className="btn-mystery group flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>{heroSection?.primaryButtonText || 'LIVE Paranormal'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/videos" className="btn-ghost group flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>{heroSection?.secondaryButtonText || 'Vezi Videoclipuri'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Conectat la Sanity CMS */}
      <section className="py-16 bg-paranormal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                {/* Fotografia Plipli9 din Sanity */}
                {aboutSection?.photo ? (
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-mystery-500 mystery-glow">
                    <img 
                      src={urlFor(aboutSection.photo)?.width(80).height(80).url() || ''} 
                      alt="Plipli9"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-mystery-600 rounded-full flex items-center justify-center mx-auto mb-6 mystery-glow">
                    <Ghost className="w-10 h-10 text-white" />
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-paranormal-800 mb-4">
                  {aboutSection?.title || 'Despre Plipli9'}
                </h2>
              </div>
              
              {/* Povestea din Sanity cu Rich Text */}
              <div className="prose prose-lg max-w-none text-paranormal-700 leading-relaxed space-y-6">
                {aboutSection?.story ? (
                  <PortableText 
                    value={aboutSection.story}
                    components={{
                      block: {
                        normal: ({children}) => <p className="mb-4">{children}</p>,
                        h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                        h2: ({children}) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                        blockquote: ({children}) => (
                          <div className="bg-mystery-50 p-6 rounded-xl border-l-4 border-mystery-500 my-6">
                            <div className="text-mystery-800 italic">{children}</div>
                          </div>
                        )
                      },
                      marks: {
                        strong: ({children}) => <strong className="font-bold">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>
                      }
                    }}
                  />
                ) : (
                  // Fallback pentru conținutul static existent
                  <>
                    <p>
                      <strong>Peste 100 de locații</strong>, atât în România cât și în străinătate, am explorat de-a lungul anilor, totul dintr-o pasiune nestinsă pentru paranormal și o curiozitate pe care știința n-a reușit niciodată să o stingă. Plipli9 a prins viață în 2016, condus de dorința de a găsi răspunsuri acolo unde nimeni nu le caută.
                    </p>
                    
                    <p>
                      Totul a început cu <strong>Pădurea Hoia Baciu</strong> – locul care, de mic copil, mi-a aprins imaginația cu povești și legende misterioase. În acea pădure, am simțit pentru prima dată că lumea pe care o știm ascunde lucruri neîmpărtășite – sunete venite de nicăieri, apariții inexplicabile și senzația clară că ești urmărit de ceva invizibil.
                    </p>
                    
                    <div className="bg-mystery-50 p-6 rounded-xl border-l-4 border-mystery-500">
                      <p className="text-mystery-800 italic">
                        O întâlnire stranie mi-a schimbat viața pentru totdeauna: într-o piață din județul Cluj, o femeie în vârstă s-a apropiat de mine și mi-a spus, fără să mă cunoască:<br/>
                        <strong>"Băiete, când vei merge în pădure, să nu te uiți la copacul 39."</strong><br/>
                        De atunci, totul a luat o întorsătură ciudată – numărul 39 a apărut peste tot, deși, ani la rând, n-am reușit să-i aflu adevărata semnificație.
                      </p>
                    </div>
                    
                    <p>
                      Pe parcursul acestor ani, am adunat dovezi și am trăit experiențe unice, culminând cu <strong>păpușa Matilda</strong> – cumpărată din Canada, blestemată de o femeie care și-a pierdut copilul și a încercat să își răzbune suferința printr-un ritual întunecat. Matilda e o păpușă unică și bântuită, iar povestea ei e doar una dintre multele enigme care definesc Plipli9.
                    </p>
                    
                    <p>
                      Plipli9 a început din dorința de a demonstra că paranormalul există cu adevărat – o pasiune născută din poveștile copilăriei și întâlniri misterioase care m-au urmărit toată viața. Eu sunt Plipli9 – un căutător de adevăruri ascunse, un investigator care îndrăznește să pășească acolo unde alții doar povestesc.
                    </p>
                  </>
                )}
                
                {/* Motto din Sanity */}
                <div className="text-center mt-8 p-6 bg-paranormal-900 rounded-xl">
                  <div className="flex items-center justify-center mb-4">
                    <Moon className="w-8 h-8 text-mystery-400 mr-3" />
                    <p className="text-xl font-bold text-white">
                      {aboutSection?.motto || 'Trebuie să crezi în paranormal, trebuie să vrei – și cu siguranță implicarea aduce rezultate.'}
                    </p>
                  </div>
                  <p className="text-mystery-200 italic">
                    Aceasta e povestea Plipli9 – un drum misterios, care îți arată că dincolo de realitate se ascund adevăruri mai adânci decât ne putem imagina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-paranormal-800 mb-12">
            Ce spun exploratorii paranormali
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-paranormal-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-paranormal-700 mb-4">
                "Cel mai autentic creator paranormal! LIVE-urile sunt incredibile, simți că ești acolo cu el."
              </p>
              <div className="font-medium text-paranormal-800">Alexandra M.</div>
            </div>
            
            <div className="bg-paranormal-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-paranormal-700 mb-4">
                "M-am speriat de câteva ori, dar nu pot să nu mă uit! Conținut paranormal de calitate."
              </p>
              <div className="font-medium text-paranormal-800">Marius R.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secțiunea Contact integrată */}
      <ContactSection siteSettings={settings} />
    </div>
  )
}

// Configurare pentru revalidare automată
export const revalidate = 60 // Revalidează la 60 secunde

export default HomePage 