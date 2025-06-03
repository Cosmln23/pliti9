# 👻 Plipli9 Paranormal - Sanity CMS Setup Guide

Ghid complet pentru configurarea și folosirea Sanity CMS pentru site-ul paranormal Plipli9.

## 🚀 Instalare și Configurare Inițială

### 1. Instalează dependințele
```bash
npm install
```

### 2. Creează proiectul Sanity
```bash
npx sanity@latest init
```
- Selectează: **Create new project**
- Nume proiect: `Plipli9 Paranormal CMS`
- Dataset: `production`
- Confirmă folosirea schemei existente

### 3. Configurează variabilele de mediu
Creează fișierul `.env.local` în rădăcină:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
```

### 4. Actualizează sanity.config.js
Înlocuiește `your-project-id` cu ID-ul real din Sanity:
```javascript
projectId: 'your-actual-project-id', // Din dashboard-ul Sanity
```

## 🎛️ Pornirea Sanity Studio

### Development
```bash
npm run sanity
```
Sanity Studio va fi disponibil la: `http://localhost:3333`

### Production Build
```bash
npm run sanity:build
npm run sanity:deploy
```

## 📋 Structura Schemei Create

Schema cuprinde toate setările necesare pentru site-ul paranormal:

### 🎭 **Logo și Branding**
- Logo principal (imagine optimizată)
- Nume site și tagline

### 🌟 **Hero Section**
- Titlu și subtitlu principal
- Descriere și imagine de fundal
- Texte pentru butoane

### 📡 **Live Streams**
- Program și data următorul live
- Locația și prețurile
- Status live (LIVE ACUM / În curând / Offline)

### 👤 **Despre Plipli9**
- Povestea completă (rich text editor)
- Fotografia și motto-ul personal

### 📞 **Contact**
- Email, Instagram, TikTok, YouTube
- Telefon/WhatsApp pentru notificări

### 🎨 **Tema și Culori**
- Culori personalizabile cu color picker
- Tema paranormală (violet, roz, verde)

### 🤖 **Mesaje Chatbot**
- Mesaje pentru AI chatbot
- Mesaje pentru erori și evenimente

### 📊 **Statistici**
- Numărul de exploratori și locuri
- Live-uri și ore de mistere

### 🔍 **SEO**
- Meta title, description și keywords
- Imagine pentru social media

## 🔧 Folosirea în Next.js

### Import și folosire:
```javascript
import { getSiteSettings, urlFor } from '@/lib/sanity'

// În component
export async function getStaticProps() {
  const siteSettings = await getSiteSettings()
  
  return {
    props: {
      siteSettings
    },
    revalidate: 60 // Revalidate la 60 secunde
  }
}

// Pentru imagini
const logoUrl = urlFor(siteSettings.branding.logo)
  .width(200)
  .height(200)
  .url()
```

### Exemple de folosire:

#### Hero Section:
```javascript
const { heroSection } = siteSettings
return (
  <section>
    <h1>{heroSection.title}</h1>
    <p>{heroSection.subtitle}</p>
    <img src={urlFor(heroSection.backgroundImage).url()} />
  </section>
)
```

#### Live Status:
```javascript
const { liveSettings } = siteSettings
const isLive = liveSettings.liveStatus === 'live'

return (
  <div>
    {isLive && <span className="live-indicator">🔴 LIVE ACUM</span>}
    <p>Preț: {liveSettings.livePricing.individual} LEI</p>
  </div>
)
```

#### Tema Culorilor:
```javascript
const { theme } = siteSettings
const primaryColor = theme.primaryColor.hex

// CSS custom properties
document.documentElement.style.setProperty('--primary-color', primaryColor)
```

## 📱 Accesul la Sanity Studio

### Local Development:
- URL: `http://localhost:3333`
- Credentials: Google/GitHub authentication

### Production:
- URL: `your-project-name.sanity.studio`
- Deploy: `npm run sanity:deploy`

## 🔐 Securitate și Permisiuni

### API Tokens (pentru producție):
1. Mergi la `sanity.io/manage`
2. Selectează proiectul
3. **API** → **Tokens** → **Add API token**
4. Nume: `Next.js Production`
5. Permissions: `Viewer` (doar pentru citire)

### Environment Variables pentru Production:
```env
SANITY_API_TOKEN=your-api-token-here
```

## 🎨 Personalizări Avansate

### Adăugarea de noi câmpuri:
1. Editează `schemas/siteSettings.js`
2. Adaugă noul câmp în secțiunea dorită
3. Restart Sanity Studio
4. Actualizează query-ul din `lib/sanity.js`

### Tipuri de câmpuri disponibile:
- `string` - text simplu
- `text` - text multilinie
- `array` - liste
- `image` - imagini optimizate
- `datetime` - dată și oră
- `number` - numere
- `color` - selector culori
- `block` - rich text editor

### Exemplu câmp nou:
```javascript
{
  title: 'Mesaj Special 🎃',
  name: 'specialMessage',
  type: 'text',
  description: 'Mesaj afișat în anumite perioade',
  initialValue: 'Halloween se apropie...'
}
```

## 🚨 Troubleshooting

### Erori comune:

#### "Project not found"
- Verifică `NEXT_PUBLIC_SANITY_PROJECT_ID` în `.env.local`
- Asigură-te că proiectul există în `sanity.io/manage`

#### "Schema not found"
- Restart Sanity Studio: `npm run sanity`
- Verifică importul în `schemas/index.js`

#### "Permission denied"
- Verifică că ești autentificat în Sanity
- Rulează: `npx sanity login`

### Reset complet:
```bash
rm -rf node_modules
npm install
npx sanity login
npm run sanity
```

## 📞 Support

Pentru probleme specifice Plipli9 Paranormal:
- Email: contact@plipli9paranormal.com
- Instagram: @plipli9paranormal

Pentru documentația oficială Sanity:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Integration](https://github.com/sanity-io/next-sanity)

---

**🎭 Sanity CMS este acum gata pentru a administra complet conținutul site-ului paranormal Plipli9!**

Toate setările pot fi modificate fără cod, direct din interface-ul user-friendly cu emoji-uri și explicații clare! 👻✨ 