const CACHE="evicd-fu-v05-34";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{cache:"reload"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;
  /* pages always come fresh from the network (skip the browser cache), so a Home Screen shortcut gets new versions */
  const net=q.mode==="navigate"?fetch(q.url,{cache:"no-store"}):fetch(q);
  e.respondWith(net.then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(q.mode==="navigate"?"./index.html":q,cp))}return r})
    .catch(()=>caches.match(q).then(r=>r||caches.match("./index.html"))))});
