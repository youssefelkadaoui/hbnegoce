/* الكتالوج يبدأ فارغاً. المنتجات الوحيدة المعروضة هي المنشورة من لوحة المدير. */
const catalogSeed = [];
const catalogStorageVersion = 'admin-only-v1';

function getCatalogProducts() {
  try {
    // Remove the catalog that was saved by the old version of the website once.
    if (localStorage.getItem('hb_catalog_storage_version') !== catalogStorageVersion) {
      localStorage.removeItem('hb_catalog_products');
      localStorage.removeItem('hb_remote_catalog');
      localStorage.setItem('hb_catalog_storage_version', catalogStorageVersion);
    }
    const remoteCatalog = JSON.parse(localStorage.getItem('hb_remote_catalog'));
    return Array.isArray(remoteCatalog) ? remoteCatalog : [];
  } catch (_) {
    return [];
  }
}

let products = getCatalogProducts();
