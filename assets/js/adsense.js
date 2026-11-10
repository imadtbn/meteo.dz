/* Initialize manual AdSense units and collapse placements Google marks as unfilled. */
(() => {
  const initializeAds = () => {
    window.adsbygoogle = window.adsbygoogle || [];

    document.querySelectorAll('.ad-container[data-ad-placement] ins.adsbygoogle[data-ad-slot]').forEach((unit) => {
      const container = unit.closest('.ad-container');
      if (!container) return;

      const syncAdVisibility = () => {
        const status = unit.getAttribute('data-ad-status');
        if (status === 'unfilled') {
          container.classList.add('is-unfilled');
          container.setAttribute('aria-hidden', 'true');
        } else if (status === 'filled') {
          container.classList.remove('is-unfilled');
          container.removeAttribute('aria-hidden');
        }
      };

      // Watch Google's explicit fill status; do not hide while the request is pending.
      if (unit.dataset.adStatusObserver !== 'true') {
        const observer = new MutationObserver(syncAdVisibility);
        observer.observe(unit, { attributes: true, attributeFilter: ['data-ad-status'] });
        unit.dataset.adStatusObserver = 'true';
      }
      syncAdVisibility();

      if (unit.dataset.adsInitialized === 'true' || unit.hasAttribute('data-adsbygoogle-status')) return;
      unit.dataset.adsInitialized = 'true';
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        delete unit.dataset.adsInitialized;
        console.warn('Weather Today AdSense initialization failed:', error);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAds, { once: true });
  } else {
    initializeAds();
  }
})();
