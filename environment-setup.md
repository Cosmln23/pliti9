# 🔧 ENVIRONMENT SETUP PENTRU CONEXIUNI COMPLETE

## 📋 VARIABILE DE MEDIU NECESARE:

### **STRIPE INTEGRATION:**
```
STRIPE_SECRET_KEY=sk_live_xxxxx (sau sk_test_xxxxx pentru testing)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx (sau pk_test_xxxxx)
```

### **SITE CONFIGURATION:**
```
NEXT_PUBLIC_BASE_URL=https://www.plipli9.com
NEXTAUTH_URL=https://www.plipli9.com
NEXTAUTH_SECRET=your-secret-key-here
```

### **MAKE.COM WEBHOOKS:**
```
WEBHOOK_EMAIL=https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n
WEBHOOK_WHATSAPP=https://hook.eu2.make.com/ida0ge74962m4ske2bw78ywj9szu54ie
```

### **TWILIO (optional - pentru SMS backup):**
```
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+12567954236
```

---

## 🔗 WEBHOOK ENDPOINTS PENTRU STRIPE:

### **În Stripe Dashboard → Webhooks:**
1. **Endpoint URL:** `https://www.plipli9.com/api/webhooks/stripe-complete`
2. **Events să asculte (OBLIGATORII):**
   - `checkout.session.completed` ✅ **PRIMARY - NECESAR pentru Stripe Checkout**
   - `payment_intent.succeeded` ✅ **BACKUP - Pentru siguranță**
   - `payment_intent.payment_failed` ⚠️ **Pentru error handling**

---

## 📂 STRUCTURA DIRECTOARELOR:

```
plipli paranormal/
├── data/
│   ├── payments.json (created automat)
│   └── payments/ (individual files)
├── app/api/
│   ├── webhooks/stripe-complete/
│   ├── database/save-payment/
│   ├── notifications/send-all/
│   └── validate-code/
└── .env.local
```

---

## ✅ VERIFICARE CONEXIUNI:

### **TEST 1: Stripe Webhook**
```bash
curl -X POST https://www.plipli9.com/api/webhooks/stripe-complete \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### **TEST 2: Database Save**
```bash
curl -X POST https://www.plipli9.com/api/database/save-payment \
  -H "Content-Type: application/json" \
  -d '{"stripePaymentId": "test_123", "email": "test@test.com"}'
```

### **TEST 3: Notifications**
```bash
curl -X POST https://www.plipli9.com/api/notifications/send-all \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "accessCode": "TEST123"}'
```

### **TEST 4: Code Validation**
```bash
curl -X POST https://www.plipli9.com/api/validate-code \
  -H "Content-Type: application/json" \
  -d '{"accessCode": "TEST123", "email": "test@test.com"}'
```

---

## 🚀 DEPLOYMENT CHECKLIST:

- [ ] Environment variables configurate în Vercel
- [ ] Stripe webhooks configurate cu endpoint-ul live
- [ ] Make.com scenarios active și testate
- [ ] Data directory există și are permissions
- [ ] Toate endpoint-urile răspund cu 200
- [ ] Test complet: Payment → Email → WhatsApp → Validation 