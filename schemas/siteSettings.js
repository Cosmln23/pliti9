export default {
  name: 'siteSettings',
  title: '⚙️ Setări Site Plipli9 Paranormal',
  type: 'document',
  icon: () => '👻',
  
  fields: [
    // LOGO ȘI BRANDING
    {
      title: '🎭 Logo și Branding',
      name: 'branding',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Logo Principal',
          name: 'logo',
          type: 'image',
          description: 'Logo-ul principal al site-ului (recomandată dimensiunea: 200x200px)',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip', 'palette']
          }
        },
        {
          title: 'Nume Site',
          name: 'siteName',
          type: 'string',
          initialValue: 'Plipli9 Paranormal'
        },
        {
          title: 'Tagline',
          name: 'tagline',
          type: 'string',
          initialValue: 'Mistere Reale, Locuri Bântuite'
        }
      ]
    },

    // HERO SECTION
    {
      title: '🌟 Hero Section - Prima Impresie',
      name: 'heroSection',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Titlu Principal',
          name: 'title',
          type: 'string',
          initialValue: 'Plipli9 Paranormal'
        },
        {
          title: 'Subtitlu',
          name: 'subtitle',
          type: 'string',
          initialValue: 'Mistere reale, locuri bântuite, LIVE-uri autentice!'
        },
        {
          title: 'Descriere',
          name: 'description',
          type: 'text',
          rows: 3,
          initialValue: 'Alătură-te în explorarea celor mai misterioase și înfricoșătoare locuri din România. Experiențe paranormale autentice, investigate în timp real.'
        },
        {
          title: 'Imagine de Fundal Hero',
          name: 'backgroundImage',
          type: 'image',
          description: 'Imagine de fundal pentru secțiunea hero (recomandată: 1920x1080px)',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip', 'palette']
          }
        },
        {
          title: 'Text Buton Principal',
          name: 'primaryButtonText',
          type: 'string',
          initialValue: 'LIVE Paranormal'
        },
        {
          title: 'Text Buton Secundar',
          name: 'secondaryButtonText',
          type: 'string',
          initialValue: 'Vezi Videoclipuri'
        }
      ]
    },

    // LIVE STREAMS
    {
      title: '📡 Setări Live Streams',
      name: 'liveSettings',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Program Live-uri',
          name: 'schedule',
          type: 'string',
          initialValue: 'În fiecare weekend la ora 22:00'
        },
        {
          title: 'Data Următorul Live',
          name: 'nextLiveDate',
          type: 'datetime',
          description: 'Selectează data și ora pentru următorul live paranormal'
        },
        {
          title: 'Locația Următorul Live',
          name: 'nextLiveLocation',
          type: 'string',
          description: 'De ex: Castelul Bran, Pădurea Hoia Baciu, etc.',
          placeholder: 'Se anunță cu 24h înainte...'
        },
        {
          title: 'Prețuri Live',
          name: 'livePricing',
          type: 'object',
          fields: [
            {
              title: 'Live Individual (LEI)',
              name: 'individual',
              type: 'number',
              initialValue: 25
            },
            {
              title: 'Pachet 3 Live-uri (LEI)',
              name: 'package3',
              type: 'number',
              initialValue: 60
            },
            {
              title: 'Acces Lunar (LEI)',
              name: 'monthly',
              type: 'number',
              initialValue: 150
            }
          ]
        },
        {
          title: 'Status Live',
          name: 'liveStatus',
          type: 'string',
          options: {
            list: [
              { title: '🔴 LIVE ACUM', value: 'live' },
              { title: '🟡 În curând', value: 'upcoming' },
              { title: '⚫ Offline', value: 'offline' }
            ]
          },
          initialValue: 'offline'
        }
      ]
    },

    // DESPRE PLIPLI9
    {
      title: '👤 Despre Plipli9',
      name: 'aboutSection',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Titlu Secțiune',
          name: 'title',
          type: 'string',
          initialValue: 'Despre Plipli9'
        },
        {
          title: 'Povestea Plipli9',
          name: 'story',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Povestea completă despre Plipli9, Pădurea Hoia Baciu, copacul 39, păpușa Matilda, etc.'
        },
        {
          title: 'Fotografia Plipli9',
          name: 'photo',
          type: 'image',
          description: 'Fotografia principală a lui Plipli9',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip', 'palette']
          }
        },
        {
          title: 'Motto Personal',
          name: 'motto',
          type: 'string',
          initialValue: 'Trebuie să crezi în paranormal, trebuie să vrei – și cu siguranță implicarea aduce rezultate.'
        }
      ]
    },

    // CONTACT
    {
      title: '📞 Informații Contact',
      name: 'contact',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Email Principal',
          name: 'email',
          type: 'string',
          validation: Rule => Rule.email(),
          initialValue: 'contact@plipli9paranormal.com'
        },
        {
          title: 'Instagram Handle',
          name: 'instagram',
          type: 'string',
          initialValue: '@plipli9paranormal'
        },
        {
          title: 'TikTok Handle',
          name: 'tiktok',
          type: 'string',
          initialValue: '@plipli9paranormal'
        },
        {
          title: 'YouTube Channel',
          name: 'youtube',
          type: 'string',
          initialValue: '@plipli9paranormal'
        },
        {
          title: 'Telefon/WhatsApp',
          name: 'phone',
          type: 'string',
          description: 'Pentru notificări automatizate'
        }
      ]
    },

    // TEMA ȘI CULORI
    {
      title: '🎨 Tema și Culori Site',
      name: 'theme',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          title: 'Culoare Primară (Paranormal)',
          name: 'primaryColor',
          type: 'color',
          options: {
            disableAlpha: true
          },
          initialValue: { hex: '#6B46C1' }
        },
        {
          title: 'Culoare Secundară (Mysttery)',
          name: 'secondaryColor',
          type: 'color',
          options: {
            disableAlpha: true
          },
          initialValue: { hex: '#EC4899' }
        },
        {
          title: 'Culoare Ghost',
          name: 'ghostColor',
          type: 'color',
          options: {
            disableAlpha: true
          },
          initialValue: { hex: '#10B981' }
        }
      ]
    },

    // MESAJE CHATBOT
    {
      title: '🤖 Mesaje Chatbot AI',
      name: 'chatbot',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          title: 'Mesaj de Bun Venit',
          name: 'welcomeMessage',
          type: 'text',
          rows: 3,
          initialValue: 'Salut! Sunt spiritul virtual al lui Plipli9! 👻 Te pot ajuta cu întrebări despre LIVE-urile paranormale, evenimente sau orice mistere dorești să discuți!'
        },
        {
          title: 'Mesaj pentru Evenimente',
          name: 'eventsMessage',
          type: 'text',
          rows: 3,
          initialValue: 'Pentru toate evenimentele paranormale actuale ale lui Plipli9, verifică secțiunea "Evenimente" din meniul de sus! 🎪'
        },
        {
          title: 'Mesaj Eroare API',
          name: 'errorMessage',
          type: 'text',
          rows: 2,
          initialValue: 'Spiritele nu pot răspunde acum. Contactează-l pe Plipli9 direct prin formularul de pe site! 👻'
        }
      ]
    },

    // STATISTICI SITE
    {
      title: '📊 Statistici și Numere',
      name: 'statistics',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          title: 'Numărul de Exploratori',
          name: 'explorers',
          type: 'number',
          initialValue: 5000
        },
        {
          title: 'Locuri Investigate',
          name: 'locations',
          type: 'number',
          initialValue: 50
        },
        {
          title: 'Live-uri Realizate',
          name: 'liveStreams',
          type: 'number',
          initialValue: 100
        },
        {
          title: 'Ore de Mistere',
          name: 'hoursOfMystery',
          type: 'number',
          initialValue: 500
        }
      ]
    },

    // SEO
    {
      title: '🔍 SEO și Meta',
      name: 'seo',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          title: 'Meta Title',
          name: 'metaTitle',
          type: 'string',
          validation: Rule => Rule.max(60),
          initialValue: 'Plipli9 Paranormal - Mistere Reale, Locuri Bântuite'
        },
        {
          title: 'Meta Description',
          name: 'metaDescription',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160),
          initialValue: 'Alătură-te lui Plipli9 în explorarea celor mai misterioase locuri bântuite din România. LIVE-uri exclusive, investigații paranormale autentice.'
        },
        {
          title: 'Keywords',
          name: 'keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          },
          initialValue: ['paranormal', 'fantome', 'bântuit', 'live streaming', 'investigații paranormale', 'România', 'mistere']
        },
        {
          title: 'Imagine pentru Social Media',
          name: 'ogImage',
          type: 'image',
          description: 'Imagine pentru Facebook, Twitter, etc. (recomandată: 1200x630px)',
          options: {
            hotspot: true
          }
        }
      ]
    }
  ],

  preview: {
    select: {
      title: 'branding.siteName',
      subtitle: 'branding.tagline',
      media: 'branding.logo'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Plipli9 Paranormal',
        subtitle: subtitle || 'Configurări Site'
      }
    }
  }
} 