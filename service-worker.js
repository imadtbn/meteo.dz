/*
 * Weather Today — Service Worker
 * Network-first for pages and same-origin files to prevent stale deployments.
 * Offline cache is a fallback, never the preferred source while online.
 */
const CACHE_PREFIX = "weather-today-cache-";
const CACHE_NAME = CACHE_PREFIX + "v9";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./map/",
  "./manifest.json",
  "./favicon.svg",
  "./assets/icon.svg",
  "./assets/css/site.css",
  "./assets/css/home-parity.css",
  "./assets/css/directory-parity.css",
  "./assets/css/climate.css",
  "./assets/css/agriculture-weather.css",
  "./assets/css/map.css",
  "./assets/js/map.js",
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
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // A missing optional asset must not prevent the new worker from installing.
    await Promise.allSettled(STATIC_ASSETS.map(async (asset) => {
      const url = new URL(asset, self.registration.scope);
      const response = await fetch(url.href, { cache: "reload" });
      if (response.ok && response.type === "basic") {
        await cache.put(url.href, response);
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Revalidate with the server instead of trusting the browser HTTP cache.
      const networkResponse = await fetch(new Request(request, { cache: "no-store" }));

      if (networkResponse && networkResponse.status === 200 &&
          networkResponse.type === "basic" &&
          !/no-store/i.test(networkResponse.headers.get("Cache-Control") || "")) {
        // Cache failures (e.g. quota limits) must not break a successful response.
        try {
          await cache.put(request, networkResponse.clone());
        } catch (cacheError) {
          console.warn("Weather Today cache write skipped:", cacheError);
        }
      }

      return networkResponse;
    } catch (networkError) {
      // Offline fallback: use the exact cached request first.
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      // For a direct page visit, fall back to the cached app shell.
      if (request.mode === "navigate") {
        const appShellUrl = new URL("./index.html", self.registration.scope).href;
        const appShell = await cache.match(appShellUrl);
        if (appShell) return appShell;
      }

      return Response.error();
    }
  })());
});
