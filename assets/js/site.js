import { getLang, setLang, applyTranslations } from "./i18n.js";

const root = document.documentElement;

// Font Awesome icons are rendered directly in shared page templates.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const toast = document.querySelector(".toast");
let toastTimer;

export function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

function readTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch {}
  const button = document.querySelector('[data-action="theme"]');
  button?.setAttribute("aria-pressed", String(theme === "dark"));
  button?.setAttribute("title", theme === "dark" ? "الوضع النهاري / Mode clair" : "الوضع الليلي / Mode sombre");
}

root.dataset.theme = readTheme();
setTheme(root.dataset.theme);

// System theme listener
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}

// Menu toggle
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  navigation?.classList.toggle("is-open", open);
});

navigation?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navigation.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "فتح القائمة");
  }
});

// Keep the world-capitals entry available on legacy generated pages as well.
const siteRootUrl = new URL("../../", import.meta.url);
const worldCapitalsUrl = new URL("world-capitals/", siteRootUrl).href;
if (navigation && !navigation.querySelector('a[href*="world-capitals"]')) {
  const link = document.createElement("a");
  link.href = worldCapitalsUrl;
  link.textContent = "عواصم العالم";
  const searchLink = navigation.querySelector('a[href*="world-search"]');
  if (searchLink) navigation.insertBefore(link, searchLink);
  else navigation.append(link);
}
const footerNavigation = document.querySelector(".footer-links");
if (footerNavigation && !footerNavigation.querySelector('a[href*="world-capitals"]')) {
  const link = document.createElement("a");
  link.href = worldCapitalsUrl;
  link.textContent = "عواصم العالم";
  footerNavigation.append(link);
}


// Theme button
document.querySelector('[data-action="theme"]')?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Share button
document.querySelector('[data-action="share"]')?.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "Weather Today | الطقس اليوم - منصة الطقس والمناخ المعتمدة",
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showToast("تمت المشاركة بنجاح.");
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareData.url);
      showToast("تم نسخ رابط الصفحة إلى الحافظة.");
    } else {
      showToast("المشاركة غير متاحة في هذا المتصفح.");
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("تم نسخ رابط الصفحة.");
      } catch {
        showToast("تعذرت المشاركة.");
      }
    }
  }
});

// Language Switcher
const langSelect = document.querySelector("#lang-select");
if (langSelect) {
  const currentLang = getLang();
  langSelect.value = currentLang;
  setLang(currentLang);
  langSelect.addEventListener("change", (e) => {
    setLang(e.target.value);
  });
} else {
  applyTranslations();
}

// PWA Installation logic
let deferredPrompt = null;
const installBtns = document.querySelectorAll('[data-action="install"]');

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtns.forEach((btn) => {
    btn.style.display = "inline-flex";
  });
});

installBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        showToast("شكراً لتثبيت تطبيق الطقس اليوم!");
      }
      deferredPrompt = null;
      btn.style.display = "none";
    } else {
      showToast("تطبيق الطقس اليوم جاهز للتثبيت أو مثبت بالفعل من خلال شريط المتصفح.");
    }
  });
});

window.addEventListener("appinstalled", () => {
  showToast("تم تثبيت تطبيق الطقس اليوم بنجاح على جهازك.");
  installBtns.forEach((btn) => { btn.style.display = "none"; });
});

// Current Year
document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

// Register Service Worker
if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    // Resolve the worker from this shared module so it remains correct on
    // GitHub Pages project paths and on root-domain deployments.
    const workerUrl = new URL("../../service-worker.js", import.meta.url);
    const scopeUrl = new URL("../../", import.meta.url);
    navigator.serviceWorker.register(workerUrl.href, {
      scope: scopeUrl.pathname,
      updateViaCache: "none"
    }).then((registration) => {
      // Check for a newer worker on each visit; do not wait for the browser's
      // periodic update check or a cached copy of service-worker.js.
      registration.update().catch((error) => {
        console.warn("Weather Today service worker update check failed:", error);
      });
    }).catch((error) => {
      console.error("Weather Today service worker registration failed:", error);
    });
  });
}
