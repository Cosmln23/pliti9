"use strict";(()=>{var a={};a.id=5125,a.ids=[5125],a.modules={30517:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},43083:(a,e,t)=>{t.r(e),t.d(e,{headerHooks:()=>d,originalPathname:()=>h,patchFetch:()=>A,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>f});var i={};t.r(i),t.d(i,{POST:()=>p});var o=t(95419),r=t(69108),s=t(99678),n=t(78070);async function p(a){try{let{phoneNumber:e,message:t,fallback_email:i}=await a.json();console.log("\uD83D\uDEA8 BACKUP NOTIFICATION - WhatsApp failed, using email");let o=`
🚨 NOTIFICARE BACKUP PARANORMAL

Mesajul WhatsApp a eșuat, folosim email-ul ca backup:

📱 Număr destinație: ${e}
💬 Mesaj original: ${t}

⚠️ WhatsApp Status: FAILED sau TIMEOUT
📧 Backup folosit: EMAIL

Verifică și pe WhatsApp \xeen caz că ajunge t\xe2rziu!

---
Plipli9 Paranormal - Backup System
    `;return await fetch("https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i||"admin@plipli9paranormal.com",subject:"\uD83D\uDEA8 WhatsApp BACKUP - Notificare Paranormal",message:o,backup_mode:!0})}),n.Z.json({success:!0,backup_used:"email",original_target:e,fallback_email:i||"admin@plipli9paranormal.com",message:"WhatsApp failed, email backup sent!"})}catch(a){return console.error("❌ Backup notification failed:",a),n.Z.json({success:!1,error:"Both WhatsApp and backup failed",message:"All notification methods failed"},{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/backup-notification/route",pathname:"/api/backup-notification",filename:"route",bundlePath:"app/api/backup-notification/route"},resolvedPagePath:"C:\\Users\\user\\Desktop\\plipli paranormal\\app\\api\\backup-notification\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:m,headerHooks:d,staticGenerationBailout:f}=u,h="/api/backup-notification/route";function A(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}}};var e=require("../../../webpack-runtime.js");e.C(a);var t=a=>e(e.s=a),i=e.X(0,[1638,6206],()=>t(43083));module.exports=i})();