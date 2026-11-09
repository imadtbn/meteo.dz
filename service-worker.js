const CACHE_PREFIX = "weather-today-cache-";
const CACHE_NAME = CACHE_PREFIX + "v2";
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
  "./assets/js/home-visual-parity.js",
  "./assets/js/directory-parity.js",
  "./assets/js/directory-pages.js",
  "./assets/js/pages.js",
  "./assets/js/place-illustration.js",
  "./assets/js/share-export-parity.js",
  "./data/cities.json",
  "./data/arab-capitals.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept navigation outside this GitHub Pages project scope.
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
