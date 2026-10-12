const CACHE_NAME = 'asedio-tecalitlan-root-v21';
const APP_SHELL = [
  './',
  './index.html',
  './portada.jpg',
  './manifest.webmanifest',
  './service-worker.js',
  './asedio-icon-192.png',
  './asedio-icon-512.png',
  './asedio-apple-touch-icon.png',
  './jefe-purisima-atlas.png',
  './jefe-ahogado-acueducto.jpg',
  './xolotl-super-view-1.jpg',
  './xolotl-super-view-2.jpg',
  './xolotl-super-view-3.jpg',
  './xolotl-super-view-4.jpg',
  './xolotl-super-view-5.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('asedio-tecalitlan-') && key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request, copy)); }
    return response;
  })));
});
