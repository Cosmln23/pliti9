# 🎃 Plipli9 Paranormal - Site Oficial

Site web complet pentru content creator paranormal cu LIVE streaming plătit, arhivă video, evenimente și integrare Make.com.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)
![Livepeer](https://img.shields.io/badge/Livepeer-Streaming-00E676)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

---

## 🎯 Funcționalități Principale

### 🔴 LIVE Streaming Premium
- **Acces plătit** (25 RON) cu sistem de coduri
- **Livepeer.io** pentru streaming de înaltă calitate
- **Chat în timp real** cu mesaje paranormale
- **Protecție acces** cu validare automată

### 💳 Sistem de Plăți
- **Stripe & PayPal** integration
- **Generare automată** coduri de acces
- **Expirare** după 24h pentru securitate
- **Email confirmări** automate

### 🎬 Arhivă Video
- **Categorii** paranormale (Castele, Cimitire, etc.)
- **Search & Filter** avansat
- **Metadata** completă (locație, durată, views)
- **Player video** optimizat

### 👻 Events Management
- **Investigații paranormale** fizice
- **Sistem de rezervări** cu plăți
- **Gestionare participanți** și disponibilitate
- **Notificări automate** prin email

### 🤖 Chat Widget Paranormal
- **Asistent AI** cu răspunsuri tematice
- **Easter eggs** paranormale
- **Fixed position** în colțul din stânga-jos
- **Animații** și efecte speciale

### ⚙️ Automatizare Make.com
- **Webhook-uri** pentru toate evenimentele
- **Email marketing** automat
- **Social media** posting
- **Analytics** și raportare

---

## 🚀 Instalare Rapidă

### 1. Clone Repository
```bash
git clone https://github.com/your-username/plipli9-paranormal.git
cd plipli9-paranormal
```

### 2. Install Dependencies
```bash
npm install
# sau
yarn install
```

### 3. Environment Variables
Creează fișierul `.env.local`:

```env
# Next.js App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Plipli9 Paranormal"

# Livepeer pentru streaming
NEXT_PUBLIC_LIVEPEER_API_KEY=your_livepeer_api_key
LIVEPEER_STUDIO_API_KEY=your_livepeer_studio_key

# Stripe pentru plăți
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Make.com Webhooks
MAKE_PAYMENT_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
MAKE_ACCESS_CODE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
MAKE_LIVE_SESSION_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
MAKE_WEBHOOK_SECRET=your-secure-secret

# Email service (opțional)
EMAIL_SERVICE_API_KEY=your_email_api_key
```

### 4. Start Development Server
```bash
npm run dev
# sau
yarn dev
```

Site-ul va fi disponibil la: **http://localhost:3000**

---

## 📁 Structura Proiectului

```
plipli9-paranormal/
├── 📁 app/                    # Next.js 14 App Router
│   ├── 📄 layout.tsx         # Layout principal cu metadata SEO
│   ├── 📄 page.tsx           # Homepage cu hero și contact
│   ├── 📁 live/              # Pagina LIVE cu plăți și streaming
│   ├── 📁 videos/            # Arhiva video cu categorii
│   ├── 📁 events/            # Evenimente paranormale fizice
│   ├── 📁 shop/              # Coming soon cu newsletter
│   └── 📁 api/               # API Routes pentru webhooks
│       └── 📁 webhooks/      # Make.com integration endpoints
├── 📁 components/            # React Components
│   ├── 📄 Navbar.tsx        # Navigație responsivă
│   ├── 📄 Footer.tsx        # Footer cu social links
│   ├── 📄 ChatWidget.tsx    # Chat paranormal fix
│   ├── 📄 VideoPlayer.tsx   # Livepeer video player
│   ├── 📄 PaymentForm.tsx   # Stripe/PayPal integration
│   ├── 📄 AccessControl.tsx # Validare coduri acces
│   ├── 📄 ContactSection.tsx # Form contact cu FAQ
│   ├── 📄 VideoCard.tsx     # Card pentru arhiva video
│   ├── 📄 EventCard.tsx     # Card pentru evenimente
│   ├── 📄 ComingSoon.tsx    # Coming soon cu newsletter
│   ├── 📄 LoadingSpinner.tsx # Spinner de loading
│   └── 📄 LogoPlaceholder.tsx # Logo editabil
├── 📁 lib/                   # Funcții utilitare
│   └── 📄 utils.ts          # Helpers și constants
├── 📁 styles/               # Styling
│   └── 📄 globals.css       # Tailwind + animații paranormale
├── 📄 package.json          # Dependencies Next.js 14
├── 📄 tailwind.config.js    # Culori paranormale custom
├── 📄 next.config.js        # Optimizări video streaming
├── 📄 tsconfig.json         # TypeScript configuration
├── 📄 MAKE-INTEGRATION.md   # Documentație Make.com
└── 📄 README.md             # Documentația aceasta
```

---

## 🎨 Design System

### Culori Paranormale
```css
/* Palette Paranormal */
paranormal: {
  50: '#f8f7ff',   /* Text light */
  100: '#ede9fe',  /* Backgrounds */
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',  /* Primary */
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',  /* Text dark */
  900: '#4c1d95'   /* Backgrounds dark */
}

/* Mystery Accent */
mystery: {
  50: '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',  /* Accent primary */
  600: '#c026d3',
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75'
}

/* Ghost Effects */
ghost: {
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6',  /* Ghost glow */
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a'
}
```

### Tipografie
- **Font Principal:** Inter (system font)
- **Headings:** Font bold cu efecte paranormale
- **Body text:** Font normal, optimizat pentru lizibilitate
- **Code/Access codes:** Font mono pentru coduri

### Animații Speciale
- **Glow effects:** `.mystery-glow`, `.ghost-glow`
- **Floating:** `.floating` pentru elemente paranormale
- **Pulse:** `.animate-pulse` pentru indicatori LIVE
- **Fade in:** `.fade-in-up` pentru loading content

---

## 🛡️ Securitate și Performance

### Securitate
✅ **Input sanitization** pentru toate formularele  
✅ **Rate limiting** client-side pentru chat  
✅ **Access code validation** cu expirare automată  
✅ **Webhook authentication** cu secret keys  
✅ **CORS protection** pentru streaming  

### Performance
✅ **Next.js 14** cu App Router și Server Components  
✅ **Image optimization** automată  
✅ **Code splitting** pentru componente  
✅ **Streaming video** optimizat prin Livepeer  
✅ **SEO optimization** completă  

### SEO Features
- **Metadata** dinamică pentru toate paginile
- **Open Graph** pentru social media sharing
- **JSON-LD** structured data pentru search engines
- **Sitemap** generat automat
- **Analytics** Google Analytics 4 ready

---

## 🔧 Integrări și Servicii

### Video Streaming
- **[Livepeer.io](https://livepeer.org/)** - Decentralized video streaming
- **WebRTC** pentru chat video în timp real
- **HLS streaming** pentru compatibilitate maximă

### Plăți
- **[Stripe](https://stripe.com/)** - Procesare carduri bancare
- **[PayPal](https://paypal.com/)** - Alternative payment method
- **Webhook validation** pentru securitate

### Automatizare
- **[Make.com](https://www.make.com/)** - Workflow automation
- **Email automation** pentru coduri de acces
- **Social media posting** automat

### Analytics și Monitoring
- **Google Analytics 4** pentru tracking utilizatori
- **Vercel Analytics** pentru performance monitoring
- **Error tracking** prin console logs

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px  
- **Desktop:** 1024px+ 

### Features Mobile
✅ **Touch-optimized** controls pentru video player  
✅ **Mobile menu** cu hamburger navigation  
✅ **Swipe gestures** pentru gallery  
✅ **Mobile payments** optimizat pentru telefon  
✅ **Chat widget** adaptat pentru ecrane mici  

---

## 🎮 Chat Widget Features

### Răspunsuri Paranormale
```javascript
// Exemple răspunsuri tematice
const responses = [
  "👻 Se simte o prezență rece pe aici...",
  "🔮 Spiritele îmi șoptesc că ai nevoie de ajutor",
  "⚡ Energia paranormală este puternică astăzi!",
  "💀 Din întunericul eternității îți răspund...",
  "🌙 În lumina lunii pline văd că..."
]
```

### Easter Eggs
- **Keyword triggers:** "fantomă", "spirit", "umbră"
- **Special responses** pentru cuvinte paranormale
- **Hidden commands** pentru utilizatori avansați
- **Time-based messages** (ex: după miezul nopții)

---

## 📦 Dependencies și Versiuni

### Core Framework
- **Next.js:** 14.0+ (App Router)
- **React:** 18.2+
- **TypeScript:** 5.0+

### UI și Styling  
- **Tailwind CSS:** 3.4+
- **Lucide React:** 0.300+ (icons)
- **clsx + tailwind-merge:** pentru CSS utilities

### Integrări
- **@livepeer/react:** pentru video streaming
- **@stripe/stripe-js:** pentru plăți
- **PayPal SDK** pentru alternative payments

### Development Tools
- **ESLint:** pentru code quality
- **Prettier:** pentru code formatting
- **TypeScript strict mode:** pentru type safety

---

## 🚀 Deployment

### Vercel (Recomandat)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables în Vercel Dashboard
# Production URL: https://your-domain.vercel.app
```

### Alte Platforme
- **Netlify:** Suport complet Next.js 14
- **Railway:** Database + hosting
- **DigitalOcean:** VPS cu Docker

### Environment Production
```env
# Production URLs
NEXT_PUBLIC_APP_URL=https://plipli9paranormal.com
NEXT_PUBLIC_LIVEPEER_API_KEY=live_key_...
STRIPE_SECRET_KEY=sk_live_...
# etc...
```

---

## 🧪 Testing

### Teste Manuale
```bash
# Test toate paginile
npm run dev
# Verifică: /, /live, /videos, /events, /shop

# Test plăți (Stripe Test Mode)
# Card test: 4242 4242 4242 4242
# Expiry: orice dată viitoare
# CVV: orice 3 cifre

# Test coduri de acces
# Format valid: PLI123ABC
```

### Webhook Testing
```bash
# Test Make.com webhooks
curl -X POST https://your-domain.com/api/webhooks/payment-success \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","amount":25.00,"paymentMethod":"stripe"}'
```

---

## 🤝 Contribuții

### Pentru dezvoltatori:
1. **Fork** repository-ul
2. **Creează branch** pentru feature: `git checkout -b feature/new-paranormal-feature`
3. **Commit** modificările: `git commit -m 'Add paranormal feature'`
4. **Push** pe branch: `git push origin feature/new-paranormal-feature`
5. **Creează Pull Request**

### Coding Standards
- **TypeScript strict** pentru type safety
- **ESLint + Prettier** pentru code formatting
- **Conventional commits** pentru commit messages
- **Component documentation** în JSDoc

---

## 📞 Support și Contact

### Pentru probleme tehnice:
- **Email:** dev@plipli9paranormal.com
- **GitHub Issues:** [Link repository]
- **Discord:** [Link server dezvoltatori]

### Pentru conținut paranormal:
- **Email:** contact@plipli9paranormal.com
- **TikTok:** [@plipli9paranormal](https://tiktok.com/@plipli9paranormal)
- **Instagram:** [@plipli9paranormal](https://instagram.com/plipli9paranormal)
- **YouTube:** [@plipli9paranormal](https://youtube.com/@plipli9paranormal)

---

## 📄 Licență

MIT License - Vezi fișierul [LICENSE](LICENSE) pentru detalii.

---

## 🔮 Roadmap Viitor

### Q1 2024
- [ ] **Mobile app** React Native pentru iOS/Android
- [ ] **Push notifications** pentru LIVE-uri
- [ ] **Subscription tiers** cu multiple nivele de acces
- [ ] **Community features** - forum și comentarii

### Q2 2024  
- [ ] **AI-powered** ghost detection în timpul LIVE-urilor
- [ ] **VR/AR integration** pentru experiențe immersive
- [ ] **Multi-language** support (EN, DE, FR)
- [ ] **Advanced analytics** dashboard pentru creator

### Q3 2024
- [ ] **Marketplace** pentru echipament paranormal
- [ ] **Collaboration tools** cu alți investigatori
- [ ] **Live polls** și interacțiune în timp real
- [ ] **Crypto payments** cu criptomonede

---

## ⚡ Quick Start pentru Developeri

```bash
# 1. Clone + Install + Setup
git clone https://github.com/your-repo/plipli9-paranormal.git
cd plipli9-paranormal && npm install
cp .env.example .env.local # și completează variabilele

# 2. Start development
npm run dev

# 3. Primul test
# Accesează http://localhost:3000
# Chat widget în stânga-jos: scrie "test" pentru răspuns paranormal
# LIVE page: testează fluxul de plată cu codul de test Stripe

# 4. Deploy on Vercel
npx vercel
```

---

**🎃 Site-ul Plipli9 Paranormal este pregătit pentru investigații paranormale la scară industrială!** 

**Features complete:** ✅ LIVE streaming ✅ Payments ✅ Video archive ✅ Events ✅ Chat widget ✅ Make.com automation ✅ SEO optimized ✅ Mobile responsive

**Tech stack:** Next.js 14 + TypeScript + Tailwind CSS + Livepeer + Stripe + Make.com

**Status:** 🟢 Production Ready 👻 