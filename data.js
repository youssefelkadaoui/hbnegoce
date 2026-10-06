/* الكتالوج يبدأ فارغاً. المنتجات الوحيدة المعروضة هي المنشورة من لوحة المدير. */
const catalogSeed = [];
const catalogStorageVersion = 'admin-only-v1';

function normalizeDriveImage(value) {
  const source = String(value || '').trim();
  if (!source) return '';
  const driveId = source.match(/(?:\/file\/d\/|\/d\/|[?&]id=)([^/?&]+)/i)?.[1];
  if (driveId && /(?:drive\.google\.com|docs\.google\.com|googleusercontent\.com)/i.test(source)) {
    return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`;
  }
  if (/^https?:\/\//i.test(source)) return source;
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(source)}`;
}

function normalizeProductImages(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  return {
    ...product,
    image: normalizeDriveImage(product.image || images[0] || variants[0]?.image),
    ...(Array.isArray(product.images) ? { images: images.map(normalizeDriveImage) } : {}),
    ...(Array.isArray(product.variants)
      ? { variants: variants.map(variant => ({ ...variant, image: normalizeDriveImage(variant.image) })) }
      : {})
  };
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
    return Array.isArray(remoteCatalog) ? remoteCatalog.map(normalizeProductImages) : [];
  } catch (_) {
    return [];
  }
}

let products = getCatalogProducts();
