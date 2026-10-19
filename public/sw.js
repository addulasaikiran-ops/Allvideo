const CACHE_PREFIX = 'allvideo-shell-';
const CACHE_VERSION = 'v1';
const SHELL_CACHE = CACHE_PREFIX + CACHE_VERSION;
const AUDIO_CACHE = 'allvideo-audio-v1';
const SHELL_URLS = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-maskable.svg', '/og-image.svg'];
const AUDIO_PATH = /\.(mp3|ogg|wav|m4a|aac|opus)(\?.*)?$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (event) => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (AUDIO_PATH.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try { const response = await fetch(request); if (response.ok && response.type === 'basic') await cache.put(request, response.clone()); return response; }
      catch { return cached || Response.error(); }
    })());
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => { if (response.ok) caches.open(SHELL_CACHE).then((cache) => cache.put('/index.html', response.clone())); return response; }).catch(async () => (await caches.match('/index.html')) || (await caches.match('/'))));
    return;
  }
  if (url.pathname.startsWith('/assets/')) event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok) caches.open(SHELL_CACHE).then((cache) => cache.put(request, response.clone())); return response; })));
});