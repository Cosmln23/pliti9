"use strict";(()=>{var e={};e.id=7908,e.ids=[7908],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27382:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>g,originalPathname:()=>f,patchFetch:()=>b,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>x});var i={};a.r(i),a.d(i,{GET:()=>d,dynamic:()=>m});var r=a(95419),s=a(69108),o=a(99678),n=a(78070),l=a(55349);async function d(e){try{let e=(0,l._U)("plipli9-paranormal-live",5),t=e.map(e=>({username:e.username,message:e.message,time:new Date(e.timestamp).toLocaleTimeString("ro-RO",{hour:"2-digit",minute:"2-digit"}),isAdmin:"admin"===e.type})),a=`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PLIPLI9 Chat Mobile</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: transparent; 
            font-family: Arial, sans-serif;
            color: white;
            overflow: hidden;
        }
        .chat-overlay {
            position: fixed;
            bottom: 60px;
            left: 10px;
            right: 10px;
            max-height: 300px;
            overflow: hidden;
            z-index: 9999;
        }
        .message {
            background: rgba(0,0,0,0.8);
            margin-bottom: 8px;
            padding: 12px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s ease-out;
            max-width: 90%;
        }
        .username {
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .admin { color: #fbbf24; }
        .user { color: #a855f7; }
        .message-text {
            font-size: 16px;
            line-height: 1.4;
        }
        .time {
            font-size: 12px;
            color: #9ca3af;
            margin-left: 8px;
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9999;
        }
        .live-indicator {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
            animation: pulse 2s infinite;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="status">
        <span class="live-indicator"></span>
        ${e.length} mesaje LIVE
    </div>
    
    <div class="chat-overlay">
        ${t.map(e=>`
            <div class="message">
                <div class="username ${e.isAdmin?"admin":"user"}">
                    ${e.username}${e.isAdmin?" \uD83D\uDC51":""}
                    <span class="time">${e.time}</span>
                </div>
                <div class="message-text">${e.message}</div>
            </div>
        `).join("")}
    </div>

    <script>
        // Auto-refresh la 3 secunde
        setInterval(() => {
            window.location.reload();
        }, 3000);
    </script>
</body>
</html>`;return new n.Z(a,{headers:{"Content-Type":"text/html","Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}catch(e){return console.error("Mobile API Error:",e),n.Z.json({error:"Failed to fetch mobile messages"},{status:500})}}let m="force-dynamic",p=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/chat/mobile/route",pathname:"/api/chat/mobile",filename:"route",bundlePath:"app/api/chat/mobile/route"},resolvedPagePath:"C:\\Users\\user\\Desktop\\plipli paranormal\\app\\api\\chat\\mobile\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:h,headerHooks:g,staticGenerationBailout:x}=p,f="/api/chat/mobile/route";function b(){return(0,o.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:u})}},55349:(e,t,a)=>{a.d(t,{Hz:()=>o,_U:()=>n});let i=[],r=1,s=[{id:"demo-1",streamId:"plipli9-paranormal-live",username:"PLIPLI9",message:"Bună seara tuturor! \uD83D\uDC7B",timestamp:new Date().toISOString(),type:"admin",likes:0}];function o(e){let t={...e,id:r.toString()};i.push(t),r++;let a=i.filter(t=>t.streamId===e.streamId);if(a.length>100){let t=a.length-100;for(let a=0;a<t;a++){let t=i.findIndex(t=>t.streamId===e.streamId);-1!==t&&i.splice(t,1)}}return t}function n(e,t=50){return i.filter(t=>t.streamId===e).slice(-t).sort((e,t)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())}0===i.length&&i.push(...s)}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[1638,6206],()=>a(27382));module.exports=i})();