"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},36946:(e,i,a)=>{a.r(i),a.d(i,{headerHooks:()=>g,originalPathname:()=>h,patchFetch:()=>v,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>u});var t={};a.r(t),a.d(t,{GET:()=>s});var o=a(95419),r=a(69108),l=a(99678),n=a(78070);async function s(){let e=process.env.NEXT_PUBLIC_APP_URL||"https://plipli9paranormal.com",i=[{url:e,lastModified:new Date,changeFrequency:"daily",priority:1,images:[`${e}/og-image.png`,`${e}/hero-paranormal.jpg`,`${e}/plipli9-photo.jpg`]},{url:`${e}/live`,lastModified:new Date,changeFrequency:"hourly",priority:.9,images:[`${e}/live-thumbnail.jpg`,`${e}/live-chat.png`],videos:[{thumbnail:`${e}/live-thumb.jpg`,title:"LIVE Paranormal cu Plipli9",description:"Investigații live \xeen locuri b\xe2ntuite"}]},{url:`${e}/videos`,lastModified:new Date,changeFrequency:"daily",priority:.8,images:[`${e}/videos-gallery.jpg`]},{url:`${e}/events`,lastModified:new Date,changeFrequency:"weekly",priority:.7,images:[`${e}/events-calendar.jpg`]},{url:`${e}/shop`,lastModified:new Date,changeFrequency:"weekly",priority:.6,images:[`${e}/shop-products.jpg`]},...["castele","cimitire","case-abandonate","experimente-paranormale","investigatii-live"].map(i=>({url:`${e}/videos/category/${i}`,lastModified:new Date,changeFrequency:"weekly",priority:.6}))],a=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- 🎃 Plipli9 Paranormal - Sitemap for Search Engines -->
  
  ${i.map(e=>`
  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
    <mobile:mobile/>
    ${e.images?e.images.map(e=>`
    <image:image>
      <image:loc>${e}</image:loc>
      <image:caption>Plipli9 Paranormal - Investigații \xeen locuri b\xe2ntuite</image:caption>
    </image:image>`).join(""):""}
    ${e.videos?e.videos.map(i=>`
    <video:video>
      <video:thumbnail_loc>${i.thumbnail}</video:thumbnail_loc>
      <video:title>${i.title}</video:title>
      <video:description>${i.description}</video:description>
      <video:content_loc>${e.url}</video:content_loc>
    </video:video>`).join(""):""}
  </url>`).join("")}
  
  <!-- Special paranormal investigation pages -->
  <url>
    <loc>${e}/live/paranormal-investigation</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
  </url>
  
  <url>
    <loc>${e}/videos/featured</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>
  
  <!-- Contact and info pages -->
  <url>
    <loc>${e}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
  </url>
  
</urlset>`;return new n.Z(a,{status:200,headers:{"Content-Type":"application/xml","Cache-Control":"s-maxage=86400, stale-while-revalidate"}})}let p=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"C:\\Users\\user\\Desktop\\plipli paranormal\\app\\api\\sitemap\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:m,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:g,staticGenerationBailout:u}=p,h="/api/sitemap/route";function v(){return(0,l.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:c})}}};var i=require("../../../webpack-runtime.js");i.C(e);var a=e=>i(i.s=e),t=i.X(0,[1638,6206],()=>a(36946));module.exports=t})();