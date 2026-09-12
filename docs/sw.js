const CACHE_NAME = 'hermes-v1';
const ASSETS = [
  '/hermes-pwa/',
  '/hermes-pwa/index.html',
  '/hermes-pwa/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        console.warn('Some assets failed to cache');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.url.includes('/api/') || request.url.includes('.workers.dev')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then((response) => response || fetch(request))
      .catch(() => new Response('Offline', { status: 503 }))
  );
});
