const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const searchInput = document.getElementById('searchInput');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutForm = document.getElementById('checkoutForm');
const contactForm = document.getElementById('contactForm');
const infoBtn = document.getElementById('infoBtn');
const socialPopup = document.getElementById('socialPopup');
const socialPopupClose = document.getElementById('socialPopupClose');

let cart = JSON.parse(localStorage.getItem('hb_cart')) || [];
let activeFilter = 'all';
let activeQuery = '';
let toastTimeout;

function fmtPrice(n) {
  try { return n.toLocaleString('ar'); } catch (e) { return String(n); }
}

const googleSheetsEndpoint = 'https://script.google.com/macros/s/AKfycbyJHi3EXEUG6JaMoSp-_RmgAMzNTLEzwGXrE675h9JLaXtpxVS_7Xbg0I4C1cOOGH0X0A/exec';

function sendOrderToGoogleSheets(order) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = googleSheetsEndpoint;
  form.target = 'googleSheetsSubmitFrame';
  form.style.display = 'none';

  Object.entries(order).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 1000);
}

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesType = activeFilter === 'all' || product.type === activeFilter;
    const query = activeQuery.trim().toLowerCase();
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productsGrid.innerHTML = '';

  if (!filtered.length) {
    productsGrid.innerHTML = '<div class="cart-empty"><i class="fas fa-search"></i><p>لا توجد نتائج مطابقة</p></div>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.href = `product.html?id=${product.id}`;
    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-footer">
          <div class="product-prices">
            ${product.oldPrice ? `<span class="product-old-price">${fmtPrice(product.oldPrice)} درهم</span>` : ''}
            <span class="product-price">${fmtPrice(product.price)} درهم</span>
          </div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      sessionStorage.setItem('hb_lastProduct', String(product.id));
      window.location.href = card.dataset.href;
    });
    productsGrid.appendChild(card);
    card.classList.add('anim-in');
    requestAnimationFrame(() => card.classList.add('show'));
  });
}

document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener('input', (event) => {
  activeQuery = event.target.value;
  renderProducts();
});

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'grid' : 'none';
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>سلتك فارغة حالياً</p><span class="cart-empty-sub">أضف منتجات للبدء في التسوق</span></div>';
    cartSubtotal.textContent = '0 درهم';
    cartTotal.textContent = '0 درهم';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-row">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          ${item.variant ? `<p class="cart-item-variant">رقم ${item.variant}</p>` : ''}
          <p class="cart-item-brand">${item.brand}</p>
          <p class="cart-item-price">${fmtPrice(item.price * item.qty)} درهم</p>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-qty">
          <button class="qty-down" data-id="${item.id}" data-variant="${item.variantIndex !== undefined ? item.variantIndex : ''}">−</button>
          <span>${item.qty}</span>
          <button class="qty-up" data-id="${item.id}" data-variant="${item.variantIndex !== undefined ? item.variantIndex : ''}">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" data-variant="${item.variantIndex !== undefined ? item.variantIndex : ''}" aria-label="إزالة">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartSubtotal.textContent = `${fmtPrice(subtotal)} درهم`;
  cartTotal.textContent = `${fmtPrice(subtotal)} درهم`;
}

function saveCart() {
  localStorage.setItem('hb_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function changeQty(productId, variantIndex, delta) {
  const existing = cart.find((item) => item.id === productId && (item.variantIndex ?? '') === (variantIndex ?? ''));
  if (!existing) return;
  existing.qty += delta;
  if (existing.qty <= 0) cart = cart.filter((item) => !(item.id === productId && (item.variantIndex ?? '') === (variantIndex ?? '')));
  saveCart();
}

function removeFromCart(productId, variantIndex) {
  cart = cart.filter((item) => !(item.id === productId && (item.variantIndex ?? '') === (variantIndex ?? '')));
  saveCart();
  showToast('تمت إزالة المنتج من السلة');
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function openCheckout() {
  if (!cart.length) {
    showToast('أضف منتجات إلى السلة أولاً');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  checkoutSummary.innerHTML = `
    <h4>ملخص الطلب</h4>
    <ul>
      ${cart.map((item) => `<li><span>${item.name} ${item.variant ? '(رقم ' + item.variant + ')' : ''} × ${item.qty}</span><span>${fmtPrice(item.price * item.qty)} درهم</span></li>`).join('')}
    </ul>
    <div class="cart-total" style="margin-top: 12px;"><span>الإجمالي</span><span>${fmtPrice(total)} درهم</span></div>
  `;
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openSocialPopup() {
  socialPopup.classList.add('open');
}
function closeSocialPopup() {
  socialPopup.classList.remove('open');
}

productsGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.product-card');
  if (card && card.dataset.href) {
    window.location.href = card.dataset.href;
  }
});

cartItems.addEventListener('click', (event) => {
  const up = event.target.closest('.qty-up');
  if (up) {
    changeQty(Number(up.dataset.id), up.dataset.variant !== '' ? Number(up.dataset.variant) : undefined, 1);
    return;
  }
  const down = event.target.closest('.qty-down');
  if (down) {
    changeQty(Number(down.dataset.id), down.dataset.variant !== '' ? Number(down.dataset.variant) : undefined, -1);
    return;
  }
  const remove = event.target.closest('.cart-item-remove');
  if (remove) {
    removeFromCart(Number(remove.dataset.id), remove.dataset.variant !== '' ? Number(remove.dataset.variant) : undefined);
  }
});

const closeCartBtn = document.getElementById('closeCartBtn');

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
closeCartBtn.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);
closeCheckout.addEventListener('click', closeCheckoutModal);
checkoutBtn.addEventListener('click', openCheckout);
infoBtn.addEventListener('click', openSocialPopup);
socialPopupClose.addEventListener('click', closeSocialPopup);
socialPopup.addEventListener('click', (e) => { if (e.target === socialPopup) closeSocialPopup(); });

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const cityInput = document.getElementById('checkoutCity');
  const city = cityInput ? cityInput.value.trim() : '';
  const address = document.getElementById('checkoutAddress').value.trim();

  if (!name || !phone || !city || !address) {
    showToast('يرجى تعبئة جميع حقول الطلب');
    return;
  }

  const items = cart.map(item => `- ${item.name} ${item.variant ? '(رقم ' + item.variant + ')' : ''} × ${item.qty} = ${fmtPrice(item.price * item.qty)} درهم`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const payload = {
    name,
    phone,
    city,
    address,
    products: items,
    total: fmtPrice(total) + ' درهم'
  };

  try {
    const response = await fetch(googleSheetsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result && result.ok) {
      document.getElementById('formSubject').value = `طلب جديد من ${name}`;
      document.getElementById('formProducts').value = items;
      document.getElementById('formTotal').value = fmtPrice(total) + ' درهم';
      window.trackMetaEvent('Lead', {
        value: total,
        currency: 'MAD',
        content_ids: cart.map((item) => String(item.id)),
        content_type: 'product',
        contents: cart.map((item) => ({ id: String(item.id), quantity: item.qty }))
      });

      checkoutForm.submit();
      showToast('تم إرسال الطلب بنجاح');
      cart = [];
      saveCart();
      closeCheckoutModal();
      closeCartSidebar();
      checkoutForm.reset();
      document.getElementById('formProducts').value = '';
      document.getElementById('formTotal').value = '';
    } else {
      showToast('تعذر إرسال الطلب، حاول مرة أخرى');
    }
  } catch (error) {
    console.error('Order send failed:', error);
    showToast('تعذر إرسال الطلب، حاول مرة أخرى');
  }
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('تم استلام رسالتك وسنرد عليك قريباً');
  contactForm.reset();
});

window.addEventListener('click', (event) => {
  if (event.target === checkoutModal) closeCheckoutModal();
});

const bgVideo = document.querySelector('.video-bg');
if (bgVideo) {
  bgVideo.muted = true;
  bgVideo.defaultMuted = true;
  bgVideo.setAttribute('playsinline', '');
  const hideIfNotPlaying = () => {
    setTimeout(() => {
      if (bgVideo.paused) bgVideo.style.visibility = 'hidden';
    }, 400);
  };
  const tryPlay = () => {
    const p = bgVideo.play();
    if (p) p.catch(() => {});
    hideIfNotPlaying();
  };
  bgVideo.addEventListener('playing', () => { bgVideo.style.visibility = 'visible'; });
  bgVideo.addEventListener('loadeddata', tryPlay);
  bgVideo.addEventListener('canplay', tryPlay);
  window.addEventListener('load', tryPlay);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
  window.addEventListener('touchstart', tryPlay, { once: true });
  window.addEventListener('scroll', tryPlay, { once: true });
  tryPlay();
}

const waFloat = document.getElementById('waFloat');
if (waFloat) setTimeout(() => waFloat.classList.add('show'), 1200);

renderProducts();
saveCart();
