"use strict";(()=>{var e={};e.id=792,e.ids=[792],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},39096:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>_,originalPathname:()=>y,patchFetch:()=>v,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g,staticGenerationBailout:()=>f});var i={};r.r(i),r.d(i,{GET:()=>u,POST:()=>p});var a=r(95419),s=r(69108),n=r(99678),o=r(78070),c=r(95752),l=r(24522),d=r(45259);async function p(e){try{let t=await e.json();if(!t.email||!t.amount||!t.paymentMethod)return o.Z.json({error:"Date incomplete: email, amount și paymentMethod sunt obligatorii"},{status:400});if(!(0,c.vV)(t.email))return o.Z.json({error:"Email invalid"},{status:400});if(25!==t.amount)return o.Z.json({error:"Sumă invalidă pentru LIVE paranormal"},{status:400});let r=(0,c.Bm)(),i=new Date;i.setHours(i.getHours()+8),await (0,l.OF)({code:r,email:t.email,phone_number:t.phone_number,payment_intent_id:t.paymentIntentId,amount:t.amount,payment_method:t.paymentMethod,expires_at:i,status:"active",usage_count:0,ip_address:e.ip||e.headers.get("x-forwarded-for")||void 0});let a={accessCode:r,email:t.email,phone_number:t.phone_number,amount:t.amount,paymentMethod:t.paymentMethod,paymentIntentId:t.paymentIntentId,expiresAt:i.toISOString(),createdAt:new Date().toISOString(),status:"active",type:"live_access"};try{await (0,d._z)("payment",a)}catch(e){console.error("Eroare trimitere webhook Make.com:",e)}return console.log("Payment processed and access code generated:",{email:t.email,accessCode:r,expiresAt:i.toISOString(),phone_number:t.phone_number}),o.Z.json({success:!0,message:"Plata procesată cu succes",data:{accessCode:r,expiresAt:i.toISOString(),email:t.email,phone_number:t.phone_number,valid_hours:8,access_type:"flexible_reentry"},automation:{email_notification:"se trimite automat",whatsapp_notification:t.phone_number?"se trimite automat":"nu este disponibil",estimated_delivery:"1-2 minute"},instructions:"Codul de acces va fi trimis prin email și WhatsApp (dacă este disponibil) \xeen maxim 2 minute"})}catch(e){return console.error("Eroare procesare webhook payment-success:",e),o.Z.json({error:"Eroare internă server",message:"Nu s-a putut procesa plata"},{status:500})}}async function u(){return o.Z.json({service:"Plipli9 Paranormal Payment Webhook",status:"active",timestamp:new Date().toISOString(),version:"2.0",features:{database:"PlanetScale Cloud",automation:"Make.com",notifications:"Email + WhatsApp dual",access_duration:"8 hours flexible",resilience:"Technical interruption safe"},endpoints:{payment_success:"/api/webhooks/payment-success",access_create:"/api/access-codes/create",access_validate:"/api/access-codes/validate",live_current:"/api/live-sessions/current"}})}let m=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/webhooks/payment-success/route",pathname:"/api/webhooks/payment-success",filename:"route",bundlePath:"app/api/webhooks/payment-success/route"},resolvedPagePath:"C:\\Users\\user\\Desktop\\plipli paranormal\\app\\api\\webhooks\\payment-success\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:x,headerHooks:_,staticGenerationBailout:f}=m,y="/api/webhooks/payment-success/route";function v(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}},24522:(e,t,r)=>{r.d(t,{TC:()=>p,OF:()=>a,VT:()=>c,Xg:()=>s,en:()=>n,RG:()=>o,yj:()=>d,B6:()=>u,xL:()=>l});let i=new(require("pg")).Pool({connectionString:"postgresql://localhost:5432/plipli9_local"});async function a(e){return(await i.query(`INSERT INTO access_codes (code, email, phone_number, payment_intent_id, amount, payment_method, expires_at, status, usage_count, ip_address) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,[e.code,e.email,e.phone_number,e.payment_intent_id,e.amount,e.payment_method,e.expires_at,e.status,e.usage_count,e.ip_address])).rows[0]}async function s(e){let t=await i.query("SELECT * FROM access_codes WHERE code = $1 LIMIT 1",[e]);return t.rows.length>0?t.rows[0]:null}async function n(){return(await i.query("SELECT * FROM access_codes WHERE status = $1 AND expires_at > NOW()",["active"])).rows}async function o(){let e=await i.query("SELECT * FROM live_sessions WHERE status = $1 ORDER BY started_at DESC LIMIT 1",["active"]);return e.rows.length>0?e.rows[0]:null}async function c(e){await i.query("UPDATE live_sessions SET status = $1, ended_at = NOW() WHERE session_id = $2",["ended",e])}async function l(e){try{let t=e.trim().toUpperCase(),r=await i.query(`SELECT * FROM access_codes 
       WHERE code = $1 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP`,[t]);if(0===r.rows.length)return null;return r.rows[0]}catch(e){return console.error("Eroare validare cod acces:",e),null}}async function d(e,t){try{let r=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return await i.query(`UPDATE access_codes 
       SET 
         active_session_id = $1,
         active_device_info = $2,
         session_started_at = CURRENT_TIMESTAMP,
         last_activity_at = CURRENT_TIMESTAMP
       WHERE code = $3`,[r,JSON.stringify(t),e]),{success:!0,sessionId:r}}catch(e){throw console.error("Eroare pornire sesiune:",e),e}}async function p(e,t){try{let r=await i.query(`SELECT 
        active_session_id, 
        active_device_info, 
        session_started_at,
        status,
        expires_at
      FROM access_codes 
      WHERE code = $1`,[e]);if(0===r.rows.length)return{canAccess:!1,needsTakeover:!1,message:"Cod invalid sau expirat"};let a=r.rows[0];if(new Date>new Date(a.expires_at))return{canAccess:!1,needsTakeover:!1,message:"Cod expirat"};if(!a.active_session_id)return{canAccess:!0,needsTakeover:!1,message:"Cod disponibil pentru utilizare"};let s=a.active_device_info;if(s&&s.userAgent===t.userAgent&&s.ip===t.ip)return{canAccess:!0,needsTakeover:!1,message:"Sesiune existentă pe același dispozitiv"};return{canAccess:!1,needsTakeover:!0,currentDevice:{userAgent:s?.userAgent||"Unknown",ip:s?.ip||"Unknown",connectedAt:a.session_started_at,sessionId:a.active_session_id},message:"Cod \xeen folosință pe alt dispozitiv"}}catch(e){throw console.error("Eroare verificare sesiune:",e),e}}async function u(e,t){try{let r=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return await i.query(`UPDATE access_codes 
       SET 
         active_session_id = $1,
         active_device_info = $2,
         session_started_at = CURRENT_TIMESTAMP,
         last_activity_at = CURRENT_TIMESTAMP,
         status = 'in_use',
         previous_sessions = previous_sessions || $3::jsonb
       WHERE code = $4`,[r,JSON.stringify(t),JSON.stringify([{...t,takenAt:new Date().toISOString(),action:"takeover"}]),e]),{success:!0,sessionId:r}}catch(e){throw console.error("Eroare takeover sesiune:",e),e}}},45259:(e,t,r)=>{r.d(t,{TB:()=>l,_z:()=>c,dR:()=>d});var i=r(18378),a=r.n(i),s=r(61584),n=r.n(s),o=r(31097);async function c(e,t){let r="payment"===e?"https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n":"https://hook.eu1.make.com/placeholder_live_started";if(!r){console.warn(`Make.com webhook URL not configured for type: ${e}`);return}try{let i=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer dev_webhook_secret_2024"},body:JSON.stringify(t)});if(!i.ok)throw Error(`Make.com webhook failed: ${i.status}`);console.log(`Make.com webhook triggered successfully for ${e}`)}catch(t){console.error(`Make.com webhook error for ${e}:`,t)}}function l(e,t,r){return`
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
            <a href="${r}" style="background:linear-gradient(135deg, #d946ef, #9333ea); color:white; padding:18px 40px; text-decoration:none; border-radius:12px; font-size:18px; font-weight:bold; display:inline-block; box-shadow:0 4px 15px rgba(217,70,239,0.3);">
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
  `}function d(e,t,r){return`🎃 *PLIPLI9 PARANORMAL* 🎃

✅ *Plata confirmată!*

━━━━━━━━━━━━━━━━━━━━━━━━
🎫 *COD DE ACCES:*
*${e}*
━━━━━━━━━━━━━━━━━━━━━━━━

⏰ *VALABIL 8 ORE*
Expiră c\xe2nd se termină transmisia LIVE

🔴 *Link LIVE:*
${r}

✅ *BENEFICII:*
• Poți intra/ieși oric\xe2nd \xeen 8h
• Chiar dacă se \xeentrerupe, codul răm\xe2ne valabil
• Acces de pe orice device
• Chat live cu alți participanți

🎭 Bucură-te de experiența paranormală! 👻

_Nu \xeempărtăși codul cu nimeni!_`}a()("AC_placeholder_twilio_sid","placeholder_twilio_token"),n().setApiKey("SG-placeholder-sendgrid-key-here"),new o.Livepeer({apiKey:process.env.LIVEPEER_API_KEY})},95752:(e,t,r)=>{function i(){let e=Date.now().toString(),t=Math.random().toString(36).substring(2,8).toUpperCase();return`PLI${e.slice(-3)}${t.slice(0,3)}`}function a(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}r.d(t,{Bm:()=>i,CW:()=>c,Iy:()=>n,s$:()=>o,vV:()=>a});let s=new Map;function n(e,t=5,r=6e4){let i=Date.now();Array.from(s.entries()).forEach(([e,t])=>{t.resetTime<i&&s.delete(e)});let a=s.get(e);return!a||a.resetTime<i?(s.set(e,{count:1,resetTime:i+r}),{allowed:!0,remaining:t-1,resetTime:i+r}):a.count>=t?{allowed:!1,remaining:0,resetTime:a.resetTime}:(a.count++,s.set(e,a),{allowed:!0,remaining:t-a.count,resetTime:a.resetTime})}function o(e){let t=e.headers.get("x-forwarded-for"),r=e.headers.get("x-real-ip"),i=e.headers.get("remote-addr"),a=t?.split(",")[0]?.trim()||r||i||"unknown",s=(e.headers.get("user-agent")||"unknown").substring(0,50);return`${a}:${s}`}function c(e){if("string"!=typeof e)return{isValid:!1,error:"Codul trebuie să fie string"};let t=e.trim().toUpperCase().replace(/[-\s]/g,"");return 0===t.length?{isValid:!1,error:"Cod de acces este obligatoriu"}:/^PLI\d{3}[A-Z]{3}$/.test(t)?{isValid:!0,sanitized:t}:{isValid:!1,error:"Format cod invalid (format așteptat: PLI123ABC)"}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[1638,6206,7257,1097,1209],()=>r(39096));module.exports=i})();