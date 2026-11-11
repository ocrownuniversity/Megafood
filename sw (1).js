/* Mega Farms service worker: app shell cached for fast start and offline open. Data always comes live from Firebase. */
const V="mf-v1",SHELL=["./","./index.html","./manifest.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(/firestore|googleapis|firebaseio|identitytoolkit|securetoken/.test(u.hostname))return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(y=>y.put("./index.html",c));return x}).catch(()=>caches.match("./index.html")));return}
 if(u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
  e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x&&x.status===200){const c=x.clone();caches.open(V).then(y=>y.put(r,c))}return x}).catch(()=>h);return h||n}))}
});
