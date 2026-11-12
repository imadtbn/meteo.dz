/*
 * Weather Today — Service Worker
 * Network-first for same-origin resources, with a generated offline precache.
 * Live weather APIs still require connectivity; previously visited pages and
 * their local modules/styles/data remain available offline.
 */
const CACHE_PREFIX = "weather-today-cache-";
const CACHE_NAME = CACHE_PREFIX + "v19";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./precache-manifest.json",
  "./manifest.json",
  "./favicon.svg",
  "./assets/icon.svg",
  "./assets/css/site.css",
  "./assets/js/site.js"
];

async function fetchAndCache(cache, asset, scope) {
  try {
    const url = new URL(asset, scope);
    if (url.origin !== self.location.origin) return;
    const response = await fetch(new Request(url.href, { cache: "reload" }));
    if (response.ok && response.type === "basic") {
      await cache.put(url.href, response);
    }
  } catch (error) {
    console.warn("Weather Today precache skipped:", asset, error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const scope = self.registration.scope;
    const manifestUrl = new URL("./precache-manifest.json", scope);
    let generatedAssets = [];

    // Read the build-generated inventory first. A missing manifest must not
    // block installation; the small core shell is still cached below.
    try {
      const response = await fetch(new Request(manifestUrl.href, { cache: "reload" }));
      if (response.ok && response.type === "basic") {
        await cache.put(manifestUrl.href, response.clone());
        const manifest = await response.json();
        if (manifest && Array.isArray(manifest.assets)) {
          generatedAssets = manifest.assets.filter(
            (asset) => typeof asset === "string" && asset.startsWith("./")
          );
        }
      }
    } catch (error) {
      console.warn("Weather Today precache manifest unavailable:", error);
    }

    const assets = [...new Set([...STATIC_ASSETS, ...generatedAssets])];
    // Keep installation resilient: one missing optional file cannot block PWA.
    await Promise.allSettled(assets.map((asset) => fetchAndCache(cache, asset, scope)));
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
      // Always revalidate online to avoid serving stale deployments.
      const networkResponse = await fetch(new Request(request, { cache: "no-store" }));

      if (networkResponse && networkResponse.status === 200 &&
          networkResponse.type === "basic" &&
          !/no-store/i.test(networkResponse.headers.get("Cache-Control") || "")) {
        try {
          await cache.put(request, networkResponse.clone());
        } catch (cacheError) {
          console.warn("Weather Today cache write skipped:", cacheError);
        }
      }
      return networkResponse;
    } catch (networkError) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      if (request.mode === "navigate") {
        // Query-string pages (e.g. global-weather/?lat=...) can reuse their
        // cached document even though the requested URL contains parameters.
        const pageUrl = new URL(request.url);
        pageUrl.search = "";
        pageUrl.hash = "";
        const cachedPage = await cache.match(pageUrl.href);
        if (cachedPage) return cachedPage;

        const offlineUrl = new URL("./offline.html", self.registration.scope).href;
        const offlinePage = await cache.match(offlineUrl);
        if (offlinePage) return offlinePage;
      }

      return Response.error();
    }
  })());
});
