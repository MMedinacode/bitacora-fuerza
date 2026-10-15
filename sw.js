/* Bitácora de Fuerza: guarda la app en el celular para que abra sin internet.
   La página se pide primero a la red (así llegan las actualizaciones) y, si no hay señal, sale de la copia guardada. */
const CACHE = 'bf-v1';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.includes('/datos/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => {
      const copia = r.clone();
      caches.open(CACHE).then((c) => c.put('./index.html', copia));
      return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  const fuentes = url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com');
  if (url.origin !== location.origin && !fuentes) return;
  e.respondWith(caches.match(req).then((guardada) => {
    const red = fetch(req).then((r) => {
      if (r && (r.ok || r.type === 'opaque')) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return r;
    }).catch(() => guardada);
    return guardada || red;
  }));
});
