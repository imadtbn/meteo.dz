const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const citiesPath = path.join(rootDir, 'data', 'cities.json');
const capitalsPath = path.join(rootDir, 'data', 'arab-capitals.json');

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const capitals = JSON.parse(fs.readFileSync(capitalsPath, 'utf8'));

console.log(`Loaded ${cities.length} Algerian wilayas and ${capitals.length} Arab capitals.`);

function getHeader(depth = 0, activeKey = '') {
  const rel = depth === 0 ? './' : '../'.repeat(depth);
  return `
  <header class="site-header">
    <a class="brand" href="${rel}" aria-label="Weather Today | الطقس اليوم">
      <img src="${rel}favicon.svg" width="42" height="42" alt="Weather Today">
      <span><strong data-i18n="brand_title">الطقس اليوم</strong><small data-i18n="brand_sub">توقعات الطقس حول العالم</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="فتح القائمة">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <nav class="primary-navigation" id="primary-navigation" aria-label="التنقل الرئيسي">
      <a href="${rel}" ${activeKey === 'home' ? 'aria-current="page"' : ''} data-i18n="nav_home">الرئيسية</a>
      <a href="${rel}wilayas/" ${activeKey === 'wilayas' ? 'aria-current="page"' : ''} data-i18n="nav_wilayas">الولايات</a>
      <a href="${rel}arab-capitals/" ${activeKey === 'capitals' ? 'aria-current="page"' : ''} data-i18n="nav_capitals">العواصم العربية</a>
      <a href="${rel}world-search/" ${activeKey === 'search' ? 'aria-current="page"' : ''} data-i18n="nav_world_search">بحث عالمي</a>
      <a href="${rel}map/" ${activeKey === 'map' ? 'aria-current="page"' : ''} data-i18n="nav_map">خريطة الطقس</a>
      <a href="${rel}climate-observatory/" ${activeKey === 'climate' ? 'aria-current="page"' : ''} data-i18n="nav_climate">المرصد المناخي</a>
      <a href="${rel}agriculture-weather/" ${activeKey === 'agri' ? 'aria-current="page"' : ''} data-i18n="nav_agri">الطقس الزراعي</a>
      <a href="${rel}marine/" ${activeKey === 'marine' ? 'aria-current="page"' : ''} data-i18n="nav_marine">الطقس البحري</a>
      <a href="${rel}alerts/" ${activeKey === 'alerts' ? 'aria-current="page"' : ''} data-i18n="nav_alerts">الإنذارات</a>
      <a href="${rel}favorites/" ${activeKey === 'favorites' ? 'aria-current="page"' : ''} data-i18n="nav_favorites">المفضلة</a>
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
      <button class="action-button" type="button" data-action="share" data-i18n="share">مشاركة</button>
      <button class="action-button install-btn" type="button" data-action="install" data-i18n="install" style="display:none;">تثبيت</button>
    </div>
  </header>`;
}

function getFooter(depth = 0) {
  const rel = depth === 0 ? './' : '../'.repeat(depth);
  return `
  <footer class="site-footer">
    <div class="footer-wrap">
      <a class="footer-brand" href="${rel}">
        <img src="${rel}favicon.svg" width="32" height="32" alt="">
        <span>Weather Today | الطقس اليوم</span>
      </a>
      <p data-i18n="data_source">المنصة المعتمدة للطقس والمناخ · بيانات مباشرة من Open-Meteo & NASA POWER</p>
      <p>© <span data-current-year></span> الطقس اليوم. <span data-i18n="all_rights">جميع الحقوق محفوظة</span>.</p>
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
  <meta name="keywords" content="طقس ${city.name}, طقس ${city.name_fr}, ولاية ${city.code}, طقس الجزائر, أحوال الجو ${city.slug}">
  <meta name="theme-color" content="#0c5b8c">
  <title>طقس ولاية ${city.name} (${city.code}) | الطقس اليوم</title>
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
          <a class="button button-secondary" href="../../wilayas/">دليل الولايات</a>
          <button class="button button-primary" id="favorite-toggle" type="button" aria-pressed="false" data-i18n="add_favorite">☆ أضف للمفضلة</button>
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
        <button id="weather-refresh" class="button button-secondary" type="button" data-i18n="refresh">تحديث القراءة</button>
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
    title: 'دليل ولايات الجزائر الـ 69 | الطقس اليوم',
    heading: 'ولايات الجزائر الـ 69',
    intro: 'استكشف حالة الطقس والتوقعات في كافة ولايات الجزائر الـ 69 بالبحث بالاسم العربي أو الفرنسي أو الإنجليزي أو رمز الولاية ومفتاح الهاتف.',
    subheading: 'فهرس ولايات الجزائر'
  },
  {
    folder: 'arab-capitals',
    kind: 'arab-capitals',
    title: 'طقس العواصم العربية | الطقس اليوم',
    heading: 'طقس العواصم العربية الـ 22',
    intro: 'رصد جوي دقيق لجميع عواصم الدول العربية مع درجات الحرارة اللحظية وتوقعات الأيام القادمة.',
    subheading: 'قائمة العواصم العربية'
  },
  {
    folder: 'world-search',
    kind: 'world-search',
    title: 'البحث العالمي عن الطقس | الطقس اليوم',
    heading: 'البحث العالمي عن مدن العالم',
    intro: 'ابحث عن أي مدينة أو ولاية في الجزائر والوطن العربي وجميع أنحاء العالم للحصول على تقرير طقس دقيق.',
    subheading: 'محرك البحث الجغرافي العالمي'
  },
  {
    folder: 'favorites',
    kind: 'favorites',
    title: 'المدن والولايات المفضلة | الطقس اليوم',
    heading: 'قائمتي المفضلة',
    intro: 'الوصول السريع إلى ولاياتك ومدنك المحفوظة لمتابعة مستمرة لطقسها اليومي.',
    subheading: 'ولاياتك المحفوظة'
  },
  {
    folder: 'alerts',
    kind: 'alerts',
    title: 'الإنذارات والتنبيهات الجوية | الطقس اليوم',
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
  <title>المرصد المناخي الجزائري | الطقس اليوم</title>
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
  <title>الطقس الزراعي | الطقس اليوم</title>
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
  <title>خريطة الطقس ومركز الملاحة | الطقس اليوم</title>
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
  <title>الطقس البحري والسواحل | الطقس اليوم</title>
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
  <title>الطقس العالمي | الطقس اليوم</title>
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
  <meta name="description" content="Weather Today | الطقس اليوم: حالة الطقس الآن والتوقعات اليومية والساعية والأسبوعية للمدن حول العالم، مع تغطية 69 ولاية جزائرية و22 عاصمة عربية.">
  <meta name="theme-color" content="#0c5b8c">
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
        <span class="eyebrow"><span class="status-dot"></span> المنصة المعتمدة للطقس والمناخ</span>
        <h1>طقس الجزائر والوطن العربي،<br><em>بدقة واحترافية.</em></h1>
        <p>تغطية شاملة لـ 69 ولاية جزائرية مستقلة، 22 عاصمة عربية، وبحث عالمي لحظي لجميع مدن العالم مع النشرات البحرية والزراعية.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="./wilayas/" data-i18n="explore_wilayas">استكشف الولايات الـ 69 <span aria-hidden="true">←</span></a>
          <a class="button button-secondary" href="./world-search/" data-i18n="nav_world_search">بحث عالمي</a>
          <button class="button button-secondary" type="button" data-action="install" data-i18n="install">تثبيت التطبيق</button>
        </div>
      </div>
      <aside class="hero-note" id="city-picker">
        <span class="note-kicker">البحث والوصول السريع</span>
        <label for="hero-global-city-search" style="display:block;margin-bottom:0.5rem;font-weight:bold;">ابحث عن أي مدينة أو ولاية:</label>
        <input id="hero-global-city-search" type="search" placeholder="مثال: وهران، الجزائر، القاهرة، Paris..." autocomplete="off" class="directory-search-input">
        <div id="city-search-results" class="city-search-panel" hidden></div>
        <div class="note-divider"></div>
        <button id="location-quick" class="button button-secondary" type="button" style="width:100%;">استخدم موقعي الحالي</button>
        <p id="location-error" class="location-error" hidden></p>
      </aside>
    </section>

    <!-- Active Weather Card on Homepage -->
    <section class="content-section" id="active-weather-section">
      <div class="section-heading">
        <div><span class="eyebrow">القراءة الحالية</span><h2 id="active-city-title">الجزائر العاصمة</h2></div>
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
      <div class="directory-grid directory-grid--visual-parity" id="wilaya-grid"></div>
      <div style="text-align:center;margin-top:1.5rem;">
        <button id="show-more" class="button button-secondary" type="button">عرض المزيد من الولايات</button>
      </div>
    </section>

    <!-- Arab Capitals Section -->
    <section class="content-section">
      <div class="section-heading">
        <div><span class="eyebrow">الوطن العربي</span><h2 data-i18n="nav_capitals">العواصم العربية</h2></div>
        <p>22 عاصمة عربية بتغطية مباشرة</p>
      </div>
      <div class="feature-grid">
        ${capitals.slice(0, 6).map(c => `
          <a class="feature-card" href="./global-weather/?lat=${c.latitude}&lon=${c.longitude}&name=${encodeURIComponent(c.capital)}">
            <span class="feature-index">🌍</span>
            <h3>${c.capital}</h3>
            <p>${c.country} · ${c.englishName}</p>
            <span>عرض الطقس ←</span>
          </a>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:1.5rem;">
        <a class="button button-primary" href="./arab-capitals/">استعراض جميع العواصم العربية الـ 22 ←</a>
      </div>
    </section>
  </main>

  <script type="application/json" id="city-data">${JSON.stringify(cities)}</script>
  <script type="application/json" id="capital-data">${JSON.stringify(capitals)}</script>

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
</body>
</html>`;
  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
}

console.log('Build completed successfully!');

// Generate crawlable sitemap and robots.txt for the GitHub Pages project URL.
{
  const siteBase = 'https://imadtbn.github.io/weather-today';
  const routes = ['/', '/wilayas/', '/arab-capitals/', '/world-search/', '/map/', '/climate-observatory/', '/agriculture-weather/', '/alerts/', '/favorites/', '/marine/', '/global-weather/'];
  const urls = [...routes, ...cities.map(city => '/weather/' + city.slug + '/')];
  const today = new Date().toISOString().slice(0, 10);
  const entries = urls.map(route => '  <url><loc>' + siteBase + route + '</loc><lastmod>' + today + '</lastmod></url>').join('\n');
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + '\n</urlset>\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + siteBase + '/sitemap.xml\n', 'utf8');
}
