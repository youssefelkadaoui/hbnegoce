// Wait briefly for Firebase products before loading the details-page script.
// This makes newly managed products available directly through their link.
(async () => {
  try {
    await Promise.race([
      window.hbProductsReady || Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 3500))
    ]);
  } finally {
    const script = document.createElement('script');
    script.src = 'product.js';
    document.body.appendChild(script);
  }
})();
