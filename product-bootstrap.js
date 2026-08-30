// Wait briefly for Firebase products before loading the details-page script.
// This makes newly managed products available directly through their link.
(async () => {
  try {
    const productId = Number(new URLSearchParams(window.location.search).get('id')) || Number(sessionStorage.getItem('hb_lastProduct'));
    const isLocalProduct = Array.isArray(window.hbProducts) && window.hbProducts.some((product) => Number(product.id) === productId);
    // Existing local products can render at once. Only a newly added Firebase
    // product needs to wait for the database response.
    if (!isLocalProduct) {
      await Promise.race([
        window.hbProductsReady || Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, 3500))
      ]);
    }
  } finally {
    const script = document.createElement('script');
    script.src = 'product.js';
    document.body.appendChild(script);
  }
})();
