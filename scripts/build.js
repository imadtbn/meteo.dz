const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const citiesPath = path.join(rootDir, 'data', 'cities.json');
const capitalsPath = path.join(rootDir, 'data', 'arab-capitals.json');
const worldCapitalsPath = path.join(rootDir, 'data', 'world-capitals.json');

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const capitals = JSON.parse(fs.readFileSync(capitalsPath, 'utf8'));
const worldCapitalRows = JSON.parse(fs.readFileSync(worldCapitalsPath, 'utf8'));
const arabCapitalGeography = {
  algiers: ['africa', 'DZ'], manama: ['asia', 'BH'], moroni: ['africa', 'KM'],
  djibouti: ['africa', 'DJ'], cairo: ['africa', 'EG'], baghdad: ['asia', 'IQ'],
  amman: ['asia', 'JO'], 'kuwait-city': ['asia', 'KW'], beirut: ['asia', 'LB'],
  tripoli: ['africa', 'LY'], nouakchott: ['africa', 'MR'], rabat: ['africa', 'MA'],
  muscat: ['asia', 'OM'], ramallah: ['asia', 'PS'], doha: ['asia', 'QA'],
  riyadh: ['asia', 'SA'], mogadishu: ['africa', 'SO'], khartoum: ['africa', 'SD'],
  damascus: ['asia', 'SY'], tunis: ['africa', 'TN'], 'abu-dhabi': ['asia', 'AE'],
  sanaa: ['asia', 'YE']
};
const continentNames = { africa: 'إفريقيا', europe: 'أوروبا', america: 'الأمريكتان', asia: 'آسيا' };
const worldCapitals = [
  ...worldCapitalRows,
  ...capitals.map(city => {
    const [continent, countryCode] = arabCapitalGeography[city.slug] || ['asia', ''];
    return { ...city, continent, continentName: continentNames[continent], countryCode };
  })
];

console.log(`Loaded ${cities.length} Algerian wilayas, ${capitals.length} Arab capitals, and ${worldCapitals.length} world capitals.`);

function getHeader(depth = 0, activeKey = '') {
  const rel = depth === 0 ? './' : '../'.repeat(depth);
  return `
  <header class="site-header">
    <a class="brand" href="${rel}" aria-label="Weather Today | الطقس اليوم">
      <img src="${rel}favicon.svg" width="42" height="42" alt="Weather Today">
      <span><strong data-i18n="brand_title">Weather Today</strong><small data-i18n="brand_sub">الطقس اليوم</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="فتح القائمة">
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>
    <nav class="primary-navigation" id="primary-navigation" aria-label="التنقل الرئيسي">
      <a href="${rel}" ${activeKey === 'home' ? 'aria-current="page"' : ''} <i class="fa-solid fa-house" aria-hidden="true"></i><span data-i18n="nav_home">الرئيسية</span></a>
      <a href="${rel}wilayas/" ${activeKey === 'wilayas' ? 'aria-current="page"' : ''} <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i><span data-i18n="nav_wilayas">الولايات</span></a>
      <a href="${rel}arab-capitals/" ${activeKey === 'capitals' ? 'aria-current="page"' : ''} <i class="fa-solid fa-earth-africa" aria-hidden="true"></i><span data-i18n="nav_capitals">العواصم العربية</span></a>
      <a href="${rel}world-capitals/" ${activeKey === 'world-capitals' ? 'aria-current="page"' : ''}><i class="fa-solid fa-globe" aria-hidden="true"></i><span>عواصم العالم</span></a>
      <a href="${rel}world-search/" ${activeKey === 'search' ? 'aria-current="page"' : ''} <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span data-i18n="nav_world_search">بحث عالمي</span></a>
      <a href="${rel}map/" ${activeKey === 'map' ? 'aria-current="page"' : ''} <i class="fa-solid fa-map" aria-hidden="true"></i><span data-i18n="nav_map">خريطة الطقس</span></a>
      <a href="${rel}climate-observatory/" ${activeKey === 'climate' ? 'aria-current="page"' : ''} <i class="fa-solid fa-chart-line" aria-hidden="true"></i><span data-i18n="nav_climate">المرصد المناخي</span></a>
      <a href="${rel}agriculture-weather/" ${activeKey === 'agri' ? 'aria-current="page"' : ''} <i class="fa-solid fa-seedling" aria-hidden="true"></i><span data-i18n="nav_agri">الطقس الزراعي</span></a>
      <a href="${rel}marine/" ${activeKey === 'marine' ? 'aria-current="page"' : ''} <i class="fa-solid fa-water" aria-hidden="true"></i><span data-i18n="nav_marine">الطقس البحري</span></a>
      <a href="${rel}alerts/" ${activeKey === 'alerts' ? 'aria-current="page"' : ''} <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span data-i18n="nav_alerts">الإنذارات</span></a>
      <a href="${rel}favorites/" ${activeKey === 'favorites' ? 'aria-current="page"' : ''} <i class="fa-solid fa-star" aria-hidden="true"></i><span data-i18n="nav_favorites">المفضلة</span></a>
    </nav>
    <div class="header-actions">
      <!-- Language Switcher -->
      <select id="lang-select" class="lang-picker" aria-label="اختيار اللغة / Language">
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
      <button class="icon-button" type="button" data-action="theme" aria-label="تبديل الوضع الليلي" title="تبديل المظهر">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" fill="currentColor"/></svg>
      </button>
      <button class="action-button" type="button" data-action="share"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i><span data-i18n="share">مشاركة</span></button>
      <button class="action-button install-btn" type="button" data-action="install" style="display:none;"><i class="fa-solid fa-download" aria-hidden="true"></i><span data-i18n="install">تثبيت</span></button>
    </div>
  </header>`;
}

function getFooter(depth = 0) {
  const rel = depth === 0 ? './' : '../'.repeat(depth);
  return `
  <footer class="site-footer">
    <div class="footer-wrap">
      <div class="footer-about">
        <a class="footer-brand" href="${rel}" aria-label="Weather Today | الطقس اليوم">
          <img src="${rel}favicon.svg" width="38" height="38" alt="">
          <span><strong>Weather Today</strong><small>الطقس اليوم</small></span>
        </a>
        <p>منصتك لمتابعة الطقس والتوقعات الجوية في الجزائر والوطن العربي والعالم.</p>
      </div>
      <nav class="footer-links" aria-label="روابط الموقع">
        <a href="${rel}"><i class="fa-solid fa-house" aria-hidden="true"></i> الرئيسية</a>
        <a href="${rel}wilayas/"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i> الولايات</a>
        <a href="${rel}world-capitals/"><i class="fa-solid fa-globe" aria-hidden="true"></i><span>عواصم العالم</span></a>
        <a href="${rel}world-search/"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> البحث العالمي</a>
        <a href="${rel}map/"><i class="fa-solid fa-map" aria-hidden="true"></i> خريطة الطقس</a>
        <a href="${rel}alerts/"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> الإنذارات</a>
        <a href="${rel}favorites/"><i class="fa-solid fa-star" aria-hidden="true"></i> المفضلة</a>
      </nav>
      <div class="footer-bottom">
        <span>بيانات الطقس: Open-Meteo · خرائط الأساس: OpenStreetMap</span>
        <span>© <span data-current-year></span> Weather Today | الطقس اليوم · جميع الحقوق محفوظة</span>
      </div>
    </div>
  </footer>
  <div class="toast" role="status" aria-live="polite" hidden></div>`;
}

// 1. Generate 69 Wilayas Static Pages
console.log('Generating 69 Wilaya standalone HTML pages...');

cities.forEach((city) => {
  const wilayaDir = path.join(rootDir, 'weather', city.slug);
  fs.mkdirSync(wilayaDir, { recursive: true });

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="حالة الطقس المباشرة والتوقعات الساعية والأسبوعية لولاية ${city.name} (${city.name_fr} - ${city.name_en})، درجات الحرارة والرطوبة والرياح وحالة البحر.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_DZ">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="طقس ولاية ${city.name} (${city.code}) | Weather Today">
  <meta property="og:description" content="حالة الطقس الآن والتوقعات الساعية والأسبوعية لولاية ${city.name}، مع درجات الحرارة والأمطار والرياح.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/weather/${city.slug}/">
  <meta property="og:image" content="https://imadtbn.github.io/weather-today/favicon.svg">
  <meta property="og:image:alt" content="Weather Today | الطقس اليوم">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="طقس ولاية ${city.name} | Weather Today">
  <meta name="twitter:description" content="حالة الطقس والتوقعات الجوية لولاية ${city.name}.">
  <meta name="keywords" content="طقس ${city.name}, طقس ${city.name_fr}, ولاية ${city.code}, طقس الجزائر, أحوال الجو ${city.slug}">
  <meta name="theme-color" content="#0c5b8c">
  <title>طقس ولاية ${city.name} (${city.code}) | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../../manifest.json">
  <link rel="stylesheet" href="../../assets/css/site.css">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/weather/${city.slug}/">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "${city.name}",
    "alternateName": ["${city.name_fr}", "${city.name_en}"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${city.latitude},
      "longitude": ${city.longitude}
    }
  }
  </script>
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(2, 'wilayas')}
  <main id="main" class="city-page" data-lat="${city.latitude}" data-lon="${city.longitude}" data-city="${city.name}" data-slug="${city.slug}" data-coastal="${city.coastal ? 'true' : 'false'}">
    <section class="hero city-hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="status-dot"></span> ولاية ${city.code} · ${city.region}</span>
        <h1>طقس <em>${city.name}</em></h1>
        <p>الاسم الفرنسي: ${city.name_fr || ''} · الاسم الإنجليزي: ${city.name_en || ''}</p>
        <div class="hero-actions">
          <a class="button button-secondary" href="../../wilayas/"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i><span>دليل الولايات</span></a>
          <button class="button button-primary" id="favorite-toggle" type="button" aria-pressed="false"><i class="fa-solid fa-star" aria-hidden="true"></i><span data-i18n="add_favorite">أضف للمفضلة</span></button>
        </div>
      </div>
      <aside class="hero-note">
        <span class="note-kicker">الموقع الجغرافي والرموز</span>
        <strong>ولاية ${city.code}</strong>
        <p>خط العرض: ${city.latitude}° · خط الطول: ${city.longitude}°</p>
        <div class="note-divider"></div>
        <span class="note-foot">المنطقة: ${city.region} · مفتاح الهاتف: ${city.phone_code || '—'}</span>
      </aside>
    </section>

    <section class="content-section weather-section">
      <div class="section-heading">
        <div><span class="eyebrow">01 — النشرة اللحظية</span><h2 data-i18n="current_weather">حالة الطقس الآن</h2></div>
        <p id="weather-updated">المصدر: Open-Meteo · توقيت محلي</p>
      </div>
      <div id="weather-status" class="weather-status" role="status" aria-live="polite">جارٍ جلب بيانات الطقس المحدثة…</div>
      <div id="weather-current" class="weather-current" hidden></div>
      <div class="weather-actions">
        <button id="weather-refresh" class="button button-secondary" type="button"><i class="fa-solid fa-rotate" aria-hidden="true"></i><span data-i18n="refresh">تحديث القراءة</span></button>
        <span id="weather-source" class="weather-source">المصدر: Open-Meteo Global API</span>
      </div>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">02 — التوقعات الساعية</span><h2 data-i18n="hourly_forecast">الطقس خلال الساعات القادمة</h2></div>
        <p>توقعات ساعية دقيقة على مدار 24 ساعة.</p>
      </div>
      <div id="weather-hourly" class="weather-hourly" aria-live="polite"></div>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">03 — التوقعات الأسبوعية</span><h2 data-i18n="daily_forecast">توقعات 7 أيام قادمة</h2></div>
        <p>درجات الحرارة القصوى والدنيا واحتمالات التساقط وحركة الرياح.</p>
      </div>
      <div id="weather-daily" class="weather-daily"></div>
    </section>

    ${city.coastal ? `
    <section class="content-section" id="marine-section">
      <div class="section-heading">
        <div><span class="eyebrow">04 — النشرة البحرية</span><h2 data-i18n="marine_title">حالة البحر والساحل</h2></div>
        <p>ارتفاع الموج، الفترة، واتجاه الأمواج الساحلية من Open-Meteo Marine.</p>
      </div>
      <div id="weather-marine" class="weather-marine"></div>
    </section>` : ''}

    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">05 — التوصيات الذكية</span><h2>إرشادات الطقس والمناخ</h2></div>
        <p>نصائح حيوية مبنية على قراءات الطقس الآن.</p>
      </div>
      <div id="weather-insights" class="weather-insights"></div>
    </section>
  </main>
  ${getFooter(2)}
  <script type="module" src="../../assets/js/site.js"></script>
  <script type="module" src="../../assets/js/pages.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(wilayaDir, 'index.html'), html, 'utf8');
});

console.log(`Generated 69 static wilaya pages successfully.`);

// 2. Generate directory pages
const directoryConfig = [
  {
    folder: 'wilayas',
    kind: 'wilayas',
    title: 'دليل ولايات الجزائر الـ 69 | Weather Today | الطقس اليوم',
    heading: 'ولايات الجزائر الـ 69',
    intro: 'استكشف حالة الطقس والتوقعات في كافة ولايات الجزائر الـ 69 بالبحث بالاسم العربي أو الفرنسي أو الإنجليزي أو رمز الولاية ومفتاح الهاتف.',
    subheading: 'فهرس ولايات الجزائر'
  },
  {
    folder: 'arab-capitals',
    kind: 'arab-capitals',
    title: 'طقس العواصم العربية | Weather Today | الطقس اليوم',
    heading: 'طقس العواصم العربية الـ 22',
    intro: 'رصد جوي دقيق لجميع عواصم الدول العربية مع درجات الحرارة اللحظية وتوقعات الأيام القادمة.',
    subheading: 'قائمة العواصم العربية'
  },
  {
    folder: 'world-capitals',
    kind: 'world-capitals',
    title: 'عواصم العالم حسب القارات | Weather Today | الطقس اليوم',
    heading: 'طقس عواصم العالم',
    intro: 'اكتشف حالة الطقس في عواصم إفريقيا وأوروبا والأمريكتين وآسيا، مع بحث متعدد اللغات وبيانات جوية مرتبطة بالإحداثيات الجغرافية لكل عاصمة.',
    subheading: 'استكشف عواصم القارات الأربع'
  },
  {
    folder: 'world-search',
    kind: 'world-search',
    title: 'البحث العالمي عن الطقس | Weather Today | الطقس اليوم',
    heading: 'البحث العالمي عن مدن العالم',
    intro: 'ابحث عن أي مدينة أو ولاية في الجزائر والوطن العربي وجميع أنحاء العالم للحصول على تقرير طقس دقيق.',
    subheading: 'محرك البحث الجغرافي العالمي'
  },
  {
    folder: 'favorites',
    kind: 'favorites',
    title: 'المدن والولايات المفضلة | Weather Today | الطقس اليوم',
    heading: 'قائمتي المفضلة',
    intro: 'الوصول السريع إلى ولاياتك ومدنك المحفوظة لمتابعة مستمرة لطقسها اليومي.',
    subheading: 'ولاياتك المحفوظة'
  },
  {
    folder: 'alerts',
    kind: 'alerts',
    title: 'الإنذارات والتنبيهات الجوية | Weather Today | الطقس اليوم',
    heading: 'مركز الإنذارات والتنبيهات الجوية',
    intro: 'روابط وتحديثات النشرات الجوية الخاصة (BMS) ومستويات اليقظة الرسمية من الديوان الوطني للأرصاد الجوية ومراكز الرصد.',
    subheading: 'النشرات والإنذارات الرسمية'
  }
];

directoryConfig.forEach((cfg) => {
  const dirPath = path.join(rootDir, cfg.folder);
  fs.mkdirSync(dirPath, { recursive: true });

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${cfg.intro}">
  <meta name="theme-color" content="#0c5b8c">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/${cfg.folder}/">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="${cfg.title}">
  <meta property="og:description" content="${cfg.intro}">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/${cfg.folder}/">
  <title>${cfg.title}</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/directory-parity.css">
</head>
<body data-page="${cfg.kind}">
  <a class="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
  ${getHeader(1, cfg.kind)}
  <main id="main-content">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="status-dot"></span> الطقس اليوم · دليل شامل</span>
        <h1>${cfg.heading}</h1>
        <p>${cfg.intro}</p>
      </div>
      <aside class="hero-note">
        <span class="note-kicker">نظام البحث المتقدم</span>
        <strong>متعدد اللغات</strong>
        <p>دعم البحث بالعربية، الفرنسية، الإنجليزية، والأرقام ورموز الهاتف.</p>
      </aside>
    </section>
    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">01 — المحتوى</span><h2>${cfg.subheading}</h2></div>
        <p id="page-count" aria-live="polite"></p>
      </div>
      <div id="page-content" class="feature-grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))"></div>
      <div id="page-status" class="migration-notice" role="status" aria-live="polite" hidden></div>
    </section>
    <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
    <script type="application/json" id="capital-data">${JSON.stringify(capitals)}</script>
    ${cfg.kind === 'world-capitals' ? `<script type="application/json" id="world-capitals-data">${JSON.stringify(worldCapitals)}</script>` : ''}
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script type="module" src="../assets/js/directory-pages.js"></script>
  <script type="module" src="../assets/js/directory-parity.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
});

// 3. Generate Climate Observatory Page
{
  const dirPath = path.join(rootDir, 'climate-observatory');
  fs.mkdirSync(dirPath, { recursive: true });
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="المرصد المناخي الجزائري: السلاسل المناخية اليومية حسب الولاية اعتماداً على بيانات NASA POWER.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/climate-observatory/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_DZ">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="المرصد المناخي الجزائري | Weather Today">
  <meta property="og:description" content="استكشف السلاسل المناخية اليومية حسب الولاية، وقارن درجات الحرارة والأمطار اعتماداً على بيانات NASA POWER.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/climate-observatory/">
  <meta property="og:image" content="https://imadtbn.github.io/weather-today/favicon.svg">
  <meta property="og:image:alt" content="Weather Today | الطقس اليوم">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="المرصد المناخي الجزائري | Weather Today">
  <meta name="twitter:description" content="السلاسل المناخية اليومية ومؤشرات الحرارة والأمطار حسب الولاية.">
  <title>المرصد المناخي الجزائري | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/climate.css">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'climate')}
  <main id="main">
    <section class="climate-hero">
      <span class="eyebrow"><span class="status-dot"></span> الطقس اليوم · سجل المناخ</span>
      <h1 data-i18n="climate_title">المرصد المناخي الإقليمي</h1>
      <p>استكشف السلاسل المناخية اليومية حسب الولاية، وقارن درجات الحرارة والأمطار اعتماداً على بيانات NASA POWER الموثقة.</p>
    </section>
    <section class="content-section climate-content">
      <div class="climate-toolbar">
        <label>الولاية<select id="climate-city" aria-label="اختر الولاية"></select></label>
        <label>الفترة<select id="climate-period"><option value="90">آخر 90 يوماً</option><option value="365">آخر 365 يوماً</option></select></label>
        <button class="button button-secondary" id="climate-refresh" type="button" data-i18n="refresh">تحديث البيانات</button>
      </div>
      <p id="climate-status" class="climate-status" role="status" aria-live="polite">جارٍ تحميل السجل المناخي…</p>
      <div id="climate-results" hidden>
        <div class="section-heading">
          <div><span class="eyebrow">01 — ملخص الفترة</span><h2 id="climate-heading">المؤشرات المناخية</h2></div>
          <p id="climate-count"></p>
        </div>
        <div class="climate-stat-grid">
          <article><small>متوسط الحرارة</small><strong id="climate-average">—</strong></article>
          <article><small>مجموع الأمطار</small><strong id="climate-rain">—</strong></article>
          <article><small>أيام الصقيع (≤ 0°)</small><strong id="climate-frost">—</strong></article>
          <article><small>أيام الحرارة (≥ 35°)</small><strong id="climate-hot">—</strong></article>
        </div>
        <div class="section-heading chart-heading"><div><span class="eyebrow">02 — تطور الحرارة</span><h2>الحرارة العظمى والصغرى</h2></div></div>
        <div class="climate-chart" id="temperature-chart" role="img" aria-label="منحنى درجات الحرارة العظمى والصغرى"></div>
        <div class="section-heading chart-heading"><div><span class="eyebrow">03 — التساقطات</span><h2>الأمطار اليومية</h2></div></div>
        <div class="climate-chart climate-chart--rain" id="rain-chart" role="img" aria-label="منحنى الأمطار اليومية"></div>
      </div>
      <p class="climate-attribution">المصدر: NASA POWER بيانات يومية مشتقة من نماذج وأقمار صناعية متقدمة.</p>
    </section>
    <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script type="module" src="../assets/js/climate.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
}

// 4. Generate Agriculture Weather Page
{
  const dirPath = path.join(rootDir, 'agriculture-weather');
  fs.mkdirSync(dirPath, { recursive: true });
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="مؤشرات الطقس الزراعي حسب الولاية: الأمطار المتراكمة، الوحدات الحرارية GDD، أيام الصقيع والحرارة.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/agriculture-weather/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_DZ">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="الطقس الزراعي والمؤشرات الزراعية | Weather Today">
  <meta property="og:description" content="تابع الأمطار المتراكمة والوحدات الحرارية GDD وأيام الصقيع والحرارة حسب الولاية لدعم القرارات الزراعية.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/agriculture-weather/">
  <meta property="og:image" content="https://imadtbn.github.io/weather-today/favicon.svg">
  <meta property="og:image:alt" content="Weather Today | الطقس اليوم">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="الطقس الزراعي | Weather Today">
  <meta name="twitter:description" content="مؤشرات الأمطار والحرارة والصقيع والوحدات الحرارية حسب الولاية.">
  <title>الطقس الزراعي | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/climate.css">
  <link rel="stylesheet" href="../assets/css/agriculture-weather.css">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'agri')}
  <main id="main">
    <section class="climate-hero">
      <span class="eyebrow"><span class="status-dot"></span> الطقس اليوم · المناخ والزراعة</span>
      <h1>مؤشرات الطقس الزراعي</h1>
      <p>تابع الحرارة المتراكمة والأمطار وأيام الصقيع والحرارة حسب الولاية لمساعدة المزارعين والمهندسين الزراعيين.</p>
    </section>
    <section class="content-section climate-content agriculture-content">
      <div class="climate-toolbar">
        <label>موقع المتابعة<select id="agri-city" aria-label="اختر الولاية"></select></label>
        <label>الفترة<select id="agri-period"><option value="30">آخر 30 يوماً</option><option value="90">آخر 90 يوماً</option></select></label>
        <label>درجة الأساس لـ GDD<select id="agri-base"><option value="5">5°م</option><option value="10" selected>10°م</option><option value="15">15°م</option></select></label>
        <button class="button button-secondary" id="agri-refresh" type="button" data-i18n="refresh">تحديث البيانات</button>
      </div>
      <p id="agri-status" class="climate-status" role="status" aria-live="polite">جارٍ حساب المؤشرات الزراعية…</p>
      <div id="agri-results" hidden>
        <div class="section-heading"><div><span class="eyebrow">01 — لوحة المتابعة</span><h2 id="agri-heading">المؤشرات الجوية</h2></div><p id="agri-period-label"></p></div>
        <div class="climate-stat-grid agriculture-stat-grid">
          <article><small>الوحدات الحرارية المتراكمة GDD</small><strong id="agri-gdd">—</strong></article>
          <article><small>الأمطار المتراكمة</small><strong id="agri-rain">—</strong></article>
          <article><small>أيام الصقيع (الصغرى ≤ 0°)</small><strong id="agri-frost">—</strong></article>
          <article><small>أيام الحرارة (العظمى ≥ 35°)</small><strong id="agri-heat">—</strong></article>
          <article><small>أيام أمطار ≥ 5 مم</small><strong id="agri-rainy">—</strong></article>
        </div>
      </div>
      <p class="climate-attribution">المصدر: NASA POWER بيانات مناخية شبكية موثوقة.</p>
    </section>
    <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script type="module" src="../assets/js/agriculture-weather.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
}

// 5. Generate Map / Navigation Center Page
{
  const dirPath = path.join(rootDir, 'map');
  fs.mkdirSync(dirPath, { recursive: true });
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="خريطة الطقس التفاعلية ومركز الملاحة للولايات الجزائرية والعواصم العربية مع طبقات الرياح والحرارة والأمطار.">
  <title>خريطة الطقس ومركز الملاحة | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/map.css">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'map')}
  <main id="main">
    <section class="map-hero">
      <span class="eyebrow"><span class="status-dot"></span> الطقس اليوم · مركز الملاحة والخرائط</span>
      <h1 data-i18n="nav_map">خريطة الطقس ومركز الملاحة</h1>
      <p>استعرض خريطة الولايات الـ 69 والعواصم العربية مع إمكانية التنقل السريع وعرض النشرة الجوية لأي موقع.</p>
    </section>
    <div class="map-frame-wrap">
      <div id="map" class="map-canvas" role="region" aria-label="خريطة الطقس"></div>
      <div class="map-controls">
        <button id="map-locate" class="button button-primary" type="button">موقعي الحالي</button>
        <button id="map-reset" class="button button-secondary" type="button">الجزائر كاملة</button>
      </div>
    </div>
    <div class="map-footer">
      <span id="map-count">69 ولاية جزائرية · 22 عاصمة عربية</span>
      <span>خرائط الأساس: OpenStreetMap · الطقس: Open-Meteo</span>
    </div>
    <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
    <script type="application/json" id="capital-data">${JSON.stringify(capitals)}</script>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script type="module" src="../assets/js/map.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
}

// 6. Generate Marine Weather Page
{
  const dirPath = path.join(rootDir, 'marine');
  fs.mkdirSync(dirPath, { recursive: true });
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="النشرة البحرية وحالة السواحل الجزائرية والبحر الأبيض المتوسط: ارتفاع الأمواج، الرياح البحرية، ودرجات حرارة المياه.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/marine/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_DZ">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="الطقس البحري وحالة السواحل الجزائرية | Weather Today">
  <meta property="og:description" content="تابع حالة البحر الأبيض المتوسط والسواحل الجزائرية، وارتفاع الأمواج واتجاهها والرياح البحرية.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/marine/">
  <meta property="og:image" content="https://imadtbn.github.io/weather-today/favicon.svg">
  <meta property="og:image:alt" content="Weather Today | الطقس اليوم">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="الطقس البحري وحالة السواحل | Weather Today">
  <meta name="twitter:description" content="النشرة البحرية وبيانات الأمواج والرياح على السواحل الجزائرية.">
  <title>الطقس البحري والسواحل | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/home-parity.css">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'marine')}
  <main id="main">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="status-dot"></span> السواحل والملاحة البحرية</span>
        <h1 data-i18n="marine_title">النشرة البحرية وحالة الأمواج</h1>
        <p>متابعة خاصة للمدن الساحلية الجزائرية الـ 11 والشريط الساحلي على البحر الأبيض المتوسط: ارتفاع الأمواج، اتجاهها، وفتراتها.</p>
      </div>
    </section>
    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">المدن الساحلية</span><h2>اختر مدينة ساحلية</h2></div>
        <p>11 ولاية ساحلية جزائرية مجهزة بقراءات بحرية متخصصة</p>
      </div>
      <div class="directory-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
        ${cities.filter(c => c.coastal).map(c => `
          <a class="directory-card directory-card--visual" href="../weather/${c.slug}/">
            <span class="directory-card__body">
              <span class="directory-card__meta">ولاية ${c.code} · ${c.region}</span>
              <strong class="directory-card__title">ساحل ${c.name}</strong>
              <span class="directory-card__action">عرض النشرة البحرية ←</span>
            </span>
          </a>
        `).join('')}
      </div>
    </section>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
}

// 7. Generate Global Weather View Page
{
  const dirPath = path.join(rootDir, 'global-weather');
  fs.mkdirSync(dirPath, { recursive: true });
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="قراءة الطقس العالمي والتوقعات لأي موقع حول العالم عبر Open-Meteo API.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/global-weather/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_DZ">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="الطقس العالمي | Weather Today | الطقس اليوم">
  <meta property="og:description" content="احصل على حالة الطقس الحالية والتوقعات الجوية لأي موقع حول العالم اعتماداً على الإحداثيات الجغرافية وبيانات Open-Meteo.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/global-weather/">
  <meta property="og:image" content="https://imadtbn.github.io/weather-today/favicon.svg">
  <meta property="og:image:alt" content="Weather Today | الطقس اليوم">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="الطقس العالمي | Weather Today">
  <meta name="twitter:description" content="توقعات الطقس العالمية حسب الموقع الجغرافي.">
  <title>الطقس العالمي | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/home-parity.css">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'search')}
  <main id="main">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="status-dot"></span> قراءة جوية عالمية</span>
        <h1 id="global-title">الطقس في الموقع المختار</h1>
        <p id="global-coordinates">قراءة دقيقة حسب الإحداثيات الجغرافية عبر Open-Meteo.</p>
      </div>
    </section>
    <section class="content-section">
      <div class="weather-actions"><button id="global-favorite-toggle" class="button button-primary" type="button" aria-pressed="false" disabled>☆ أضف إلى المفضلة</button></div>
      <div id="global-status" class="weather-status" role="status" aria-live="polite">جارٍ جلب القراءة العالمية…</div>
      <div id="global-current" class="weather-current" hidden></div>
      <div id="global-days" class="daily-list" style="margin-top:2rem;"></div>
      <div style="margin-top:2rem;">
        <a class="button button-secondary" href="../world-search/">العودة للبحث العالمي</a>
      </div>
    </section>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script type="module" src="../assets/js/global-weather.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
}

// 8. Generate Homepage index.html
{
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Weather Today | الطقس اليوم: حالة الطقس الآن والتوقعات اليومية والساعية والأسبوعية للمدن حول العالم، مع تغطية 69 ولاية جزائرية و22 عاصمة عربية و181 عاصمة عالمية.">
  <meta name="theme-color" content="#0c5b8c">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Weather Today | الطقس اليوم">
  <meta property="og:title" content="Weather Today | الطقس اليوم - توقعات الطقس العالمية">
  <meta property="og:description" content="حالة الطقس الآن والتوقعات اليومية والساعية والأسبوعية للمدن حول العالم.">
  <meta property="og:url" content="https://imadtbn.github.io/weather-today/">
  <title>Weather Today | الطقس اليوم - توقعات الطقس العالمية</title>
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="./manifest.json">
  <link rel="stylesheet" href="./assets/css/site.css">
  <link rel="stylesheet" href="./assets/css/home-parity.css">
  <link rel="stylesheet" href="./assets/css/directory-parity.css">
</head>
<body data-page="home">
  <a class="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
  ${getHeader(0, 'home')}
  <main id="main-content">
    <section class="hero hero--home">
      <div class="hero-copy">
        <span class="eyebrow"><span class="status-dot"></span> Weather Today | الطقس اليوم</span>
        <h1>الطقس حولك،<br><em>أينما كنت.</em></h1>
        <p>تابع حالة الطقس الحالية والتوقعات الساعية والأسبوعية لمدينتك حول العالم، مع تحديد موقعك عبر GPS وتغطية 69 ولاية جزائرية و22 عاصمة عربية و145 عاصمة عالمية.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="./wilayas/" data-i18n="explore_wilayas">استكشف الولايات الـ 69 <span aria-hidden="true">←</span></a>
          <a class="button button-secondary" href="./world-search/" <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span data-i18n="nav_world_search">بحث عالمي</span></a>
          <button class="button button-secondary" type="button" data-action="install" data-i18n="install">تثبيت التطبيق</button>
        </div>
      </div>
      <aside class="hero-note" id="city-picker">
        <span class="note-kicker">البحث والوصول السريع</span>
        <label for="hero-global-city-search" style="display:block;margin-bottom:0.5rem;font-weight:bold;">ابحث عن أي مدينة أو ولاية:</label>
        <input id="hero-global-city-search" type="search" placeholder="مثال: وهران، الجزائر، القاهرة، Paris..." autocomplete="off" class="directory-search-input">
        <div id="city-search-results" class="city-search-panel" hidden></div>
        <div class="note-divider"></div>
        <button id="location-quick" class="button button-secondary" type="button" style="width:100%;"><i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i><span>استخدم موقعي الحالي</span></button>
        <div id="location-prompt" class="location-prompt" hidden><span class="location-prompt__icon" aria-hidden="true">⌖</span><div><strong>طقس منطقتك بدقة</strong><p>اسمح باستخدام موقعك لعرض حالة الطقس وفق إحداثياتك الحالية.</p></div></div>
        <p id="location-feedback" class="location-feedback" role="status" aria-live="polite"></p>
        <p id="location-error" class="location-error" hidden></p>
      </aside>
    </section>

    <!-- Active Weather Card on Homepage -->
    <section class="content-section" id="active-weather-section">
      <div class="section-heading">
        <div><span class="eyebrow">القراءة الحالية</span><h2 id="active-city-title">الجزائر العاصمة</h2><span id="current-city-label" class="sr-only">النشرة الحالية: الجزائر العاصمة</span></div>
        <div class="active-card-actions">
          <button id="weather-refresh" class="button button-secondary" type="button" data-i18n="refresh">↻ تحديث</button>
          <button id="favorite-toggle" class="button button-primary" type="button" aria-pressed="false" data-i18n="add_favorite">☆ أضف للمفضلة</button>
        </div>
      </div>
      <div id="weather-status" class="weather-status" role="status" aria-live="polite">جارٍ جلب قراءة الطقس…</div>
      <div class="now-grid" id="now-grid" hidden>
        <article class="current-card" id="current-card"></article>
        <aside class="decision-panel">
          <span class="eyebrow">إرشادات اليوم</span>
          <h3 id="weather-advice"></h3>
          <div class="decision-points" id="weather-summary"></div>
        </aside>
      </div>

      <!-- Outlook Section -->
      <div class="dashboard-shell forecast-section" id="outlook" hidden style="margin-top:2rem;">
        <div class="section-intro"><span>02 — الساعات القادمة</span><h2 data-i18n="hourly_forecast">الساعات القادمة</h2></div>
        <div class="hourly-rail observation-rail" id="hourly-list"></div>
        <div class="section-intro" style="margin-top:2rem;"><span>03 — نظرة أسبوعية</span><h2 data-i18n="daily_forecast">سبعة أيام قادمة</h2></div>
        <div class="daily-list" id="daily-list"></div>
      </div>

      <section class="dashboard-shell insights-shell" id="insights" hidden style="margin-top:2rem;">
        <div class="section-intro"><span>04 — قراءة أوسع</span><h2>نصائح ومؤشرات الطقس</h2></div>
        <div class="insight-grid" id="insight-grid"></div>
      </section>

      <!-- Marine Section -->
      <div class="dashboard-shell marine-section" id="marine" style="margin-top:2rem;">
        <div class="marine-copy"><span class="eyebrow">حالة البحر</span><h2 id="marine-title">النشرة البحرية</h2><p id="marine-copy"></p></div>
        <div class="marine-metrics" id="marine-metrics"></div>
      </div>
    </section>

    <!-- Algerian 69 Wilayas Grid Section -->
    <section class="content-section" id="wilayas-section">
      <div class="section-heading">
        <div><span class="eyebrow">دليل الولايات</span><h2 data-i18n="algeria_wilayas">ولايات الجزائر الـ 69</h2></div>
        <p id="result-count">69 ولاية</p>
      </div>
      <div class="city-index-toolbar city-index-toolbar--home">
        <label for="wilaya-search">ابحث بالاسم العربي، الفرنسي، الإنجليزي، أو رمز الولاية:</label>
        <input id="wilaya-search" class="wilaya-search" type="search" placeholder="مثال: وهران، Oran، 31، 041" autocomplete="off">
      </div>
      <div class="directory-grid directory-grid--visual-parity home-city-preview" id="wilaya-grid"></div>
      <div class="home-section-actions">
        <a class="button button-primary home-more-button" href="./wilayas/">عرض المزيد من الولايات</a>
      </div>
    </section>

    <!-- Arab Capitals Section -->
    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">الوطن العربي</span><h2 data-i18n="nav_capitals">العواصم العربية</h2></div>
        <p>22 عاصمة عربية بتغطية مباشرة</p>
      </div>
      <div class="directory-grid directory-grid--visual-parity home-city-preview home-capitals-preview" id="arab-capitals-grid"></div>
      <div class="home-section-actions">
        <a class="button button-primary home-more-button" href="./arab-capitals/">عرض المزيد من العواصم العربية</a>
      </div>
    </section>

    <!-- World Capitals by Continent -->
    <section class="content-section world-capitals-preview" aria-labelledby="world-capitals-heading">
      <div class="section-heading">
        <div><span class="eyebrow">استكشف العالم</span><h2 id="world-capitals-heading">عواصم العالم</h2></div>
        <p>${worldCapitals.length} عاصمة من أربع قارات</p>
      </div>
      <div class="feature-grid world-capitals-continent-grid home-world-preview">
        ${[
          ['africa','إفريقيا','🌍'],['europe','أوروبا','🏛️'],['america','الأمريكتان','🌎'],['asia','آسيا','🌏']
        ].map(([key,label,icon]) => `<a class="feature-card" href="./world-capitals/?continent=${key}"><span class="feature-index">${icon}</span><h3>عواصم ${label}</h3><p>${worldCapitals.filter(city => city.continent === key).length} عاصمة · بيانات طقس مباشرة</p><span>استكشف القارة ←</span></a>`).join('')}
      </div>
      <div class="home-section-actions"><a class="button button-primary home-more-button" href="./world-capitals/">عرض المزيد من عواصم العالم</a></div>
    </section>
  </main>

  <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
  <script type="application/json" id="capital-data">${JSON.stringify(capitals)}</script>
  <script type="application/json" id="world-capitals-data">${JSON.stringify(worldCapitals)}</script>

  <!-- Share Dialog Modal -->
  <dialog id="share-dialog" class="share-dialog" aria-labelledby="share-title" aria-describedby="share-description">
    <div class="share-dialog__content">
      <h3 id="share-title">مشاركة حالة الطقس</h3>
      <p id="share-description">تتضمن البطاقة الحرارة والحالة ووقت القراءة، مع رابط مباشر للمدينة.</p>
      <div id="share-preview" class="share-preview"></div>
      <div class="share-actions">
        <button id="share-copy" class="button button-secondary" type="button">نسخ الرابط</button>
        <button id="share-native" class="button button-primary" type="button">مشاركة مباشرة</button>
        <button id="share-image" class="button button-secondary" type="button">تحميل صورة</button>
        <button id="share-close" class="button button-secondary" type="button">إغلاق</button>
      </div>
      <p id="share-status" class="share-status"></p>
    </div>
  </dialog>

  ${getFooter(0)}
  <script type="module" src="./assets/js/site.js"></script>
  <script type="module" src="./assets/js/home-parity.js"></script>
  <script type="module" src="./assets/js/home-visual-parity.js"></script>
  <script type="module" src="./assets/js/home-directory-preview.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
}


// Generate the interactive map page from the same source used by the homepage.
{
  const mapHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="خريطة الطقس التفاعلية للولايات الجزائرية الـ69 والعواصم العربية مع طبقات الأمطار والحرارة والرياح.">
  <meta name="theme-color" content="#0c5b8c">
  <link rel="canonical" href="https://imadtbn.github.io/weather-today/map/">
  <title>خريطة الطقس التفاعلية | Weather Today | الطقس اليوم</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/map.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
</head>
<body>
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  ${getHeader(1, 'map')}
  <main id="main" class="map-page">
    <section class="map-hero map-page-hero">
      <span class="eyebrow"><span class="status-dot"></span> الطقس اليوم · مركز الخرائط</span>
      <h1>خريطة الطقس التفاعلية</h1>
      <p>استكشف مواقع الولايات الجزائرية والعواصم العربية، وافتح قراءة الطقس لكل موقع مباشرة من الخريطة.</p>
    </section>
    <section class="map-panel" aria-label="خريطة الطقس">
      <div class="map-toolbar">
        <div class="map-toolbar-title"><strong>الخريطة الجوية</strong><small id="map-status" role="status" aria-live="polite">جارٍ تهيئة الخريطة…</small></div>
        <div class="map-layers" aria-label="طبقات الطقس">
          <button type="button" data-layer="base" aria-pressed="false">الخريطة الأساسية</button>
          <button type="button" data-layer="precip" aria-pressed="false">الأمطار</button>
          <button type="button" data-layer="tmp2m" aria-pressed="false">الحرارة</button>
          <button type="button" data-layer="wind" aria-pressed="false">الرياح</button>
          <button type="button" data-layer="pressure" aria-pressed="false">الضغط</button>
        </div>
      </div>
      <div id="atlas-map" class="atlas-map" role="region" aria-label="خريطة تفاعلية للولايات والعواصم"></div>
      <div class="map-footer"><strong id="map-count">69 ولاية · 22 عاصمة عربية</strong><span>OpenStreetMap · Open-Meteo</span></div>
    </section>
    <aside class="map-disclaimer"><strong>ملاحظة:</strong> العلامات تعرض مواقع المدن والولايات، أما طبقات الطقس فتُحمّل من مزود الخرائط عند توفرها. لا تُعد هذه الخريطة بديلاً عن الإنذارات الرسمية.</aside>
    <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
    <script type="application/json" id="capital-data">${JSON.stringify(capitals)}</script>
  </main>
  ${getFooter(1)}
  <script type="module" src="../assets/js/site.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script type="module" src="../assets/js/map.js"></script>
</body>
</html>`;
  fs.mkdirSync(path.join(rootDir, 'map'), { recursive: true });
  fs.writeFileSync(path.join(rootDir, 'map', 'index.html'), mapHtml, 'utf8');
}

console.log('Build completed successfully!');

// Generate crawlable sitemap and robots.txt for the GitHub Pages project URL.
{
  const siteBase = 'https://imadtbn.github.io/weather-today';
  const routes = ['/', '/wilayas/', '/arab-capitals/', '/world-capitals/', '/world-search/', '/map/', '/climate-observatory/', '/agriculture-weather/', '/alerts/', '/favorites/', '/marine/', '/global-weather/'];
  const urls = [...routes, ...cities.map(city => '/weather/' + city.slug + '/')];
  const today = new Date().toISOString().slice(0, 10);
  const entries = urls.map(route => '  <url><loc>' + siteBase + route + '</loc><lastmod>' + today + '</lastmod></url>').join('\n');
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + '\n</urlset>\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + siteBase + '/sitemap.xml\n', 'utf8');
}


/* Weather Today AdSense integration: applied to every generated HTML page. */
{
  const htmlFiles = [];
  function collectHtml(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) collectHtml(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.html') &&
               !entry.name.endsWith('.template.html') &&
               !entry.name.startsWith('google')) htmlFiles.push(fullPath);
    }
  }

  collectHtml(rootDir);
  let updated = 0;
  for (const filePath of htmlFiles) {
    let html = fs.readFileSync(filePath, 'utf8');
    const depth = path.relative(rootDir, path.dirname(filePath))
      .split(path.sep).filter(Boolean).length;
    const rel = depth ? '../'.repeat(depth) : './';
    const cssHref = rel + 'assets/css/adsense.css';
    const jsSrc = rel + 'assets/js/adsense.js';
    let changed = false;

    // Google Search Console ownership verification and Google Tag Manager.
    const headAtForTracking = html.toLowerCase().indexOf('</head>');
    if (headAtForTracking >= 0) {
      let trackingMarkup = '';
      if (!html.includes('google-site-verification')) {
        trackingMarkup += '  <meta name="google-site-verification" content="f5Xi4oFx0v5dN6iPZd9qCw-7vnc3vIbAeYF9jr4vwVM">\\n';
      }
      if (!html.includes('GTM-NR5JGQ36')) {
        trackingMarkup += '  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-NR5JGQ36"></script>\\n' +
          '  <script>\\n' +
          '    window.dataLayer = window.dataLayer || [];\\n' +
          '    function gtag(){dataLayer.push(arguments); }\\n' +
          "    gtag('js', new Date());\\n" +
          '  </script>\\n';
      }
      if (trackingMarkup) {
        html = html.slice(0, headAtForTracking) + trackingMarkup + html.slice(headAtForTracking);
        changed = true;
      }
    }

    const headAt = html.toLowerCase().indexOf('</head>');
    if (!html.includes('adsense.css') && headAt >= 0) {
      html = html.slice(0, headAt) +
        '  <link rel="stylesheet" href="' + cssHref + '">' + '\n' +
        html.slice(headAt);
      changed = true;
    }

    if (!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) {
      const at = html.toLowerCase().indexOf('</head>');
      if (at >= 0) {
        html = html.slice(0, at) +
          '  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5656416032906373" crossorigin="anonymous"></script>' + '\n' +
          html.slice(at);
        changed = true;
      }
    }

    if (!html.includes('data-ad-slot="7867079394"')) {
      const openTagPattern = new RegExp('<(section|div)\\b[^>]*>', 'gi');
      let match;
      while ((match = openTagPattern.exec(html))) {
        const classMatch = match[0].match(/class=["']([^"']+)["']/i);
        if (!classMatch) continue;
        const tokens = classMatch[1].split(/\s+/);
        if (!tokens.some(token => token === 'hero' || token.endsWith('-hero') ||
                                  token.startsWith('hero-'))) continue;

        const tag = match[1].toLowerCase();
        const tagPattern = new RegExp('</?' + tag + '\\b[^>]*>', 'gi');
        tagPattern.lastIndex = match.index;
        let nesting = 0;
        let tagMatch;
        let closeEnd = -1;
        while ((tagMatch = tagPattern.exec(html))) {
          if (tagMatch[0].startsWith('</')) nesting--;
          else if (!tagMatch[0].endsWith('/>')) nesting++;
          if (nesting === 0) {
            closeEnd = tagPattern.lastIndex;
            break;
          }
        }

        if (closeEnd >= 0) {
          const ad = '\n    <!-- إعلانات ضمن المقال 01 -->\n' +
            '    <div class="ad-container ad-container--fluid" data-ad-placement="after-hero">\n' +
            '      <ins class="adsbygoogle" style="display:block" data-ad-format="fluid"\n' +
            '           data-ad-layout-key="-fr+57+4a-dc+8g"\n' +
            '           data-ad-client="ca-pub-5656416032906373" data-ad-slot="7867079394"></ins>\n' +
            '    </div>\n';
          html = html.slice(0, closeEnd) + ad + html.slice(closeEnd);
          changed = true;
        }
        break;
      }
    }

    if (!html.includes('data-ad-slot="3143411927"')) {
      const footerAt = html.toLowerCase().indexOf('<footer');
      if (footerAt >= 0) {
        const ad = '\n  <!-- إعلانات صورية 01 -->\n' +
          '  <div class="ad-container ad-container--responsive" data-ad-placement="before-footer">\n' +
          '    <ins class="adsbygoogle" style="display:block"\n' +
          '         data-ad-client="ca-pub-5656416032906373" data-ad-slot="3143411927"\n' +
          '         data-ad-format="auto" data-full-width-responsive="true"></ins>\n' +
          '  </div>\n';
        html = html.slice(0, footerAt) + ad + html.slice(footerAt);
        changed = true;
      }
    }

    if (!html.includes('assets/js/adsense.js')) {
      const bodyAt = html.toLowerCase().lastIndexOf('</body>');
      if (bodyAt >= 0) {
        html = html.slice(0, bodyAt) +
          '  <script defer src="' + jsSrc + '"></script>' + '\n' +
          html.slice(bodyAt);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, html, 'utf8');
      updated++;
    }
  }
  console.log('Applied AdSense placements to ' + updated +
    ' HTML pages (where matching hero/footer landmarks exist).');
}
