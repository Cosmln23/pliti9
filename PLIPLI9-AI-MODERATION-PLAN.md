# 🤖 PLIPLI9 - PLAN AI MODERATION & CHATBOT 24/7

## 📋 OVERVIEW
Sistem complet de moderare AI + chatbot persistent pentru PLIPLI9 Paranormal Live

---

## 🎯 OBIECTIVE PRINCIPALE

### 1. 🤖 AI BOT PERSISTENT (24/7)
**PROBLEMA ACTUALĂ:**
- AI bot local → se oprește cu calculatorul
- Dependent de browserul tău
- Offline când nu ești online

**SOLUȚIA:**
- **AI Bot pe server** → rulează permanent 
- **Cloud deployment** → niciodată offline
- **Auto-restart** dacă pică
- **Independent de calculator**

### 2. 🛡️ AI MODERATOR INTELIGENT
**DETECTEAZĂ AUTOMAT:**
- **Ură/Hate speech** 
- **Agresiune/Violență**
- **Jigniri/Insulte**
- **Limbaj toxic**
- **Amenințări**
- **Spam masiv**
- **Limbaj sexual nepotrivit**

**FOLOSIND:**
- **OpenAI GPT-4** pentru analiza limbajului
- **Algoritmi de sentiment analysis**
- **Lista neagră de cuvinte românești**
- **Context analysis** (nu doar cuvinte izolate)
- **Pattern recognition** pentru spam

---

## ⚖️ SISTEMA DE 3 STRIKES

### 🟡 WARNING 1 (Prima abatere)
- **Acțiune**: Mesaj privat de avertizare
- **Mesaj**: "⚠️ Atenție! Limbaj nepotrivit detectat. Te rugăm să moderezi tonul."
- **Logging**: Se salvează în baza de date
- **Restricții**: Niciunele

### 🟠 WARNING 2 (A doua abatere)
- **Acțiune**: Timeout 5 minute + avertisment public
- **Mesaj**: "🟠 Ultimul avertisment! Moderează-ți limbajul sau vei fi eliminat."
- **Restricții**: Nu poate scrie 5 minute
- **Notificare**: Admin este anunțat

### 🔴 BAN COMPLET (A treia abatere)
- **Acțiuni AUTOMATE**:
  - Dezactivare cod de acces live
  - Kick din transmisia curentă
  - IP block 24 ore
  - Adăugare în blacklist
- **Mesaj**: "🔴 Acces suspendat pentru comportament toxic. Revino mâine."
- **Alertă**: Admin primeşte notificare de incident

---

## 🚀 IMPLEMENTARE TEHNICĂ

### A. SERVER AI MODERATOR
```typescript
class AIModerator {
  // Analizează fiecare mesaj
  async detectToxicity(message: string, username: string): Promise<ToxicityResult>
  
  // Gestionează avertismentele
  async issueWarning(user: User, level: 1|2|3): Promise<void>
  
  // Execută ban-ul automat
  async banUser(user: User, reason: string): Promise<void>
  
  // Logare evenimente
  async logIncident(details: IncidentDetails): Promise<void>
  
  // Verifică istoric utilizator
  async getUserStrikes(username: string): Promise<number>
  
  // Reset strikes după timp
  async resetExpiredStrikes(): Promise<void>
}
```

### B. DATABASE TRACKING
```sql
-- Tabela pentru strikes-uri
CREATE TABLE user_strikes (
  id INT PRIMARY KEY,
  username VARCHAR(50),
  strike_level INT,
  reason TEXT,
  message_content TEXT,
  timestamp DATETIME,
  expires_at DATETIME
);

-- Tabela pentru ban-uri
CREATE TABLE user_bans (
  id INT PRIMARY KEY,
  username VARCHAR(50),
  ip_address VARCHAR(45),
  ban_reason TEXT,
  banned_at DATETIME,
  expires_at DATETIME,
  is_permanent BOOLEAN
);

-- Tabela pentru log incidente
CREATE TABLE moderation_logs (
  id INT PRIMARY KEY,
  username VARCHAR(50),
  action_type VARCHAR(20), -- warning, timeout, ban
  ai_confidence FLOAT,
  message_content TEXT,
  triggered_by TEXT,
  timestamp DATETIME
);
```

### C. REAL-TIME INTEGRATION
```typescript
// Interceptarea mesajelor în API
export async function POST(request: NextRequest) {
  const { username, message } = await request.json()
  
  // 1. MODERARE AI
  const moderationResult = await aiModerator.checkMessage(message, username)
  
  if (moderationResult.isToxic) {
    // Execută acțiunea corespunzătoare
    await aiModerator.handleViolation(username, moderationResult)
    
    // Oprește mesajul dacă e ban/timeout
    if (moderationResult.blocked) {
      return NextResponse.json({ error: 'Mesaj blocat de moderare' })
    }
  }
  
  // 2. Continuă cu salvarea normală
  // ... rest of code
}
```

---

## 🤖 AI CHATBOT 24/7

### FUNCȚIONALITĂȚI
- **Răspunsuri automate** la întrebări despre paranormal
- **Informații despre locația curentă** din live
- **Sfaturi pentru spectatori noi**
- **Răspunsuri la comenzi** (!help, !location, !next)
- **Moderare conversații** când nu ești online

### COMENZI BOT
```
!help - Afișează comenzile disponibile
!location - Informații despre locația curentă
!next - Când e următorul live
!rules - Regulile chat-ului
!contact - Informații de contact
!paranormal - Sfaturi despre fenomene paranormale
```

### INTEGRARE OPENAI
```typescript
class ChatbotAI {
  async processCommand(command: string): Promise<string>
  async generateResponse(message: string, context: string): Promise<string>
  async getParanormalAdvice(): Promise<string>
  async getLocationInfo(currentLocation: string): Promise<string>
}
```

---

## 🔧 CONFIGURARE SEVERITATE

### NIVEL LIBERAL (Recomandat pentru început)
- **Toleranță mare** pentru limbaj colocvial
- **Focus pe amenințări** și ură extremă
- **3 strikes** cu avertismente clare

### NIVEL MODERAT 
- **Balans** între libertate și siguranță
- **Detectează** majoritatea injuriilor
- **2 strikes** pentru limbaj grav

### NIVEL STRICT
- **Zero toleranță** pentru orice limbaj nepotrivit
- **1 strike** pentru ban
- **Filtru maxim** pentru toate mesajele

---

## ⏰ TIMELINE RESETARE

### STRIKES EXPIRY
- **Warning 1**: Expiră după 24 ore
- **Warning 2**: Expiră după 48 ore  
- **Ban**: 24 ore (default) / permanent (manual)

### AUTO-CLEANUP
- **Ștergere log-uri** mai vechi de 30 zile
- **Reset statistici** la începutul lunii
- **Arhivare incidente** majore

---

## 🚨 SISTEM DE ALERTE ADMIN

### NOTIFICĂRI INSTANT
- **Ban automat** executat
- **Incident grav** detectat
- **AI confidence** sub 70% (review manual)
- **Pattern suspect** (mai multe conturi, același IP)

### DASHBOARD ADMIN
- **Statistici moderare** în timp real
- **Top utilizatori** cu probleme
- **Accuracy rate** AI moderator
- **Manual override** pentru ban-uri

---

## 🛡️ PROTECȚII MULTIPLE (FAIL-SAFE)

### NIVEL 1 - AI PRIMARY
- **Moderatorul principal** AI
- **Analiză OpenAI** GPT-4
- **Response time**: <500ms

### NIVEL 2 - AI BACKUP  
- **Moderator secundar** (alt API)
- **Se activează** dacă primul pică
- **Algoritm local** de rezervă

### NIVEL 3 - HUMAN FALLBACK
- **Alert către admin** pentru cazuri extreme
- **Manual review** pentru edge cases
- **Override complet** în caz de probleme AI

---

## 💰 COSTURI ESTIMATE

### OPENAI API
- **GPT-4 Turbo**: ~$0.01 per 1K tokens
- **Volume estimat**: 10,000 mesaje/zi = ~$15-30/lună
- **Moderation API**: ~$0.002 per 1K tokens = ~$3-5/lună

### HOSTING AI BOT
- **VPS dedicat**: $20-50/lună
- **Database storage**: $5-10/lună
- **TOTAL**: ~$45-95/lună

---

## 🎯 BENEFICII FINALE

### PENTRU STREAMER
- **Zero moderare manuală** needed
- **Chat civilizat** automat
- **Focus pe conținut**, nu pe moderare
- **Statistici detaliate** comportament spectatori

### PENTRU SPECTATORI
- **Experiență curată** fără toxicitate
- **Răspunsuri instant** de la AI
- **Reguli clare** și transparente
- **Appel system** pentru ban-uri greșite

### PENTRU COMUNITATE
- **Creștere sănătoasă** a comunității
- **Standard înalt** de comportament
- **Protecție împotriva** trolls și spam
- **Reputație excelentă** pentru canalul PLIPLI9

---

## ✅ NEXT STEPS PENTRU IMPLEMENTARE

1. **Setup OpenAI API** keys și configurare
2. **Database design** pentru tracking strikes
3. **AI Moderator service** development  
4. **Integration în chat** API existent
5. **Admin dashboard** pentru management
6. **Testing extensiv** cu mesaje test
7. **Deployment pe server** 24/7
8. **Monitoring și fine-tuning**

---

**📝 Document creat pentru PLIPLI9 Paranormal**  
**📅 Data: 2025**  
**🎯 Obiectiv: AI Moderation & Chatbot 24/7 complet automat** 