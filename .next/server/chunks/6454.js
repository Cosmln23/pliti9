"use strict";exports.id=6454,exports.ids=[6454],exports.modules={6454:(e,o,t)=>{t.d(o,{$L:()=>r,E7:()=>l});var i=t(83949),a=t(45259);let n={payment_success:"https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n",whatsapp_test:"https://hook.eu2.make.com/ida0ge74962m4ske2bw78ywj9szu54ie",live_started:"https://hook.eu1.make.com/placeholder_live_started",reminder_2h:"https://hook.eu1.make.com/placeholder_reminder",live_ended:process.env.MAKE_LIVE_ENDED_WEBHOOK_URL};async function r(e){try{let o;if(console.log("\uD83D\uDE80 Sending webhook to Make.com:",{code:e.accessCode,email:e.email,phone:e.phoneNumber,amount:e.amount,webhook_url:n.payment_success}),!n.payment_success)return console.warn("Make.com payment webhook URL not configured"),!1;let t={email:e.email,accessCode:e.accessCode,expiresAt:"Expiră la sf\xe2rșitul transmisiunii LIVE",expiresAtWhatsApp:"Expiră c\xe2nd se termină transmisia LIVE",expiresAtTechnical:e.expiresAt,liveUrl:e.liveUrl,phoneNumber:e.phoneNumber,amount:e.amount,paymentMethod:e.paymentMethod,timestamp:e.timestamp,emailTemplate:(0,a.TB)(e.accessCode,e.expiresAt,e.liveUrl),whatsappTemplate:(0,a.dR)(e.accessCode,e.expiresAt,e.liveUrl),expiryFriendlyText:"Expiră la sf\xe2rșitul transmisiunii LIVE",whatsappExpiryText:"Expiră c\xe2nd se termină transmisia LIVE"};console.log("\uD83D\uDCE8 PAYLOAD SENT TO MAKE.COM:",JSON.stringify(t,null,2)),console.log("\uD83D\uDCE7 VARIABILE DISPONIBILE \xceN MAKE.COM:"),console.log("\uD83C\uDFAF DESTINATARI (LA CINE SĂ TRIMIȚI):"),console.log("{{1.email}} = (DESTINATAR EMAIL)",t.email),console.log("{{1.phoneNumber}} = (DESTINATAR WHATSAPP)",t.phoneNumber),console.log("\uD83D\uDCDD DATE PENTRU PERSONALIZARE:"),console.log("{{1.accessCode}} =",t.accessCode),console.log("{{1.amount}} =",t.amount),console.log("{{1.liveUrl}} =",t.liveUrl),console.log("{{1.paymentMethod}} =",t.paymentMethod),console.log("{{1.whatsappExpiryText}} =",t.whatsappExpiryText),console.log("\uD83D\uDCE7 MESAJE COMPLETE GATA DE TRIMITERE:"),console.log("{{1.emailTemplate}} = (MESAJ COMPLET PENTRU EMAIL)",t.emailTemplate?"GENERAT":"NULL"),console.log("{{1.whatsappTemplate}} = (MESAJ COMPLET PENTRU WHATSAPP)",t.whatsappTemplate?"GENERAT":"NULL"),console.log("\uD83D\uDD25 TEMPLATE EMAIL COMPLET:"),console.log(t.emailTemplate),console.log("\uD83D\uDD25 TEMPLATE WHATSAPP COMPLET:"),console.log(t.whatsappTemplate);let r=await i.Z.post(n.payment_success,t,{headers:{"Content-Type":"application/json","X-Webhook-Source":"plipli9-paranormal","X-Webhook-Secret":"dev_webhook_secret_2024"},timeout:1e4});console.log("✅ Gmail notification sent to Make.com:",r.status),await new Promise(e=>setTimeout(e,2e3));try{console.log("\uD83D\uDCF1 Sending WhatsApp webhook after delay..."),o=await i.Z.post(n.whatsapp_test,t,{headers:{"Content-Type":"application/json","X-Webhook-Source":"plipli9-paranormal-whatsapp","X-Webhook-Secret":"dev_webhook_secret_2024"},timeout:15e3}),console.log("✅ WhatsApp notification sent to Make.com:",o.status),console.log("\uD83D\uDCF1 WhatsApp should arrive at phone in 1-5 seconds")}catch(e){console.error("❌ WhatsApp webhook failed:",e),console.error("\uD83D\uDD27 Possible causes: Twilio rate limit, Make.com scenario issue, or phone number format")}return!0}catch(e){return console.error("❌ Error sending payment notification to Make.com:",e),!1}}async function l(e){try{if(!n.live_started)return console.warn("Make.com live started webhook URL not configured"),!1;let o={event_type:"live_started",timestamp:e.startTime,session:{id:e.sessionId,playback_url:e.playbackUrl,location:e.location,estimated_duration:e.estimatedDuration,source:e.source},notifications:{broadcast_to_active_codes:!0,send_social_media_posts:!0,template_type:"live_started_alert"},stats:{active_codes_count:e.activeCodesCount||0,estimated_viewers:Math.floor(.7*(e.activeCodesCount||0))}},t=await i.Z.post(n.live_started,o,{headers:{"Content-Type":"application/json","X-Webhook-Source":"plipli9-paranormal","X-Webhook-Secret":"dev_webhook_secret_2024"},timeout:1e4});return console.log("\uD83D\uDD34 Live started notification sent to Make.com:",t.status),!0}catch(e){return console.error("❌ Error sending live started notification to Make.com:",e),!1}}},45259:(e,o,t)=>{t.d(o,{TB:()=>c,_z:()=>s,dR:()=>p});var i=t(18378),a=t.n(i),n=t(61584),r=t.n(n),l=t(31097);async function s(e,o){let t="payment"===e?"https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n":"https://hook.eu1.make.com/placeholder_live_started";if(!t){console.warn(`Make.com webhook URL not configured for type: ${e}`);return}try{let i=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer dev_webhook_secret_2024"},body:JSON.stringify(o)});if(!i.ok)throw Error(`Make.com webhook failed: ${i.status}`);console.log(`Make.com webhook triggered successfully for ${e}`)}catch(o){console.error(`Make.com webhook error for ${e}:`,o)}}function c(e,o,t){return`
<!DOCTYPE html>
<html>
<head>
    <title>🎃 Plipli9 Paranormal - Cod Acces LIVE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#0f172a; color:#ffffff; font-family:Arial,sans-serif;">
    <div style="max-width:600px; margin:0 auto; padding:20px;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:30px;">
            <h1 style="color:#d946ef; font-size:32px; margin:0;">🎃 PLIPLI9</h1>
            <h2 style="color:#94a3b8; font-size:18px; margin:10px 0 0 0;">PARANORMAL EXPERIENCE</h2>
        </div>
        
        <!-- Cod de acces -->
        <div style="background:#1e293b; padding:30px; border-radius:15px; text-align:center; margin:20px 0;">
            <h3 style="color:#22c55e; font-size:16px; margin:0 0 10px 0;">CODUL TĂU DE ACCES</h3>
            <div style="background:#0f172a; padding:20px; border-radius:10px; margin:15px 0;">
                <span style="color:#22c55e; font-size:40px; font-weight:bold; letter-spacing:3px;">${e}</span>
            </div>
            <p style="color:#f59e0b; font-weight:bold; margin:15px 0 5px 0;">⏰ VALABIL 8 ORE</p>
            <p style="color:#94a3b8; margin:0; font-size:14px;">Expiră la sf\xe2rșitul transmisiunii LIVE</p>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align:center; margin:30px 0;">
            <a href="${t}" style="background:linear-gradient(135deg, #d946ef, #9333ea); color:white; padding:18px 40px; text-decoration:none; border-radius:12px; font-size:18px; font-weight:bold; display:inline-block; box-shadow:0 4px 15px rgba(217,70,239,0.3);">
                🔴 INTRĂ \xceN LIVE ACUM
            </a>
        </div>
        
        <!-- Benefits -->
        <div style="background:#16a34a; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#dcfce7; margin:0 0 15px 0; font-size:16px;">✅ ACCES FLEXIBIL</h4>
            <ul style="color:#dcfce7; margin:0; padding-left:20px; line-height:1.6;">
                <li>Poți intra și ieși de c\xe2te ori vrei \xeen 8 ore</li>
                <li>Acces de pe telefon, tablet sau computer</li>
                <li>Chat live cu alți participanți</li>
            </ul>
        </div>
        
        <!-- Technical Protection -->
        <div style="background:#1e40af; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#dbeafe; margin:0 0 15px 0; font-size:16px;">🛡️ PROTECȚIE TEHNICĂ</h4>
            <p style="color:#dbeafe; margin:0; line-height:1.6;">
                Chiar dacă LIVE-ul se \xeentrerupe din probleme tehnice, codul tău răm\xe2ne valabil! 
                Poți intra din nou c\xe2nd se reia transmisia.
            </p>
        </div>
        
        <!-- Instructions -->
        <div style="background:#374151; padding:20px; border-radius:12px; margin:25px 0;">
            <h4 style="color:#f3f4f6; margin:0 0 15px 0;">📱 CUM FUNCȚIONEAZĂ:</h4>
            <ol style="color:#d1d5db; margin:0; padding-left:25px; line-height:1.8;">
                <li>Click pe butonul "INTRĂ \xceN LIVE ACUM"</li>
                <li>Introdu codul de acces pe pagina LIVE</li>
                <li>Bucură-te de experiența paranormală \xeen direct!</li>
                <li>Folosește chat-ul pentru a interacționa</li>
                <li>Poți ieși și intra din nou oric\xe2nd \xeen 8 ore</li>
            </ol>
        </div>
        
        <!-- Footer -->
        <div style="text-align:center; margin-top:40px; padding-top:20px; border-top:1px solid #374151;">
            <p style="color:#6b7280; font-size:12px; margin:0;">
                Probleme? Scrie-ne la <a href="mailto:contact@plipli9paranormal.com" style="color:#d946ef;">contact@plipli9paranormal.com</a>
            </p>
            <p style="color:#6b7280; font-size:12px; margin:10px 0 0 0;">
                \xa9 2024 Plipli9 Paranormal. Nu \xeempărtăși codul cu nimeni!
            </p>
        </div>
    </div>
</body>
</html>
  `}function p(e,o,t){return`🎃 *PLIPLI9 PARANORMAL* 🎃

✅ *Plata confirmată!*

━━━━━━━━━━━━━━━━━━━━━━━━
🎫 *COD DE ACCES:*
*${e}*
━━━━━━━━━━━━━━━━━━━━━━━━

⏰ *VALABIL 8 ORE*
Expiră c\xe2nd se termină transmisia LIVE

🔴 *Link LIVE:*
${t}

✅ *BENEFICII:*
• Poți intra/ieși oric\xe2nd \xeen 8h
• Chiar dacă se \xeentrerupe, codul răm\xe2ne valabil
• Acces de pe orice device
• Chat live cu alți participanți

🎭 Bucură-te de experiența paranormală! 👻

_Nu \xeempărtăși codul cu nimeni!_`}a()("AC_placeholder_twilio_sid","placeholder_twilio_token"),r().setApiKey("SG-placeholder-sendgrid-key-here"),new l.Livepeer({apiKey:process.env.LIVEPEER_API_KEY})}};