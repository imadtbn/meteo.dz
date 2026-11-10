/* Initialize each AdSense unit once; the library itself is loaded once in <head>. */
(() => {
  const initializeAds = () => {
    if (!Array.isArray(window.adsbygoogle)) window.adsbygoogle = window.adsbygoogle || [];
    document.querySelectorAll('.ad-container ins.adsbygoogle').forEach((unit) => {
      if (unit.dataset.adsInitialized === 'true' ||
          unit.hasAttribute('data-adsbygoogle-status')) return;
      unit.dataset.adsInitialized = 'true';
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        unit.dataset.adsInitialized = 'false';
        console.warn('Weather Today AdSense unit initialization failed:', error);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAds, { once: true });
  } else {
    initializeAds();
  }
})();
