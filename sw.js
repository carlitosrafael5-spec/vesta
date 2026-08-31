/* sw.js — VESTA · offline-first */
const CACHE = 'vesta-v1';
const ATIVOS = ['index.html', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ATIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request)
          .then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
            return res;
          })
          .catch(() => caches.match('index.html'))
    )
  );
});