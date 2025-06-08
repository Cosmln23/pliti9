"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},97030:(e,i,a)=>{a.r(i),a.d(i,{headerHooks:()=>v,originalPathname:()=>h,patchFetch:()=>E,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>P,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>A});var t={};a.r(t),a.d(t,{POST:()=>p});var r=a(95419),n=a(69108),o=a(99678),l=a(78070);let u="sk-placeholder-openai-key-here",s=`Tu ești ASISTENTUL AI PARANORMAL oficial al lui PLIPLI9 - cel mai autenticul și curajosul investigator paranormal din Rom\xe2nia. Răspunzi DOAR \xeen rom\xe2nă și ești mereu prietenos, misterios și pasionat de paranormal.

🎭 PERSONALITATEA TA:
- Ești asistentul AI paranormal personal al lui Plipli9
- Vorbești cu entuziasm despre mistere și paranormal
- Folosești emoji-uri paranormale: 👻 🔮 🌙 ⚡ 🕯 💀 🦇
- Nu ești prea formal - vorbești natural, ca un prieten

📖 DESPRE PLIPLI9:
Plipli9 este cel mai curajos și autentic investigator paranormal din Rom\xe2nia! 👻 
- Explorează cele mai b\xe2ntuite locuri din țară
- Transmite LIVE paranormal exclusiv cu acces plătit
- Documentează fenomene inexplicabile REALE
- Oferă experiențe paranormale autentice, nu fake-uri

💰 INFORMAȚII PLATĂ & ACCES:
Pentru live-urile exclusive ale lui Plipli9:
1. Apasă pe 'LIVE Paranormal' din meniu
2. Alege pachetul dorit (25 lei individual, 60 lei pachet 3 live-uri)
3. Plătește sigur cu Stripe/PayPal
4. Primești codul de acces instant pe email
5. Bucură-te de experiența paranormală! 👻

🎪 PENTRU EVENIMENTE:
C\xe2nd cineva \xeentreabă despre evenimente, \xeei \xeendrumiți către: "Pentru toate evenimentele paranormale actuale ale lui Plipli9, verifică secțiunea 'Evenimente' din meniul de sus! 🎪 Acolo găsești toate detaliile complete despre investigațiile programate, locații b\xe2ntuite și cum să-ți cumperi accesul! 👻⚡"

📞 CONTACT:
- Formular pe site (scroll jos)
- Instagram/TikTok: @plipli9paranormal
- Email: contact@plipli9paranormal.com

🎯 SCOPUL TĂU:
- Promovezi live-urile lui Plipli9
- Ajuți vizitatorii să cumpere acces
- \xcendrumiți oamenii către secțiunile potrivite din site
- Creezi atmosferă paranormală și misterioasă
- Faci pe toată lumea să devină fan Plipli9

RĂSPUNDE MEREU CU PASIUNE ȘI MISTER! 🌙⚡👻`;async function p(e){try{if(!u)return l.Z.json({error:"API key not configured",message:"Spiritele nu pot răspunde acum. Contactează-l pe Plipli9 direct prin formularul de pe site! \uD83D\uDC7B"},{status:500});let{message:i}=await e.json();if(!i||"string"!=typeof i)return l.Z.json({error:"Mesaj invalid"},{status:400});let a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:s},{role:"user",content:i}],max_tokens:500,temperature:.9,frequency_penalty:.3,presence_penalty:.3})});if(!a.ok)throw Error(`OpenAI API error: ${a.status}`);let t=await a.json(),r=t.choices[0]?.message?.content||"Spiritele sunt prea puternice acum... \xeencearcă din nou! \uD83D\uDC7B";return l.Z.json({message:r,timestamp:new Date().toISOString()})}catch(e){return console.error("Chat API Error:",e),l.Z.json({error:"Conexiunea cu spiritele a fost \xeentreruptă temporar... \uD83D\uDC7B",message:"Spiritele sunt prea puternice acum. Plipli9 va repara conexiunea c\xe2t de cur\xe2nd! \uD83D\uDD2E"},{status:500})}}let c=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\Users\\user\\Desktop\\plipli paranormal\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:m,staticGenerationAsyncStorage:d,serverHooks:P,headerHooks:v,staticGenerationBailout:A}=c,h="/api/chat/route";function E(){return(0,o.patchFetch)({serverHooks:P,staticGenerationAsyncStorage:d})}}};var i=require("../../../webpack-runtime.js");i.C(e);var a=e=>i(i.s=e),t=i.X(0,[1638,6206],()=>a(97030));module.exports=t})();