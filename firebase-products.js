// Loads store products from Realtime Database without blocking the page.
// The local data.js list remains visible if the database is empty or unreachable.
window.hbProductsReady = (async () => {
  try {
    const [{ database }, { onValue, ref }] = await Promise.all([
      import('./firebase-config.js'),
      import('https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js')
    ]);

    return await new Promise((resolve) => {
      let firstLoad = true;
      onValue(ref(database, 'products'), (snapshot) => {
        const stored = snapshot.val();
        const list = stored ? Object.values(stored).filter(Boolean) : [];
        if (list.length && Array.isArray(window.hbProducts)) {
          window.hbProducts.splice(0, window.hbProducts.length, ...list);
          window.dispatchEvent(new CustomEvent('hb-products-updated', { detail: list }));
        }
        if (firstLoad) {
          firstLoad = false;
          resolve(list);
        }
      }, () => resolve([]));
    });
  } catch (error) {
    console.warn('Could not load Firebase products; using local products.', error);
    return [];
  }
})();
