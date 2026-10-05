(function () {
  function getDriveImageId(value) {
    const input = String(value || '').trim();
    if (!input) return '';
    if (!/^https?:\/\//i.test(input)) return /^[\w-]+$/.test(input) ? input : '';

    try {
      const url = new URL(input);
      if (!/(^|\.)drive\.google\.com$|(^|\.)drive\.usercontent\.google\.com$|(^|\.)googleusercontent\.com$/i.test(url.hostname)) return '';
      return url.pathname.match(/\/(?:file\/)?d\/([\w-]+)/i)?.[1]
        || url.searchParams.get('id')
        || '';
    } catch (_) {
      return '';
    }
  }

  function normalize(value) {
    const input = String(value || '').trim();
    if (!input) return '';
    const id = getDriveImageId(input);
    if (!/^https?:\/\//i.test(input)) return `https://lh3.googleusercontent.com/${encodeURIComponent(input)}`;
    return id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000` : input;
  }

  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    const id = getDriveImageId(image.dataset.driveSource || image.currentSrc || image.src);
    if (!id) return;

    image.dataset.driveSource = image.dataset.driveSource || image.currentSrc || image.src;
    const fallbackUrls = [
      `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`,
      `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}`,
      `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1000`
    ];
    const attempt = Number(image.dataset.driveFallbackAttempt || 0);
    if (attempt >= fallbackUrls.length) return;
    image.dataset.driveFallbackAttempt = String(attempt + 1);
    image.src = fallbackUrls[attempt];
  }, true);

  window.HBImages = { normalize };
}());
