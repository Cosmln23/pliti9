# 🔗 Ghid Integrare Make.com - Plipli9 Paranormal

Documentație completă pentru automatizarea site-ului Plipli9 Paranormal prin integrarea cu Make.com (fostul Integromat).

## 📋 Cuprins

1. [Setup Initial](#setup-initial)
2. [Webhook-uri Disponibile](#webhook-uri-disponibile)
3. [Scenarii de Automatizare](#scenarii-de-automatizare)
4. [Configurare Conexiuni](#configurare-conexiuni)
5. [Template-uri Email](#template-uri-email)
6. [Monitorizare și Troubleshooting](#monitorizare-și-troubleshooting)

---

## 🚀 Setup Initial

### 1. Configurare Environment Variables

Adaugă următoarele variabile în fișierul `.env.local`:

```env
# Make.com Webhook URLs
MAKE_PAYMENT_WEBHOOK_URL=https://hook.eu1.make.com/your-payment-webhook-id
MAKE_ACCESS_CODE_WEBHOOK_URL=https://hook.eu1.make.com/your-access-webhook-id
MAKE_LIVE_SESSION_WEBHOOK_URL=https://hook.eu1.make.com/your-live-webhook-id

# Securitate webhook
MAKE_WEBHOOK_SECRET=your-secure-webhook-secret-key

# Email service (opțional pentru automatizare avansată)
EMAIL_SERVICE_API_KEY=your-email-service-api-key
```

### 2. Verificare Conectivitate

Testează webhook-urile cu:
```bash
curl -X GET https://your-domain.com/api/webhooks/payment-success
```

---

## 🎣 Webhook-uri Disponibile

### 1. Payment Success Webhook

**Endpoint:** `/api/webhooks/payment-success`  
**Metodă:** POST  
**Triggerează:** După finalizarea unei plăți cu succes

**Payload trimis către Make.com:**
```json
{
  "accessCode": "PLI123ABC",
  "email": "user@example.com",
  "amount": 25.00,
  "paymentMethod": "stripe",
  "paymentIntentId": "pi_xxxxx",
  "expiresAt": "2024-01-16T21:00:00.000Z",
  "createdAt": "2024-01-15T21:00:00.000Z",
  "status": "active",
  "type": "live_access"
}
```

### 2. Access Code Generated Webhook

**Endpoint:** `/api/webhooks/access-code-generated`  
**Metodă:** POST  
**Triggerează:** La generarea unui cod de acces

**Payload trimis către Make.com:**
```json
{
  "accessCode": "PLI123ABC",
  "email": "user@example.com",
  "expiresAt": "2024-01-16T21:00:00.000Z",
  "generatedAt": "2024-01-15T21:00:00.000Z",
  "purpose": "live_access"
}
```

### 3. Live Session Started Webhook

**Endpoint:** `/api/webhooks/live-session-started`  
**Metodă:** POST  
**Triggerează:** Când începe un LIVE paranormal

**Payload trimis către Make.com:**
```json
{
  "sessionId": "live_session_123",
  "streamKey": "stream_key_xxx",
  "startTime": "2024-01-15T21:00:00.000Z",
  "location": "Castelul Bran",
  "estimatedDuration": "120",
  "viewerLimit": 100
}
```

---

## ⚙️ Scenarii de Automatizare

### Scenario 1: Procesare Plată Automată

**Flow:** Payment Success → Email cu Cod → Google Sheets → SMS Notificare

**Pași în Make.com:**

1. **Webhook Trigger**
   - URL: `YOUR_DOMAIN/api/webhooks/payment-success`
   - Metodă: POST

2. **Email Module (Gmail/SendGrid)**
   ```
   TO: {{email}}
   SUBJECT: 🎃 Cod de acces LIVE Paranormal Plipli9
   BODY: Template personalizat (vezi secțiunea Template-uri)
   ```

3. **Google Sheets Module**
   - Spreadsheet: "Plipli9 Access Codes"
   - Adaugă rând nou cu: email, accessCode, expiresAt, createdAt

4. **SMS Module (opțional - Twilio)**
   ```
   MESSAGE: "Codul tău de acces LIVE paranormal: {{accessCode}}. Válido până la {{expiresAt}}"
   ```

### Scenario 2: Notificare LIVE Started

**Flow:** Live Started → Email Abonați → Social Media Post → Analytics

**Pași în Make.com:**

1. **Webhook Trigger**
   - URL: `YOUR_DOMAIN/api/webhooks/live-session-started`

2. **Google Sheets - Citește Abonați**
   - Filtrează utilizatorii cu acces valid

3. **Email Batch Module**
   ```
   TO: {{subscribers}}
   SUBJECT: 🔴 LIVE PARANORMAL ACUM: {{location}}
   BODY: "Plipli9 a început investigația la {{location}}! Intră acum!"
   ```

4. **Social Media Posts**
   - **Instagram:** Post story cu link LIVE
   - **TikTok:** Clip teaser
   - **Facebook:** Post cu locația

### Scenario 3: Expirare Cod de Acces

**Flow:** Daily Check → Verifică Expirare → Email Reminder → Cleanup

**Pași în Make.com:**

1. **Schedule Trigger**
   - Frecvență: Zilnic la 09:00

2. **Google Sheets - Citește Coduri**
   - Filtrează codurile care expiră în 2 ore

3. **Email Reminder Module**
   ```
   TO: {{email}}
   SUBJECT: ⏰ Codul tău de acces expiră în curând!
   BODY: "Îți reamintim că ai acces la LIVE-ul paranormal până la {{expiresAt}}"
   ```

4. **Cleanup Module**
   - Șterge codurile expirate din Google Sheets

---

## 🔌 Configurare Conexiuni

### Gmail/Google Workspace

1. **Conectare Gmail în Make.com:**
   - Add Module → Gmail → Send an Email
   - Autentificare OAuth cu contul Gmail

2. **Template Email:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="UTF-8">
       <title>Cod Acces LIVE Paranormal</title>
   </head>
   <body style="font-family: Arial, sans-serif; background: #0f172a; color: white;">
       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
           <h1 style="color: #d946ef;">🎃 Plipli9 Paranormal</h1>
           <h2>Codul tău de acces LIVE</h2>
           
           <div style="background: #1e293b; padding: 20px; border-radius: 10px; text-align: center;">
               <h3 style="color: #22c55e; font-size: 24px; margin: 0;">{{accessCode}}</h3>
               <p style="margin: 10px 0 0 0; color: #94a3b8;">Cod de acces valid până la {{expiresAt}}</p>
           </div>
           
           <p>Folosește acest cod pentru a accesa LIVE-ul paranormal:</p>
           <a href="{{liveUrl}}" style="background: #d946ef; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
               🔴 Intră în LIVE ACUM
           </a>
           
           <p><strong>Instrucțiuni:</strong></p>
           <ol>
               <li>Accesează pagina LIVE</li>
               <li>Introdu codul de acces</li>
               <li>Bucură-te de experiența paranormală!</li>
           </ol>
           
           <hr style="border: 1px solid #374151; margin: 30px 0;">
           <p style="font-size: 12px; color: #6b7280;">
               Dacă întâmpini probleme, scrie-ne la contact@plipli9paranormal.com
           </p>
       </div>
   </body>
   </html>
   ```

### Google Sheets

1. **Spreadsheet Structure:**
   ```
   A1: Email | B1: Access Code | C1: Created At | D1: Expires At | E1: Status | F1: Payment Method
   ```

2. **Configurare în Make.com:**
   - Add Module → Google Sheets → Add a Row
   - Selectează spreadsheet-ul "Plipli9 Access Codes"

### Stripe Integration

1. **Webhook Setup în Stripe:**
   ```
   Endpoint URL: https://your-domain.com/api/webhooks/stripe
   Events: payment_intent.succeeded, checkout.session.completed
   ```

2. **Make.com Stripe Module:**
   - Trigger: New Event
   - Event Type: payment_intent.succeeded

---

## 📧 Template-uri Email

### Template 1: Cod de Acces

**Subiect:** 🎃 Cod de acces LIVE Paranormal Plipli9  
**Conținut:** Vezi secțiunea Configurare Conexiuni → Gmail

### Template 2: LIVE Started Notification

**Subiect:** 🔴 LIVE PARANORMAL ACUM: Investigație la {{location}}

```html
<div style="background: #0f172a; color: white; padding: 20px; font-family: Arial;">
    <h1 style="color: #d946ef;">🔴 LIVE PARANORMAL ÎNCEPUT!</h1>
    
    <p>Plipli9 tocmai a început investigația paranormală la <strong>{{location}}</strong>!</p>
    
    <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #22c55e; margin: 0;">Detalii LIVE:</h3>
        <ul>
            <li><strong>Locație:</strong> {{location}}</li>
            <li><strong>Început:</strong> {{startTime}}</li>
            <li><strong>Durata estimată:</strong> {{estimatedDuration}} minute</li>
        </ul>
    </div>
    
    <a href="{{liveUrl}}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        👻 Intră în LIVE ACUM
    </a>
    
    <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
        Nu ai cod de acces? <a href="{{purchaseUrl}}" style="color: #d946ef;">Cumpără acum pentru doar 25 RON</a>
    </p>
</div>
```

### Template 3: Reminder Expirare

**Subiect:** ⏰ Codul tău de acces expiră în 2 ore!

```html
<div style="background: #0f172a; color: white; padding: 20px; font-family: Arial;">
    <h1 style="color: #f59e0b;">⏰ Reminder: Cod de acces</h1>
    
    <p>Îți reamintim că codul tău de acces pentru LIVE-urile paranormale va expira în curând:</p>
    
    <div style="background: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0;">Codul {{accessCode}} expiră la {{expiresAt}}</h3>
    </div>
    
    <p>Dacă vrei să participi la următoarele LIVE-uri, poți achiziționa un nou cod de acces:</p>
    
    <a href="{{purchaseUrl}}" style="background: #d946ef; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        🛒 Cumpără Cod Nou (25 RON)
    </a>
</div>
```

---

## 📊 Monitorizare și Troubleshooting

### Logs și Debugging

1. **Make.com Execution History:**
   - Accesează scenario → History
   - Verifică webhook-urile primite și erorile

2. **Site Logs:**
   ```javascript
   // Verificare webhook în browser console
   fetch('/api/webhooks/payment-success', {
       method: 'GET'
   }).then(res => res.json()).then(console.log)
   ```

### Erori Comune

#### 1. Webhook 404 Error
```json
{
  "error": "Webhook URL not found",
  "solution": "Verifică URL-ul webhook în Make.com și environment variables"
}
```

#### 2. Autentificare Gmail Failed
```json
{
  "error": "Gmail authentication failed", 
  "solution": "Re-autentifică contul Gmail în Make.com și verifică permisiunile"
}
```

#### 3. Google Sheets Permission Error
```json
{
  "error": "Insufficient permissions for Google Sheets",
  "solution": "Asigură-te că contul are acces de editare la spreadsheet"
}
```

### Testing Webhooks

```bash
# Test Payment Success Webhook
curl -X POST https://your-domain.com/api/webhooks/payment-success \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 25.00,
    "paymentMethod": "stripe",
    "timestamp": "2024-01-15T21:00:00.000Z"
  }'

# Test Live Session Webhook  
curl -X POST https://your-domain.com/api/webhooks/live-session-started \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_123",
    "startTime": "2024-01-15T21:00:00.000Z",
    "location": "Test Location"
  }'
```

---

## 🎯 Rezultate Așteptate

Integrarea Make.com permite:

✅ **Automatizare completă** a plăților și codurilor de acces  
✅ **Email-uri automate** personalizate pentru utilizatori  
✅ **Gestionare centralizată** în Google Sheets  
✅ **Notificări LIVE** în timp real  
✅ **Social media automation** pentru promovare  
✅ **Analytics și raportare** automată  
✅ **Cleanup automat** al codurilor expirate  

## 📞 Support

Pentru probleme cu integrarea Make.com:
- Email: dev@plipli9paranormal.com
- Discord: [Link Server Development]
- Documentație Make.com: https://www.make.com/en/help

---

**🔮 Site-ul Plipli9 Paranormal este acum complet automatizat și pregătit pentru LIVE-uri paranormale la scară largă!** 👻 