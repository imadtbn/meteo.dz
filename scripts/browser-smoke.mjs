import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const BASE = "http://127.0.0.1:4173/";
const failures = [];
const observations = [];
const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "pipe"]
});
let browser;

function fail(message) {
  failures.push(message);
  console.error("FAIL:", message);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error("Local static server did not become ready.");
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1365, height: 900 },
    serviceWorkers: "allow"
  });

  const routes = [
    { path: "/", label: "homepage" },
    { path: "/wilayas/", label: "wilayas directory" },
    { path: "/weather/algiers/", label: "wilaya weather page" },
    { path: "/world-search/", label: "world search" },
    { path: "/map/", label: "weather map" }
  ];

  for (const viewport of [
    { name: "desktop", width: 1365, height: 900 },
    { name: "mobile", width: 390, height: 844 }
  ]) {
    for (const route of routes) {
      const page = await context.newPage();
      if (route.path === "/" && viewport.name === "mobile") {
        await page.addInitScript(() => localStorage.clear());
      }
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const pageErrors = [];
      const consoleErrors = [];
      const failedResponses = [];
      page.on("response", response => {
        if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
      });
      page.on("pageerror", error => pageErrors.push(error.message));
      page.on("console", message => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });

      const response = await page.goto(BASE + route.path.replace(/^\//, ""), {
        waitUntil: "domcontentloaded",
        timeout: 30000
      }).catch(error => {
        fail(`${viewport.name} ${route.label}: navigation failed: ${error.message}`);
        return null;
      });

      if (!response?.ok()) {
        fail(`${viewport.name} ${route.label}: HTTP ${response?.status() ?? "no response"}`);
      } else {
        await page.waitForTimeout(1800);
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          title: document.title,
          overflowElements: Array.from(document.querySelectorAll("body *")).filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.right > window.innerWidth + 1 || rect.left < -1;
          }).slice(0, 8).map(element => ({
            tag: element.tagName,
            id: element.id,
            className: typeof element.className === "string" ? element.className : "",
            left: Math.round(element.getBoundingClientRect().left),
            right: Math.round(element.getBoundingClientRect().right),
            width: Math.round(element.getBoundingClientRect().width)
          }))
        }));
        if (dimensions.document > dimensions.viewport + 1 || dimensions.body > dimensions.viewport + 1) {
          fail(`${viewport.name} ${route.label}: horizontal overflow (viewport ${dimensions.viewport}px, document ${dimensions.document}px, body ${dimensions.body}px); elements: ${JSON.stringify(dimensions.overflowElements)}`);
        }
        if (!dimensions.title.trim()) fail(`${viewport.name} ${route.label}: document title is empty`);
        observations.push({ viewport: viewport.name, route: route.label, ...dimensions });

        if (route.path === "/" && viewport.name === "mobile") {
          const menu = page.locator(".menu-toggle");
          if (await menu.count()) {
            await menu.click();
            if (await menu.getAttribute("aria-expanded") !== "true") {
              fail("mobile homepage: navigation menu did not open");
            }
          } else {
            fail("mobile homepage: menu toggle is missing");
          }
        }

        if (route.path === "/map/") {
          await page.waitForFunction(() => Boolean(document.querySelector("#atlas-map") && window.L), { timeout: 10000 }).catch(() => {});
          const mapState = await page.evaluate(() => ({
            mapElement: Boolean(document.querySelector("#atlas-map")),
            leafletLoaded: Boolean(window.L),
            leafletCanvas: Boolean(document.querySelector("#atlas-map.leaflet-container")),
            markerCount: document.querySelectorAll("#atlas-map .leaflet-marker-icon").length,
            mapStatus: document.querySelector("#map-status")?.textContent || ""
          }));
          if (!mapState.mapElement) fail(`${viewport.name} weather map: #atlas-map is missing`);
          if (!mapState.leafletLoaded || !mapState.leafletCanvas) fail(`${viewport.name} weather map: Leaflet did not initialize: ${JSON.stringify(mapState)}`);
          if (!mapState.markerCount) fail(`${viewport.name} weather map: no city markers were rendered`);
        }

        if (route.path === "/" && viewport.name === "mobile") {
          const gpsPrompt = page.locator("#location-prompt");
          if (!(await gpsPrompt.count()) || !(await gpsPrompt.isVisible())) {
            fail("first-visit homepage: GPS location prompt is not visible");
          }
        }

        if (route.path === "/" && viewport.name === "desktop") {
          const themeButton = page.locator('[data-action="theme"]').first();
          if (await themeButton.count()) {
            const before = await page.locator("html").getAttribute("data-theme");
            await themeButton.click();
            const after = await page.locator("html").getAttribute("data-theme");
            if (before === after) fail("desktop homepage: theme toggle did not change the theme");
          } else {
            fail("desktop homepage: theme toggle is missing");
          }
        }
      }

      if (pageErrors.length) {
        for (const error of pageErrors) fail(`${viewport.name} ${route.label}: uncaught JavaScript error: ${error}`);
      }
      if (failedResponses.length) {
        for (const item of failedResponses) fail(`${viewport.name} ${route.label}: HTTP ${item.status} resource: ${item.url}`);
      }
      if (consoleErrors.length && !failedResponses.length) {
        for (const error of consoleErrors) fail(`${viewport.name} ${route.label}: console error: ${error}`);
      }
      await page.close();
    }
  }

  // PWA manifest and service-worker lifecycle checks.
  const pwaPage = await context.newPage();
  const pwaErrors = [];
  pwaPage.on("pageerror", error => pwaErrors.push(error.stack || error.message));
  await pwaPage.goto(BASE, { waitUntil: "domcontentloaded" });
  await pwaPage.waitForFunction(() => "serviceWorker" in navigator, { timeout: 10000 });
  await pwaPage.waitForFunction(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.some(registration => registration.active);
  }, { timeout: 15000 }).catch(() => fail("PWA: no active service worker registration found"));

  const manifestResult = await pwaPage.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return { error: "manifest link is missing" };
    const response = await fetch(link.href);
    if (!response.ok) return { error: `manifest request returned HTTP ${response.status}` };
    const manifest = await response.json();
    const iconResults = await Promise.all((manifest.icons || []).map(async icon => {
      const iconResponse = await fetch(new URL(icon.src, link.href));
      return { src: icon.src, ok: iconResponse.ok, type: iconResponse.headers.get("content-type") };
    }));
    return {
      name: manifest.name,
      short_name: manifest.short_name,
      start_url: manifest.start_url,
      scope: manifest.scope,
      display: manifest.display,
      icons: iconResults
    };
  });
  if (manifestResult.error) fail(`PWA: ${manifestResult.error}`);
  if (!manifestResult.name || !manifestResult.short_name) fail("PWA: manifest name or short_name is missing");
  if (manifestResult.display !== "standalone") fail("PWA: manifest display is not standalone");
  if (!manifestResult.icons?.length || manifestResult.icons.some(icon => !icon.ok)) fail("PWA: one or more manifest icons are missing or unreachable");

  await pwaPage.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 10000 })
    .catch(() => fail("PWA: page did not become controlled by the service worker"));
  const cacheState = await pwaPage.evaluate(async () => {
    const names = await caches.keys();
    const details = await Promise.all(names.map(async name => {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      return { name, keys: keys.map(request => request.url), rootMatch: Boolean(await cache.match(new URL("./", location.href).href)) };
    }));
    return { controller: Boolean(navigator.serviceWorker.controller), caches: details };
  });
  if (!cacheState.caches.some(cache => cache.name.startsWith("weather-today-cache-"))) {
    fail("PWA: expected Weather Today cache namespace was not created");
  }

  // The homepage must remain available from the service-worker cache without network.
  await context.setOffline(true);
  const offlineFetch = await pwaPage.evaluate(async () => {
    try {
      const response = await fetch("./index.html");
      return { ok: response.ok, status: response.status };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }).catch(error => ({ ok: false, error: error.message }));
  if (!offlineFetch.ok) fail(`PWA: cached index.html could not be fetched offline: ${JSON.stringify(offlineFetch)}`);

  const offlineResponse = await pwaPage.goto(BASE + "index.html", {
    waitUntil: "domcontentloaded",
    timeout: 15000
  }).catch(() => null);
  if (!offlineResponse?.ok()) fail("PWA: homepage shell could not be opened offline from the service-worker cache");
  const offlineTitle = await pwaPage.title().catch(() => "");
  if (!offlineTitle.includes("Weather Today") && !offlineTitle.includes("الطقس اليوم")) {
    fail("PWA: offline homepage title/content did not load");
  }
  await context.setOffline(false);

  if (pwaErrors.length) {
    for (const error of pwaErrors) fail(`PWA page uncaught JavaScript error: ${error}`);
  }

  console.log(JSON.stringify({
    checkedViewports: ["desktop 1365x900", "mobile 390x844"],
    checkedRoutes: routes.map(route => route.path),
    observations,
    pwa: { manifest: manifestResult, serviceWorker: cacheState, offlineHomepage: Boolean(offlineResponse?.ok()) },
    failures
  }, null, 2));

  await pwaPage.close();
  await context.close();
} catch (error) {
  fail(error.stack || error.message);
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}

if (failures.length) process.exit(1);
console.log("Browser smoke tests passed.");
