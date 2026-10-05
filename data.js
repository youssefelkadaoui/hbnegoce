/* الكتالوج يبدأ فارغاً. المنتجات الوحيدة المعروضة هي المنشورة من لوحة المدير. */
const catalogSeed = [];
const catalogStorageVersion = 'admin-only-v1';

function normalizeProductImageUrl(value) {
  return window.HBImages.normalize(value);
}

function normalizeCatalogProduct(product) {
  const normalized = { ...product };
  normalized.image = normalizeProductImageUrl(normalized.image);
  if (Array.isArray(normalized.images)) normalized.images = normalized.images.map(normalizeProductImageUrl);
  if (Array.isArray(normalized.variants)) normalized.variants = normalized.variants.map(variant => ({ ...variant, image: normalizeProductImageUrl(variant.image) }));
  return normalized;
}

function getCatalogProducts() {
  try {
    // Remove the catalog that was saved by the old version of the website once.
    if (localStorage.getItem('hb_catalog_storage_version') !== catalogStorageVersion) {
      localStorage.removeItem('hb_catalog_products');
      localStorage.removeItem('hb_remote_catalog');
      localStorage.setItem('hb_catalog_storage_version', catalogStorageVersion);
    }
    const remoteCatalog = JSON.parse(localStorage.getItem('hb_remote_catalog'));
    return Array.isArray(remoteCatalog) ? remoteCatalog.map(normalizeCatalogProduct) : [];
  } catch (_) {
    return [];
  }
}

let products = getCatalogProducts();
