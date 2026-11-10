/* Initialize only explicitly placed manual AdSense units. */
(() => {
  const initializeAds = () => {
    window.adsbygoogle = window.adsbygoogle || [];
    document.querySelectorAll('.ad-container[data-ad-placement] ins.adsbygoogle[data-ad-slot]').forEach((unit) => {
      if (unit.dataset.adsInitialized === 'true' || unit.hasAttribute('data-adsbygoogle-status')) return;
      unit.dataset.adsInitialized = 'true';
      try { window.adsbygoogle.push({}); }
      catch (error) { delete unit.dataset.adsInitialized; console.warn('Weather Today AdSense initialization failed:', error); }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAds, { once:true });
  else initializeAds();
})();
