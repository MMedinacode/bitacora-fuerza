/* Bitácora de Fuerza: guarda la app en el celular para que abra sin internet.
   La página se pide primero a la red (así llegan las actualizaciones) y, si no hay señal o tarda más de 4 s,
   sale de la copia guardada. Solo toca sus propias copias (bf-…): el sitio lo comparte con otras apps. */
const CACHE = 'bf-v3';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith('bf-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const propio = url.origin === location.origin;
  if (propio && (url.pathname.includes('/datos/') || url.pathname.endsWith('/version.json'))) return; // siempre desde la red
  if (req.mode === 'navigate') {
    const guardada = () => caches.match('./index.html');
    const red = fetch(req, { cache: 'no-cache' }).then((r) => {
      const html = r.ok && (r.headers.get('content-type') || '').includes('text/html');
      if (html) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copia)).catch(() => {}); }
      else if (r.status >= 500) return guardada().then((g) => g || r);
      return r;
    });
    e.waitUntil(red.catch(() => {}));
    const lento = new Promise((ok) => setTimeout(ok, 4000)).then(guardada);
    e.respondWith(Promise.race([red, lento.then((g) => g || red)]).catch(() => guardada()));
    return;
  }
  // fuentes de Google y la librería de Supabase (versión fija) se guardan; las llamadas a la base de datos nunca
  const fuentes = url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com') || (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('@supabase/supabase-js@'));
  if (!propio && !fuentes) return;
  e.respondWith(caches.match(req).then((guardada) => {
    const red = fetch(req).then((r) => {
      if (r && (r.ok || r.type === 'opaque')) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {}); }
      return r;
    }).catch(() => guardada);
    return guardada || red;
  }));
});
