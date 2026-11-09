const CACHE_NAME = "ajwaa-cache-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.svg",
  "./assets/icon.svg",
  "./assets/css/site.css",
  "./assets/css/home-parity.css",
  "./assets/css/directory-parity.css",
  "./assets/css/climate.css",
  "./assets/css/agriculture-weather.css",
  "./assets/css/map.css",
  "./assets/js/site.js",
  "./assets/js/home-parity.js",
  "./assets/js/directory-parity.js",
  "./assets/js/pages.js",
  "./assets/js/place-illustration.js",
  "./data/cities.json",
  "./data/arab-capitals.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Stale-while-revalidate for local assets, network-first for external APIs
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
