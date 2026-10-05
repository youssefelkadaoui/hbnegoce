(function () {
  const config = window.HB_SUPABASE_CONFIG || {};
  const loadingView = document.getElementById('loadingView');
  const dashboard = document.getElementById('dashboard');
  const productMessage = document.getElementById('productMessage');
  const variantFields = document.getElementById('variantFields');
  const safe = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char]);
  const imageUrl = value => window.HBImages.normalize(value);
  const setMessage = (text, ok = false) => { productMessage.textContent = text; productMessage.style.color = ok ? '#257344' : '#aa4038'; };

  if (!config.url || !config.anonKey) {
    loadingView.innerHTML = '<div class="loader" aria-hidden="true"></div><p class="kicker">تنبيه</p><h1>إعدادات لوحة الإدارة</h1><p class="muted">أكمل بيانات Supabase في ملف config.js أولاً، واتبع SETUP_AR.md.</p>';
    return;
  }

  const supabase = window.supabase.createClient(config.url, config.anonKey);
  let catalog = [];

  function addVariant(values = {}) {
    const row = document.createElement('div');
    row.className = 'variant-row';
    row.innerHTML = `<label>اسم النوع<input class="variant-name" placeholder="مثال: أسود / مقاس L" value="${safe(values.name)}" required></label><label>رابط صورة النوع<input class="variant-image" type="text" placeholder="رابط مشاركة Drive أو معرّف الصورة" value="${safe(values.image)}" required></label><button type="button" class="delete remove-variant">حذف</button>`;
    variantFields.appendChild(row);
  }

  function showLoading() {
    loadingView.hidden = false;
    dashboard.hidden = true;
  }

  async function loadProducts() {
    const { data, error } = await supabase.from('products').select('id,payload').order('created_at', { ascending: false });
    if (error) return setMessage(error.message);
    catalog = data || [];
    document.getElementById('clearCatalog').hidden = catalog.length === 0;
    document.getElementById('count').textContent = catalog.length;
    document.getElementById('productList').innerHTML = catalog.length ? catalog.map(row => {
      const p = row.payload || {}; const stock = p.stockStatus === 'limited' ? 'كمية محدودة' : 'كمية غير محدودة';
      return `<article class="item"><img src="${safe(imageUrl(p.image))}" alt=""><div><strong>${safe(p.name)}</strong><small>${safe(p.category)} · ${safe(p.price)} د.م · ${stock}</small></div><button class="delete" data-id="${safe(row.id)}">حذف</button></article>`;
    }).join('') : '<p class="muted">لا توجد منتجات منشورة بعد.</p>';
  }

  async function showDashboard() {
    loadingView.hidden = true;
    dashboard.hidden = false;
    await loadProducts();
  }

  addVariant();
  document.getElementById('addVariantBtn').addEventListener('click', () => addVariant());
  variantFields.addEventListener('click', event => { const button = event.target.closest('.remove-variant'); if (button && variantFields.children.length > 1) button.closest('.variant-row').remove(); });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    showLoading();
    setTimeout(() => showDashboard(), 800);
  });

  document.getElementById('productForm').addEventListener('submit', async event => {
    event.preventDefault(); const form = new FormData(event.target);
    const variants = [...variantFields.querySelectorAll('.variant-row')].map((row, index) => ({ index: index + 1, name: row.querySelector('.variant-name').value.trim(), image: imageUrl(row.querySelector('.variant-image').value.trim()) }));
    if (variants.some(variant => !variant.name || !variant.image)) return setMessage('أكمل اسم وصورة كل نوع من أنواع المنتج.');
    const payload = { id: Date.now(), name: form.get('name').trim(), brand: form.get('brand').trim() || 'HB.negoce', category: form.get('category'), price: Number(form.get('price')), oldPrice: form.get('oldPrice') ? Number(form.get('oldPrice')) : null, image: variants[0].image, images: variants.map(variant => variant.image), variants, stockStatus: form.get('stockStatus'), badge: form.get('badge').trim() || 'جديد', desc: form.get('desc').trim(), specs: [] };
    setMessage('جارٍ النشر…');
    const { error } = await supabase.from('products').insert({ id: payload.id, payload });
    if (error) return setMessage('تعذر النشر: ' + error.message);
    event.target.reset(); variantFields.innerHTML = ''; addVariant(); setMessage('تم نشر المنتج بنجاح.', true); loadProducts();
  });

  document.getElementById('productList').addEventListener('click', async event => {
    const button = event.target.closest('.delete'); if (!button || !confirm('هل تريد حذف هذا المنتج نهائياً؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', Number(button.dataset.id));
    if (error) return setMessage('تعذر الحذف: ' + error.message); setMessage('تم حذف المنتج.', true); loadProducts();
  });

  document.getElementById('clearCatalog').addEventListener('click', async () => {
    if (!confirm('سيتم حذف جميع المنتجات المنشورة نهائياً. هل تريد المتابعة؟')) return;
    const { error } = await supabase.from('products').delete().gt('id', 0);
    if (error) return setMessage('تعذر حذف الكتالوج: ' + error.message); setMessage('تم إفراغ الكتالوج.', true); loadProducts();
  });

  setTimeout(() => showDashboard(), 1200);
}());
