// i18n dictionary and language helper for "Weather Today | الطقس اليوم"
export const translations = {
  ar: {
    brand_title: "Weather Today",
    brand_sub: "الطقس اليوم",
    nav_home: "الرئيسية",
    nav_wilayas: "الولايات",
    nav_capitals: "العواصم العربية",
    nav_world_search: "بحث عالمي",
    nav_map: "خريطة الطقس",
    nav_climate: "المرصد المناخي",
    nav_agri: "الطقس الزراعي",
    nav_alerts: "الإنذارات الجوية",
    nav_favorites: "المفضلة",
    nav_marine: "الطقس البحري",
    nav_forecast: "التوقعات",
    search_placeholder: "ابحث بالولاية، المدينة، أو الرمز...",
    theme_toggle: "تبديل المظهر",
    share: "مشاركة",
    install: "تثبيت التطبيق",
    current_weather: "حالة الطقس الآن",
    hourly_forecast: "توقعات الساعات القادمة",
    daily_forecast: "توقعات الأيام القادمة",
    marine_title: "النشرة البحرية وحالة الأمواج",
    climate_title: "المرصد المناخي الإقليمي",
    explore_wilayas: "استكشف الولايات",
    algeria_wilayas: "ولايات الجزائر الـ 69",
    view_weather: "عرض النشرة",
    all_rights: "جميع الحقوق محفوظة",
    data_source: "المصدر المعتمد: Open-Meteo & NASA POWER",
    humidity: "الرطوبة",
    wind: "الرياح",
    pressure: "الضغط الجوي",
    feels_like: "الحرارة المحسوسة",
    wave_height: "ارتفاع الموج",
    wave_period: "فترة الموج",
    wave_dir: "اتجاه الموج",
    status_clear: "سماء صافية",
    status_cloudy: "غائم جزئياً",
    status_rain: "أمطار",
    status_snow: "ثلوج",
    status_storm: "عواصف رعدية",
    add_favorite: "☆ أضف للمفضلة",
    in_favorite: "★ في المفضلة",
    refresh: "تحديث القراءة"
  },
  fr: {
    brand_title: "Weather Today",
    brand_sub: "الطقس اليوم",
    nav_home: "Accueil",
    nav_wilayas: "Wilayas",
    nav_capitals: "Capitales Arabes",
    nav_world_search: "Recherche Mondiale",
    nav_map: "Carte Météo",
    nav_climate: "Observatoire Climat",
    nav_agri: "Météo Agricole",
    nav_alerts: "Alertes Météo",
    nav_favorites: "Favoris",
    nav_marine: "Météo Marine",
    nav_forecast: "Prévisions",
    search_placeholder: "Rechercher une wilaya, ville ou code...",
    theme_toggle: "Changer le thème",
    share: "Partager",
    install: "Installer l'application",
    current_weather: "Météo actuelle",
    hourly_forecast: "Prévisions horaires",
    daily_forecast: "Prévisions sur 7 jours",
    marine_title: "Bulletin Marin & État de la Mer",
    climate_title: "Observatoire Climatique Régional",
    explore_wilayas: "Explorer les wilayas",
    algeria_wilayas: "Les 69 Wilayas d'Algérie",
    view_weather: "Voir la météo",
    all_rights: "Tous droits réservés",
    data_source: "Source vérifiée: Open-Meteo & NASA POWER",
    humidity: "Humidité",
    wind: "Vent",
    pressure: "Pression",
    feels_like: "Ressentie",
    wave_height: "Hauteur des vagues",
    wave_period: "Période des vagues",
    wave_dir: "Direction des vagues",
    status_clear: "Ciel dégagé",
    status_cloudy: "Partiellement nuageux",
    status_rain: "Pluie",
    status_snow: "Neige",
    status_storm: "Orages",
    add_favorite: "☆ Ajouter aux favoris",
    in_favorite: "★ Dans les favoris",
    refresh: "Actualiser"
  },
  en: {
    brand_title: "Weather Today",
    brand_sub: "الطقس اليوم",
    nav_home: "Home",
    nav_wilayas: "Wilayas",
    nav_capitals: "Arab Capitals",
    nav_world_search: "Global Search",
    nav_map: "Weather Map",
    nav_climate: "Climate Observatory",
    nav_agri: "Agri Weather",
    nav_alerts: "Weather Alerts",
    nav_favorites: "Favorites",
    nav_marine: "Marine Weather",
    nav_forecast: "Forecast",
    search_placeholder: "Search wilaya, city or code...",
    theme_toggle: "Toggle Theme",
    share: "Share",
    install: "Install App",
    current_weather: "Current Weather",
    hourly_forecast: "Hourly Forecast",
    daily_forecast: "7-Day Forecast",
    marine_title: "Marine & Coastal Forecast",
    climate_title: "Regional Climate Observatory",
    explore_wilayas: "Explore Wilayas",
    algeria_wilayas: "Algeria's 69 Wilayas",
    view_weather: "View Weather",
    all_rights: "All rights reserved",
    data_source: "Verified Source: Open-Meteo & NASA POWER",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    feels_like: "Feels Like",
    wave_height: "Wave Height",
    wave_period: "Wave Period",
    wave_dir: "Wave Direction",
    status_clear: "Clear sky",
    status_cloudy: "Partly cloudy",
    status_rain: "Rain",
    status_snow: "Snow",
    status_storm: "Thunderstorms",
    add_favorite: "☆ Add to favorites",
    in_favorite: "★ In favorites",
    refresh: "Refresh"
  }
};

export function getLang() {
  try {
    const saved = localStorage.getItem("ajwaa_lang");
    if (saved && ["ar", "fr", "en"].includes(saved)) return saved;
  } catch {}
  return document.documentElement.lang || "ar";
}

export function setLang(lang) {
  if (!["ar", "fr", "en"].includes(lang)) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  try {
    localStorage.setItem("ajwaa_lang", lang);
  } catch {}
  applyTranslations(lang);
}

export function applyTranslations(lang = getLang()) {
  const dict = translations[lang] || translations.ar;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });
}
