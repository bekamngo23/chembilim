import re,time,shutil,json,os
d='/home/claude/pwa/'
src=open('/home/claude/site/pub/chembilim-offline.html').read()
ver=time.strftime('%Y%m%d%H%M')
head='''<meta name="theme-color" content="#1b6a9c">
<meta name="description" content="chembilim — қазақ тіліндегі интерактивті химия: сабақтар, 3D модельдер, бейне-сабақтар, тесттер.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="chembilim">
'''
src=src.replace('<meta name="viewport" content="width=device-width, initial-scale=1">','<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'+head,1)
assert 'manifest.webmanifest' in src
ui='''<style>
.pwa-bar{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:#0f2533;color:#fff;box-shadow:0 12px 40px rgba(0,0,0,.35);font:500 14px/1.35 system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;animation:pwaIn .35s ease}
.pwa-bar img{width:40px;height:40px;border-radius:10px;flex:0 0 40px}.pwa-bar b{display:block;font-size:15px}.pwa-bar small{opacity:.75}
.pwa-bar .pwa-go{margin-left:auto;border:0;border-radius:10px;background:#ffd54a;color:#10222b;font:700 14px system-ui,sans-serif;padding:10px 14px;min-height:44px;cursor:pointer}
.pwa-bar .pwa-x{border:0;background:transparent;color:#fff;font-size:22px;width:36px;height:44px;cursor:pointer;opacity:.7}
.pwa-ios{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
.pwa-ios>div{background:#fff;color:#10222b;width:100%;max-width:520px;border-radius:20px 20px 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom));font:15px/1.5 system-ui,-apple-system,sans-serif}
.pwa-ios ol{padding-left:20px;margin:10px 0 16px}.pwa-ios li{margin:6px 0}.pwa-ios button{width:100%;min-height:48px;border:0;border-radius:12px;background:#1b6a9c;color:#fff;font:700 15px system-ui,sans-serif}
.pwa-toast{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%);z-index:100001;background:#10222b;color:#fff;padding:10px 14px;border-radius:12px;font:600 14px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;gap:10px;align-items:center}
.pwa-toast button{border:0;border-radius:8px;background:#ffd54a;color:#10222b;font-weight:700;padding:6px 10px;min-height:36px}
@keyframes pwaIn{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
@media (display-mode:standalone){.pwa-bar{display:none!important}}
</style>
<script>
(function(){
var standalone=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
/* офлайн кэш (service worker) */
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(reg){
  reg.addEventListener("updatefound",function(){var nw=reg.installing;nw&&nw.addEventListener("statechange",function(){if(nw.state==="installed"&&navigator.serviceWorker.controller){var t=document.createElement("div");t.className="pwa-toast";t.innerHTML='Жаңа нұсқа дайын <button type="button">Жаңарту</button>';t.querySelector("button").onclick=function(){location.reload();};document.body.appendChild(t);}});});
 }).catch(function(){});});}
if(standalone||ls("pwa-hide")==="1")return;
var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
var mobile=isIOS||/android/i.test(navigator.userAgent);
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;show();});
function show(){if(document.querySelector(".pwa-bar"))return;var b=document.createElement("div");b.className="pwa-bar";b.setAttribute("role","dialog");b.setAttribute("aria-label","Қосымшаны орнату");
 b.innerHTML='<img src="icon-192.png" alt=""><div><b>chembilim қосымшасы</b><small>Телефонға орнатып, интернетсіз ашыңыз</small></div><button type="button" class="pwa-go">Орнату</button><button type="button" class="pwa-x" aria-label="Жабу">×</button>';
 document.body.appendChild(b);
 b.querySelector(".pwa-x").onclick=function(){b.remove();ls("pwa-hide","1");};
 b.querySelector(".pwa-go").onclick=function(){if(deferred){deferred.prompt();deferred.userChoice.then(function(){b.remove();deferred=null;});}else if(isIOS){iosHelp();}else{alert("Браузер мәзірінен «Установить приложение» немесе «Добавить на главный экран» таңдаңыз.");}};}
function iosHelp(){var o=document.createElement("div");o.className="pwa-ios";o.innerHTML='<div><b style="font-size:18px">iPhone-ға орнату</b><ol><li>Safari-дің төменгі жағындағы <b>«Поделиться»</b> батырмасын басыңыз (жоғары қараған көрсеткісі бар шаршы).</li><li>Тізімнен <b>«На экран „Домой“»</b> таңдаңыз.</li><li>Оң жақ жоғарыдағы <b>«Добавить»</b> басыңыз.</li></ol><p style="margin:0 0 14px;color:#4a5e66">Сосын chembilim белгісі экранда пайда болады және интернетсіз ашылады. Тек Safari арқылы жұмыс істейді.</p><button type="button">Түсінікті</button></div>';o.onclick=function(e){if(e.target===o||e.target.tagName==="BUTTON")o.remove();};document.body.appendChild(o);}
if(mobile&&isIOS)setTimeout(show,2500);
})();
</script>
'''
src=src.replace('</body></html>',ui+'</body></html>')
open(d+'index.html','w').write(src)
man={"name":"chembilim — интерактивті химия","short_name":"chembilim","description":"Қазақ тіліндегі интерактивті химия: сабақтар, 3D модельдер, бейне-сабақтар, тесттер.","lang":"kk","start_url":"./","scope":"./","display":"standalone","orientation":"any","background_color":"#0d1a24","theme_color":"#1b6a9c","categories":["education"],
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
json.dump(man,open(d+'manifest.webmanifest','w'),ensure_ascii=False,indent=1)
sw='''/* chembilim офлайн кэші */
const V="chembilim-%s";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-180.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith("chembilim-")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put("./index.html",cp));return res;}).catch(()=>caches.match("./index.html")));return;}
 if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;})));return;}
 if(/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){e.respondWith(caches.open(V+"-fonts").then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{c.put(r,res.clone());return res;}).catch(()=>m);return m||f;})));}
});
'''%ver
open(d+'sw.js','w').write(sw)
open(d+'.nojekyll','w').write('')
print('ok',len(src),ver)
