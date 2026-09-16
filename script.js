const grid = document.getElementById('productsGrid'), filters = document.getElementById('filters'), search = document.getElementById('searchInput');
let active = 'all', query = '', cart = JSON.parse(localStorage.getItem('hb_cart') || '[]');
const money = n => `${Number(n).toLocaleString('ar-MA')} د.م`;
const toast = msg => { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2500); };
function saveCart() { localStorage.setItem('hb_cart', JSON.stringify(cart)); document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0); renderCart(); }
function render() {
  products = getCatalogProducts();
  const categories = ['all', ...new Set(products.map(p => p.category))];
  filters.innerHTML = categories.map(c => `<button class="${c === active ? 'active' : ''}" data-category="${c}">${c === 'all' ? 'الكل' : c}</button>`).join('');
  const categorySection = document.getElementById('categories');
  if (categorySection) {
    categorySection.hidden = !products.length;
    if (products.length) {
      const icons = { 'all': 'fa-solid fa-border-all', 'عطور': 'fa-solid fa-spray-can-sparkles', 'ملابس': 'fa-solid fa-shirt', 'أحذية': 'fa-solid fa-shoe-prints', 'ساعات': 'fa-regular fa-clock', 'إكسسوارات': 'fa-solid fa-gem', 'محافظ': 'fa-solid fa-wallet', 'حقائب': 'fa-solid fa-briefcase' };
      const labels = { 'all': 'كل المنتجات' };
      const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      categorySection.innerHTML = `<div class="container"><div class="section-intro"><span class="eyebrow dark">اختر عالمك</span><h2>أقسام مصممة لأسلوبك</h2></div><div class="category-grid">${categories.map(c => `<button data-filter="${esc(c)}"><i class="${icons[c] || 'fa-solid fa-tag'}"></i><span>${esc(labels[c] || c)}</span></button>`).join('')}</div></div>`;
    }
  }
  const list = products.filter(p => (active === 'all' || p.category === active) && `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML = list.length ? list.map(p => `<article class="product-card" data-id="${p.id}"><div class="product-media">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="product-body"><div class="product-brand">${p.brand}</div><h3 class="product-title">${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-bottom"><div><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}</div><button class="add-btn" aria-label="أضف للسلة"><i class="fa-solid fa-plus"></i></button></div></div></article>`).join('') : `<div class="empty">${products.length ? 'لا توجد منتجات مطابقة.<br><small>جرب كلمة بحث أخرى أو فئة مختلفة.</small>' : 'لا توجد منتجات منشورة حالياً.<br><small>نعمل على إضافة مجموعتنا قريباً — تابعنا!</small>'}</div>`;
}
function renderCart() { const target = document.getElementById('cartItems'), total = cart.reduce((sum, item) => sum + item.price * item.qty, 0); target.innerHTML = cart.length ? cart.map(item => `<div class="cart-row"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><p>${money(item.price)} × ${item.qty}</p></div><button class="remove" data-remove="${item.id}"><i class="fa-solid fa-trash"></i></button></div>`).join('') : '<div class="empty">سلتك فارغة حالياً</div>'; document.getElementById('cartTotal').textContent = money(total); }
function add(id) { const product = products.find(p => p.id === id), item = cart.find(p => p.id === id); if (item) item.qty++; else cart.push({ ...product, qty: 1 }); saveCart(); toast('تمت إضافة المنتج إلى السلة'); }
const open = id => document.getElementById(id).classList.add('open'), close = id => document.getElementById(id).classList.remove('open');
window.addEventListener('hb-catalog-updated', render);
document.addEventListener('click', event => {
  const cat = event.target.closest('[data-category]'); if (cat) { active = cat.dataset.category; render(); }
  const shortcut = event.target.closest('[data-filter]'); if (shortcut) { active = shortcut.dataset.filter; render(); document.querySelector('#products').scrollIntoView({ behavior: 'smooth' }); }
  const addButton = event.target.closest('.add-btn'); if (addButton) { add(Number(addButton.closest('.product-card').dataset.id)); return; }
  const card = event.target.closest('.product-card'); if (card) { sessionStorage.setItem('hb_lastProduct', card.dataset.id); window.location.href = `product/product.html?id=${card.dataset.id}`; }
  if (event.target.closest('#adminBtn')) window.location.href = 'admin/admin.html';
  if (event.target.closest('#cartBtn')) { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('overlay').classList.add('show'); }
  if (event.target.closest('#closeCart') || event.target.id === 'overlay') { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); }
  if (event.target.closest('[data-close]')) close(event.target.closest('[data-close]').dataset.close);
  const remove = event.target.closest('[data-remove]'); if (remove) { cart = cart.filter(item => item.id !== Number(remove.dataset.remove)); saveCart(); }
});
search.addEventListener('input', event => { query = event.target.value; render(); });
document.getElementById('checkoutBtn').addEventListener('click', () => { if (!cart.length) return toast('أضف منتجاً إلى السلة أولاً'); open('checkoutModal'); });
document.getElementById('checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.length) return toast('أضف منتجاً إلى السلة أولاً');
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const lines = cart.map(item => `• ${item.name} × ${item.qty} — ${money(item.price * item.qty)}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderData = { orderId: `HB-${Date.now()}`, customer: { name, phone, address }, items: cart, total, currency: 'MAD', createdAt: new Date().toISOString() };
  document.getElementById('formSubject').value = `طلب جديد من ${name}`;
  document.getElementById('formProducts').value = lines;
  document.getElementById('formTotal').value = money(total);
  document.getElementById('formThankYouUrl').value = new URL('thank-you/thank-you.html', window.location.href).href;
  localStorage.setItem('hb_last_order', JSON.stringify(orderData));
  document.getElementById('checkoutForm').submit();
  cart = []; saveCart(); close('checkoutModal');
  setTimeout(() => window.location.assign('thank-you/thank-you.html'), 700);
});
render(); saveCart();
