const CACHE_NAME = 'loto-pro-v2';
const urlsToCache = [
    '/loto-pro/',
    '/loto-pro/index.html',
    '/loto-pro/loto_201911.csv',
    '/loto-pro/manifest.json',
    '/loto-pro/icon-192.png',
    '/loto-pro/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(err => console.log('Erreur cache:', err))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => new Response('Hors ligne', { status: 503 }))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => key !== CACHE_NAME && caches.delete(key))
        ))
    );
    event.waitUntil(self.clients.claim());
});
