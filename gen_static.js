/* JavaScript-сіз оқылатын статикалық беттер: learn/…, sitemap.xml, robots.txt */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const SRC=process.argv[2],OUT=process.argv[3],BASE='https://bekamngo23.github.io/chembilim/';
(async()=>{
 const b=await chromium.launch();const p=await b.newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('chb_role','student')}catch(e){}});
 await p.goto('file://'+SRC+'#home');await p.waitForTimeout(2500);
 const D=await p.evaluate(()=>{
  const strip=h=>h.replace(/<div class="viz"[^>]*><\/div>/g,'').replace(/<(button|svg|canvas)[\s\S]*?<\/\1>/g,'').replace(/\son\w+="[^"]*"/g,'');
  const ids=["gen","inorg","org","acbook","phys","bio","tech"];const C=[];
  ids.forEach(id=>{const c=CRS[id];if(!c||!c.L)return;
   C.push({id,n:c.n,L:c.L.map((l,i)=>{const X=(typeof LX!=="undefined"&&LX[l.id])||{};
    const body=l.body.concat(X.add||[]).filter(x=>x.t!=="viz");let h="";
    body.forEach(x=>{try{h+=lxBlock(x);}catch(e){}});
    const qs=(l.check||[]).concat(X.q||[]).map(q=>({q:rich(q[0]),a:rich(q[1]),e:rich(q[5]||"")}));
    return {id:l.id,n:i+1,t:fmt(l.t),tt:String(l.t).replace(/[\^_{}*]/g,""),lead:rich(l.lead||""),h:strip(h),qs};})});});
  const ION=[];(CAT_ORDER||[]).forEach(k=>{const x=CAT[k];if(x)ION.push({f:fmt(x.f),n:x.n,k:"Катион",rx:x.rx.map(r=>[fmt(r[0]),fmt(r[1]),r[4]?fmt(r[4]):""])});});
  (ANI_ORDER||[]).forEach(k=>{const x=ANI[k];if(x)ION.push({f:fmt(x.f),n:x.n,k:"Анион",rx:x.rx.map(r=>[fmt(r[0]),fmt(r[1]),r[4]?fmt(r[4]):""])});});
  const G=(typeof GLOSS!=="undefined"?GLOSS:[]).map(g=>[fmt(g[0]),rich(g[1])]);
  return {C,ION,G};
 });
 await b.close();
 const css=`:root{color-scheme:light dark;--bg:#f6f8f9;--ink:#17252d;--ink2:#56656d;--line:#dce3e7;--card:#fff;--acc:#1b6a9c}
@media (prefers-color-scheme:dark){:root{--bg:#0f1a20;--ink:#e6eef2;--ink2:#a5b4bc;--line:#2a3a43;--card:#16242c;--acc:#6fb7e6}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.65 "Open Sans",system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 64px}a{color:var(--acc)}h1{font-size:30px;line-height:1.25;margin:8px 0 10px}h2{font-size:22px;margin:28px 0 8px}h3{font-size:18px}
.crumb{font-size:14px;color:var(--ink2)}.lead{font-size:18px;color:var(--ink2)}.open{display:inline-block;margin:10px 0 18px;padding:10px 16px;border:1px solid var(--line);border-radius:12px;background:var(--card);text-decoration:none;font-weight:600}
.eq,.note,.lx-box,.rd-def,details,.acd-flow{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:12px 0;background:var(--card)}table{border-collapse:collapse;width:100%;font-size:15px;margin:12px 0}td,th{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.q{border-top:1px solid var(--line);padding:10px 0}.q small{color:var(--ink2)}nav.pg{display:flex;justify-content:space-between;gap:12px;margin-top:32px;font-size:15px}ul.ls{padding-left:20px}footer{color:var(--ink2);font-size:13px;margin-top:40px}`;
 const page=(title,desc,canon,body,depth)=>{const up='../'.repeat(depth);return `<!doctype html><html lang="kk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — chembilim</title><meta name="description" content="${desc.replace(/"/g,'&quot;').slice(0,160)}"><link rel="canonical" href="${BASE+canon}"><link rel="icon" href="${up}icon-192.png"><style>${css}</style></head><body><main>${body}<footer>© chembilim · Uazkhanov Beksultan · <a href="${up}learn/index.html">Барлық сабақтар</a> · <a href="${up}">Интерактив сайт</a></footer></main></body></html>`;};
 const txt=h=>h.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
 fs.rmSync(OUT+'learn',{recursive:true,force:true});const urls=['','learn/index.html','learn/reactions.html','learn/glossary.html'];
 let idx='<p class="crumb">chembilim · мәтіндік нұсқа</p><h1>Химия сабақтары</h1><p class="lead">Қазақ тіліндегі интерактивті химия платформасының мәтіндік нұсқасы. Әр сабақтың толық интерактив түрі (3D, анимация, тест) негізгі сайтта ашылады.</p><a class="open" href="../">Интерактив сайтты ашу →</a><p><a href="reactions.html">Сапалық реакциялар анықтамалығы</a> · <a href="glossary.html">Химиялық терминдер сөздігі</a></p>';
 D.C.forEach(c=>{fs.mkdirSync(OUT+'learn/'+c.id,{recursive:true});idx+=`<h2>${c.n}</h2><ol class="ls">`;
  c.L.forEach((l,i)=>{const pv=c.L[i-1],nx=c.L[i+1];const f=`learn/${c.id}/${l.id}.html`;urls.push(f);idx+=`<li><a href="${c.id}/${l.id}.html">${l.t}</a></li>`;
   const qs=l.qs.length?`<h2>Біліміңді тексер</h2>`+l.qs.map((q,k)=>`<div class="q"><b>${k+1}. ${q.q}</b><br>Жауабы: ${q.a}${q.e?`<br><small>${q.e}</small>`:''}</div>`).join(''):'';
   const body=`<p class="crumb"><a href="../index.html">Сабақтар</a> · ${c.n} · ${l.n}-${c.id==='acbook'?'тарау':'сабақ'}</p><h1>${l.t}</h1><p class="lead">${l.lead}</p><a class="open" href="../../#${c.id}/${l.id}">Интерактив нұсқасын ашу (3D, анимация, тест) →</a>${l.h}${qs}<nav class="pg">${pv?`<a href="${pv.id}.html">← ${pv.t}</a>`:'<span></span>'}${nx?`<a href="${nx.id}.html">${nx.t} →</a>`:''}</nav>`;
   fs.writeFileSync(OUT+f,page(l.tt+' · '+c.n,txt(l.lead)||l.tt,f,body,2));});idx+='</ol>';});
 fs.writeFileSync(OUT+'learn/index.html',page('Химия сабақтары','Қазақ тіліндегі химия сабақтары: жалпы, бейорганикалық, органикалық, аналитикалық, физикалық химия, биохимия.','learn/index.html',idx,1));
 const rx='<p class="crumb"><a href="index.html">Сабақтар</a> · Анықтамалық</p><h1>Сапалық реакциялар</h1><p class="lead">Катиондар мен аниондарды анықтайтын реакциялар: реактив, байқалатын белгі және иондық теңдеу.</p><a class="open" href="../#ref/qcat">Интерактив кестені ашу →</a>'+D.ION.map(x=>`<h2>${x.f} — ${x.n} <small>(${x.k})</small></h2><table><tr><th>Реактив</th><th>Белгі</th><th>Теңдеу</th></tr>${x.rx.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`).join('');
 fs.writeFileSync(OUT+'learn/reactions.html',page('Сапалық реакциялар','Катиондар мен аниондарға сапалық реакциялар: реактив, белгі, иондық теңдеу.','learn/reactions.html',rx,1));
 const gl='<p class="crumb"><a href="index.html">Сабақтар</a> · Сөздік</p><h1>Химиялық терминдер сөздігі</h1><a class="open" href="../#glossary">Интерактив сөздікті ашу →</a><dl>'+D.G.map(g=>`<dt><b>${g[0]}</b></dt><dd>${g[1]}</dd>`).join('')+'</dl>';
 fs.writeFileSync(OUT+'learn/glossary.html',page('Химиялық терминдер сөздігі','Аналитикалық және жалпы химия терминдерінің қазақша анықтамалары.','learn/glossary.html',gl,1));
 const day=new Date().toISOString().slice(0,10);
 fs.writeFileSync(OUT+'sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`<url><loc>${BASE+u}</loc><lastmod>${day}</lastmod></url>`).join('\n')+'\n</urlset>\n');
 fs.writeFileSync(OUT+'robots.txt','User-agent: *\nAllow: /\nSitemap: '+BASE+'sitemap.xml\n');
 console.log('static pages',urls.length,'lessons',D.C.reduce((s,c)=>s+c.L.length,0));
})();
