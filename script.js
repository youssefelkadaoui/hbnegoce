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
let activeproductId = null;
let toastTimeout;

function fmtPrice(n) {
  try {
    return n.toLocaleString('ar');
  } catch (e) {
    return String(n);
  }
}

/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

const googleSheetsEndpoint =
  'https://script.google.com/macros/s/AKfycbwmoTV2oyEIPbs1vmjB6HqUvIANmTYo5n17Ujh8TMDtCbQWDKvTnDraXEgc6C0lhLLm/exec';

function sendOrderToGoogleSheets(order) {
  const formData = new URLSearchParams();

  formData.append('fullname', order.fullName || '');
  formData.append('phone', order.phone || '');
  formData.append('address', order.address || '');
  formData.append('products', order.orderSummary || '');
  formData.append('total', order.total || '');
  formData.append('currency', 'MAD');

  return fetch(googleSheetsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formData.toString()
  });
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* =========================================================
   PRODUCTS
   ========================================================= */

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesType =
      activeFilter === 'all' || product.type === activeFilter;

    const query = activeQuery.trim().toLowerCase();

    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();

  productsGrid.innerHTML = '';

  if (!filtered.length) {
    productsGrid.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-search"></i>
        <p>لا توجد نتائج مطابقة</p>
      </div>
    `;
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

        <div class="product-brand">
          ${product.brand}
        </div>

        <h3 class="product-title">
          ${product.name}
        </h3>

        <p class="product-desc">
          ${product.desc}
        </p>

        <div class="product-footer">

          <div class="product-prices">

            ${
              product.oldPrice
                ? `<span class="product-old-price">
                    ${fmtPrice(product.oldPrice)} درهم
                  </span>`
                : ''
            }

            <span class="product-price">
              ${fmtPrice(product.price)} درهم
            </span>

          </div>

        </div>

      </div>
    `;

    card.addEventListener('click', () => {
      sessionStorage.setItem(
        'hb_lastProduct',
        String(product.id)
      );

      window.location.href = card.dataset.href;
    });

    productsGrid.appendChild(card);

    card.classList.add('anim-in');

    requestAnimationFrame(() => {
      card.classList.add('show');
    });
  });
}

/* =========================================================
   FILTERS
   ========================================================= */

document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => {

    const activeButton =
      document.querySelector('.filter-btn.active');

    if (activeButton) {
      activeButton.classList.remove('active');
    }

    button.classList.add('active');

    activeFilter = button.dataset.filter;

    renderProducts();
  });
});

/* =========================================================
   SEARCH
   ========================================================= */

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    activeQuery = event.target.value;
    renderProducts();
  });
}

/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  cartCount.textContent = count;

  cartCount.style.display =
    count > 0 ? 'grid' : 'none';
}

/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>سلتك فارغة حالياً</p>
        <span class="cart-empty-sub">
          أضف منتجات للبدء في التسوق
        </span>
      </div>
    `;

    cartSubtotal.textContent = '0 درهم';
    cartTotal.textContent = '0 درهم';

    checkoutBtn.disabled = true;

    return;
  }

  checkoutBtn.disabled = false;

  cartItems.innerHTML = cart
    .map(
      (item, idx) => `
        <div class="cart-item">

          <div class="cart-item-row">

            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}" />
            </div>

            <div class="cart-item-info">

              <h4>${item.name}</h4>

              ${
                item.variant
                  ? `<p class="cart-item-variant">
                      رقم ${item.variant}
                    </p>`
                  : ''
              }

              <p class="cart-item-brand">
                ${item.brand}
              </p>

              <p class="cart-item-price">
                ${fmtPrice(item.price * item.qty)} درهم
              </p>

            </div>

          </div>

          <div class="cart-item-actions">

            <div class="cart-item-qty">

              <button
                class="qty-down"
                data-id="${item.id}"
                data-variant="${
                  item.variantIndex !== undefined
                    ? item.variantIndex
                    : ''
                }"
              >
                −
              </button>

              <span>${item.qty}</span>

              <button
                class="qty-up"
                data-id="${item.id}"
                data-variant="${
                  item.variantIndex !== undefined
                    ? item.variantIndex
                    : ''
                }"
              >
                +
              </button>

            </div>

            <button
              class="cart-item-remove"
              data-id="${item.id}"
              data-variant="${
                item.variantIndex !== undefined
                  ? item.variantIndex
                  : ''
              }"
              aria-label="إزالة"
            >
              <i class="fas fa-trash-alt"></i>
            </button>

          </div>

        </div>
      `
    )
    .join('');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  cartSubtotal.textContent =
    `${fmtPrice(subtotal)} درهم`;

  cartTotal.textContent =
    `${fmtPrice(subtotal)} درهم`;
}

/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

  localStorage.setItem(
    'hb_cart',
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();
}

/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQty(productId, variantIndex, delta) {

  const existing = cart.find(
    (item) =>
      item.id === productId &&
      (item.variantIndex ?? '') ===
        (variantIndex ?? '')
  );

  if (!existing) return;

  existing.qty += delta;

  if (existing.qty <= 0) {

    cart = cart.filter(
      (item) =>
        !(
          item.id === productId &&
          (item.variantIndex ?? '') ===
            (variantIndex ?? '')
        )
    );
  }

  saveCart();
}

/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId, variantIndex) {

  cart = cart.filter(
    (item) =>
      !(
        item.id === productId &&
        (item.variantIndex ?? '') ===
          (variantIndex ?? '')
      )
  );

  saveCart();

  showToast('تمت إزالة المنتج من السلة');
}

/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

  cartSidebar.classList.add('open');

  cartOverlay.classList.add('open');

  document.body.style.overflow = 'hidden';
}

/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCartSidebar() {

  cartSidebar.classList.remove('open');

  cartOverlay.classList.remove('open');

  document.body.style.overflow = '';
}

/* =========================================================
   OPEN CHECKOUT
   ========================================================= */

function openCheckout() {

  if (!cart.length) {

    showToast('أضف منتجات إلى السلة أولاً');

    return;
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  checkoutSummary.innerHTML = `
    <h4>ملخص الطلب</h4>

    <ul>

      ${cart
        .map(
          (item) => `
            <li>

              <span>
                ${item.name}
                ${
                  item.variant
                    ? '(رقم ' + item.variant + ')'
                    : ''
                }
                × ${item.qty}
              </span>

              <span>
                ${fmtPrice(item.price * item.qty)}
                درهم
              </span>

            </li>
          `
        )
        .join('')}

    </ul>

    <div
      class="cart-total"
      style="margin-top: 12px;"
    >

      <span>الإجمالي</span>

      <span>
        ${fmtPrice(total)} درهم
      </span>

    </div>
  `;

  checkoutModal.classList.add('open');

  checkoutModal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.style.overflow = 'hidden';
}

/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

function closeCheckoutModal() {

  checkoutModal.classList.remove('open');

  checkoutModal.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.style.overflow = '';
}

/* =========================================================
   SOCIAL POPUP
   ========================================================= */

function openSocialPopup() {
  socialPopup.classList.add('open');
}

function closeSocialPopup() {
  socialPopup.classList.remove('open');
}

/* =========================================================
   PRODUCTS GRID CLICK
   ========================================================= */

productsGrid.addEventListener(
  'click',
  (event) => {

    const card =
      event.target.closest('.product-card');

    if (card && card.dataset.href) {

      window.location.href =
        card.dataset.href;
    }
  }
);

/* =========================================================
   CART BUTTONS
   ========================================================= */

cartItems.addEventListener(
  'click',
  (event) => {

    const up =
      event.target.closest('.qty-up');

    if (up) {

      changeQty(
        Number(up.dataset.id),
        up.dataset.variant !== ''
          ? Number(up.dataset.variant)
          : undefined,
        1
      );

      return;
    }

    const down =
      event.target.closest('.qty-down');

    if (down) {

      changeQty(
        Number(down.dataset.id),
        down.dataset.variant !== ''
          ? Number(down.dataset.variant)
          : undefined,
        -1
      );

      return;
    }

    const remove =
      event.target.closest('.cart-item-remove');

    if (remove) {

      removeFromCart(
        Number(remove.dataset.id),
        remove.dataset.variant !== ''
          ? Number(remove.dataset.variant)
          : undefined
      );
    }
  }
);

/* =========================================================
   BUTTONS
   ========================================================= */

const closeCartBtn =
  document.getElementById('closeCartBtn');

cartBtn.addEventListener(
  'click',
  openCart
);

closeCart.addEventListener(
  'click',
  closeCartSidebar
);

if (closeCartBtn) {
  closeCartBtn.addEventListener(
    'click',
    closeCartSidebar
  );
}

cartOverlay.addEventListener(
  'click',
  closeCartSidebar
);

closeCheckout.addEventListener(
  'click',
  closeCheckoutModal
);

checkoutBtn.addEventListener(
  'click',
  openCheckout
);

infoBtn.addEventListener(
  'click',
  openSocialPopup
);

socialPopupClose.addEventListener(
  'click',
  closeSocialPopup
);

socialPopup.addEventListener(
  'click',
  (e) => {

    if (e.target === socialPopup) {
      closeSocialPopup();
    }

  }
);

/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();

    const name =
      document
        .getElementById('checkoutName')
        .value
        .trim();

    const phone =
      document
        .getElementById('checkoutPhone')
        .value
        .trim();

    const address =
      document
        .getElementById('checkoutAddress')
        .value
        .trim();

    if (!cart.length) {

      showToast('سلة الطلب فارغة');

      return;
    }

    if (!name || !phone || !address) {

      showToast(
        'يرجى تعبئة جميع الحقول المطلوبة'
      );

      return;
    }

    const items = cart
      .map(
        (item) =>
          `- ${item.name} ${
            item.variant
              ? '(رقم ' + item.variant + ')'
              : ''
          } × ${item.qty} = ${fmtPrice(
            item.price * item.qty
          )} درهم`
      )
      .join('\n');

    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );

    const totalText =
      fmtPrice(total) + ' درهم';

    const payload = {

      fullName: name,

      phone: phone,

      address: address,

      orderSummary:
        `${items}\nالإجمالي: ${totalText}`,

      total: totalText
    };

    document.getElementById(
      'formSubject'
    ).value =
      `طلب جديد من ${name}`;

    document.getElementById(
      'formProducts'
    ).value = items;

    document.getElementById(
      'formTotal'
    ).value = totalText;

    try {

      showToast(
        'جاري إرسال الطلب...'
      );

      const response =
        await sendOrderToGoogleSheets(
          payload
        );

      if (!response.ok) {
        throw new Error(
          'تعذر الاتصال بخدمة الطلبات'
        );
      }

    } catch (error) {

      console.warn(
        'فشل إرسال الطلب إلى Google Sheets:',
        error
      );

      showToast(
        'حدث خطأ أثناء إرسال الطلب'
      );

      return;
    }

    /* =====================================================
       META PIXEL
       ===================================================== */

    if (
      window.trackMetaEvent &&
      typeof window.trackMetaEvent === 'function'
    ) {

      window.trackMetaEvent(
        'Lead',
        {
          value: total,

          currency: 'MAD',

          content_ids:
            cart.map(
              (item) =>
                String(item.id)
            ),

          content_type: 'product',

          contents:
            cart.map(
              (item) => ({
                id: String(item.id),
                quantity: item.qty
              })
            )
        }
      );
    }

    /* =====================================================
       SUCCESS
       ===================================================== */

    showToast(
      'تم إرسال الطلب بنجاح ✅'
    );

    cart = [];

    saveCart();

    closeCheckoutModal();

    closeCartSidebar();

    checkoutForm.reset();

    document.getElementById(
      'formProducts'
    ).value = '';

    document.getElementById(
      'formTotal'
    ).value = '';
  }
);

/* =========================================================
   CONTACT FORM
   ========================================================= */

contactForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();

    const formData =
      new FormData(contactForm);

    const name =
      (formData.get('name') || '')
        .toString()
        .trim();

    const email =
      (formData.get('email') || '')
        .toString()
        .trim();

    const message =
      (formData.get('message') || '')
        .toString()
        .trim();

    if (!name || !email || !message) {

      showToast(
        'يرجى تعبئة جميع حقول الرسالة'
      );

      return;
    }

    const payload = {

      source: 'contact_form',

      name,

      email,

      message
    };

    try {

      await fetch(
        googleSheetsEndpoint,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload)
        }
      ).catch(() => {});

    } catch (error) {

      console.warn(
        'Contact form submit failed:',
        error
      );
    }

    showToast(
      'تم استلام رسالتك وسنرد عليك قريباً'
    );

    contactForm.reset();
  }
);

/* =========================================================
   CLOSE CHECKOUT WHEN CLICK OUTSIDE
   ========================================================= */

window.addEventListener(
  'click',
  (event) => {

    if (event.target === checkoutModal) {
      closeCheckoutModal();
    }
  }
);

/* =========================================================
   BACKGROUND VIDEO
   ========================================================= */

const bgVideo =
  document.querySelector('.video-bg');

if (bgVideo) {

  bgVideo.muted = true;

  bgVideo.defaultMuted = true;

  bgVideo.setAttribute(
    'playsinline',
    ''
  );

  const hideIfNotPlaying = () => {

    setTimeout(() => {

      if (bgVideo.paused) {
        bgVideo.style.visibility =
          'hidden';
      }

    }, 400);
  };

  const tryPlay = () => {

    const p =
      bgVideo.play();

    if (p) {
      p.catch(() => {});
    }

    hideIfNotPlaying();
  };

  bgVideo.addEventListener(
    'playing',
    () => {
      bgVideo.style.visibility =
        'visible';
    }
  );

  bgVideo.addEventListener(
    'loadeddata',
    tryPlay
  );

  bgVideo.addEventListener(
    'canplay',
    tryPlay
  );

  window.addEventListener(
    'load',
    tryPlay
  );

  document.addEventListener(
    'visibilitychange',
    () => {

      if (!document.hidden) {
        tryPlay();
      }

    }
  );

  window.addEventListener(
    'touchstart',
    tryPlay,
    { once: true }
  );

  window.addEventListener(
    'scroll',
    tryPlay,
    { once: true }
  );

  tryPlay();
}

/* =========================================================
   WHATSAPP FLOAT
   ========================================================= */

const waFloat =
  document.getElementById('waFloat');

if (waFloat) {

  setTimeout(
    () => waFloat.classList.add('show'),
    1200
  );
}

/* =========================================================
   INITIALIZE
   ========================================================= */

renderProducts();

saveCart();
