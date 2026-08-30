```javascript
const params = new URLSearchParams(window.location.search);

let productId = Number(params.get('id'));

if (!productId) {
  productId = Number(sessionStorage.getItem('hb_lastProduct'));
}

const product = products.find(p => p.id === productId);


/* =========================================================
   Google Apps Script
   ========================================================= */

const googleSheetsEndpoint =
  'https://script.google.com/macros/s/AKfycbzUaTN7AUNtE9W4fndhs2jHTvQg4gu9BiqgPduwXLoyrz3LErcdoIzG1BSmw9bhAiD5/exec';


/* =========================================================
   تنسيق الأسعار
   ========================================================= */

function fmtPrice(n) {
  try {
    return n.toLocaleString('ar');
  } catch (e) {
    return String(n);
  }
}


/* =========================================================
   إرسال الطلب إلى Google Sheets
   ========================================================= */

async function sendOrderToGoogleSheets(order) {

  try {

    await fetch(googleSheetsEndpoint, {

      method: 'POST',

      mode: 'no-cors',

      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },

      body: JSON.stringify(order)

    });

    console.log('✅ Google Sheets: order sent');

    return true;

  } catch (error) {

    console.error(
      '❌ Google Sheets error:',
      error
    );

    return false;
  }
}


/* =========================================================
   عناصر الصفحة
   ========================================================= */

const cartItems =
  document.getElementById('cartItems');

const cartCount =
  document.getElementById('cartCount');

const cartSubtotal =
  document.getElementById('cartSubtotal');

const cartTotal =
  document.getElementById('cartTotal');

const cartSidebar =
  document.getElementById('cartSidebar');

const cartOverlay =
  document.getElementById('cartOverlay');

const cartBtn =
  document.getElementById('cartBtn');

const closeCart =
  document.getElementById('closeCart');

const closeCartBtn =
  document.getElementById('closeCartBtn');

const toast =
  document.getElementById('toast');

const toastMsg =
  document.getElementById('toastMsg');

const checkoutModal =
  document.getElementById('checkoutModal');

const closeCheckout =
  document.getElementById('closeCheckout');

const checkoutBtn =
  document.getElementById('checkoutBtn');

const checkoutSummary =
  document.getElementById('checkoutSummary');

const checkoutForm =
  document.getElementById('checkoutForm');

const infoBtn =
  document.getElementById('infoBtn');

const socialPopup =
  document.getElementById('socialPopup');

const socialPopupClose =
  document.getElementById('socialPopupClose');


/* =========================================================
   Cart
   ========================================================= */

let cart =
  JSON.parse(localStorage.getItem('hb_cart')) || [];

let toastTimeout;

let selectedQty = 1;

let selectedVariantIndex = 0;


/* =========================================================
   Toast
   ========================================================= */

function showToast(message) {

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  toast.classList.add('show');

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {

    toast.classList.remove('show');

  }, 2800);
}


/* =========================================================
   Cart count
   ========================================================= */

function updateCartCount() {

  const count =
    cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

  cartCount.textContent = count;

  cartCount.style.display =
    count > 0 ? 'grid' : 'none';
}


/* =========================================================
   Render cart
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

    cartSubtotal.textContent =
      '0 درهم';

    cartTotal.textContent =
      '0 درهم';

    checkoutBtn.disabled = true;

    return;
  }


  checkoutBtn.disabled = false;


  cartItems.innerHTML =
    cart.map(item => `

      <div class="cart-item">

        <div class="cart-item-row">

          <div class="cart-item-image">
            <img
              src="${item.image}"
              alt="${item.name}"
            />
          </div>

          <div class="cart-item-info">

            <h4>${item.name}</h4>

            <p class="cart-item-variant">
              رقم ${item.variant}
            </p>

            <p class="cart-item-brand">
              ${item.brand}
            </p>

            <p class="cart-item-price">
              ${fmtPrice(item.price)} درهم
            </p>

          </div>

        </div>


        <div class="cart-item-actions">

          <div class="cart-item-qty">

            <button
              class="qty-down"
              data-id="${item.id}"
              data-variant="${item.variantIndex}"
            >
              −
            </button>

            <span>${item.qty}</span>

            <button
              class="qty-up"
              data-id="${item.id}"
              data-variant="${item.variantIndex}"
            >
              +
            </button>

          </div>


          <button
            class="cart-item-remove"
            data-id="${item.id}"
            data-variant="${item.variantIndex}"
          >
            <i class="fas fa-trash-alt"></i>
          </button>

        </div>

      </div>

    `).join('');


  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  cartSubtotal.textContent =
    `${fmtPrice(subtotal)} درهم`;

  cartTotal.textContent =
    `${fmtPrice(subtotal)} درهم`;
}


/* =========================================================
   Save cart
   ========================================================= */

function saveCart() {

  try {

    localStorage.setItem(
      'hb_cart',
      JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

  } catch (e) {

    console.error(
      'saveCart error',
      e
    );

  }
}


/* =========================================================
   Change quantity
   ========================================================= */

function changeQty(
  productId,
  variantIndex,
  delta
) {

  const existing =
    cart.find(
      item =>
        item.id === productId &&
        item.variantIndex === variantIndex
    );


  if (!existing) return;


  existing.qty += delta;


  if (existing.qty <= 0) {

    cart =
      cart.filter(
        item =>
          !(
            item.id === productId &&
            item.variantIndex === variantIndex
          )
      );

  }


  saveCart();
}


/* =========================================================
   Remove item
   ========================================================= */

function removeFromCart(
  productId,
  variantIndex
) {

  cart =
    cart.filter(
      item =>
        !(
          item.id === productId &&
          item.variantIndex === variantIndex
        )
    );


  saveCart();

  showToast(
    'تمت إزالة المنتج من السلة'
  );
}


/* =========================================================
   Open cart
   ========================================================= */

function openCart() {

  cartSidebar.classList.add('open');

  cartOverlay.classList.add('open');

  document.body.style.overflow = 'hidden';
}


/* =========================================================
   Close cart
   ========================================================= */

function closeCartSidebar() {

  cartSidebar.classList.remove('open');

  cartOverlay.classList.remove('open');

  document.body.style.overflow = '';
}


/* =========================================================
   Open checkout
   ========================================================= */

function openCheckout() {

  if (!cart.length) {

    showToast(
      'أضف منتجات إلى السلة أولاً'
    );

    return;
  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  checkoutSummary.innerHTML = `

    <h4>ملخص الطلب</h4>

    <ul>

      ${cart.map(item => `

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

      `).join('')}

    </ul>

    <div
      class="cart-total"
      style="margin-top:12px;"
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
}


/* =========================================================
   Close checkout
   ========================================================= */

function closeCheckoutModal() {

  checkoutModal.classList.remove('open');

  checkoutModal.setAttribute(
    'aria-hidden',
    'true'
  );
}


/* =========================================================
   Add product to cart
   ========================================================= */

function addToCartFromPage() {

  if (!product) return;


  const btn =
    document.getElementById(
      'addToCartBtn'
    );


  if (!btn) return;


  const variant =
    product.variants[selectedVariantIndex];


  const existing =
    cart.find(
      item =>
        item.id === product.id &&
        item.variantIndex === selectedVariantIndex
    );


  if (existing) {

    existing.qty += selectedQty;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      brand: product.brand,

      price: product.price,

      image: variant.image,

      variant: variant.index,

      variantIndex: selectedVariantIndex,

      qty: selectedQty

    });

  }


  saveCart();


  btn.classList.add('added');

  btn.innerHTML =
    '<i class="fas fa-check"></i> تمت الإضافة!';


  setTimeout(() => {

    btn.classList.remove('added');

    btn.innerHTML =
      '<i class="fas fa-shopping-bag"></i> إضافة للسلة';

  }, 2000);


  showToast(
    `تمت إضافة ${product.name} (رقم ${variant.index}) إلى السلة`
  );


  openCart();
}


/* =========================================================
   Cart buttons
   ========================================================= */

document.addEventListener(
  'click',
  e => {

    const up =
      e.target.closest('.qty-up');

    if (up) {

      changeQty(
        Number(up.dataset.id),
        Number(up.dataset.variant),
        1
      );

      return;
    }


    const down =
      e.target.closest('.qty-down');

    if (down) {

      changeQty(
        Number(down.dataset.id),
        Number(down.dataset.variant),
        -1
      );

      return;
    }


    const remove =
      e.target.closest(
        '.cart-item-remove'
      );

    if (remove) {

      removeFromCart(
        Number(remove.dataset.id),
        Number(remove.dataset.variant)
      );

    }

  }
);


cartBtn.addEventListener(
  'click',
  openCart
);

closeCart.addEventListener(
  'click',
  closeCartSidebar
);

closeCartBtn.addEventListener(
  'click',
  closeCartSidebar
);

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
  () => {
    socialPopup.classList.add('open');
  }
);

socialPopupClose.addEventListener(
  'click',
  () => {
    socialPopup.classList.remove('open');
  }
);

socialPopup.addEventListener(
  'click',
  e => {

    if (e.target === socialPopup) {

      socialPopup.classList.remove('open');

    }

  }
);


/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutForm.addEventListener(
  'submit',
  async e => {

    e.preventDefault();


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

      showToast(
        'سلة الطلب فارغة'
      );

      return;
    }


    if (!name || !phone || !address) {

      showToast(
        'يرجى تعبئة جميع الحقول المطلوبة'
      );

      return;
    }


    /* المنتجات */

    const items =
      cart
        .map(
          item =>
            `- ${item.name} ${
              item.variant
                ? '(رقم ' + item.variant + ')'
                : ''
            } × ${item.qty} = ${
              fmtPrice(
                item.price * item.qty
              )
            } درهم`
        )
        .join('\n');


    /* الإجمالي */

    const total =
      cart.reduce(
        (sum, item) =>
          sum + item.price * item.qty,
        0
      );


    const totalText =
      fmtPrice(total) +
      ' درهم';


    /* البيانات */

    const payload = {

      fullName: name,

      name: name,

      phone: phone,

      address: address,

      products: items,

      orderSummary: items,

      total: totalText,

      currency: 'MAD'

    };


    /* وضع البيانات داخل FormSubmit */

    document.getElementById(
      'formSubject'
    ).value =
      `طلب جديد من ${name}`;


    document.getElementById(
      'formProducts'
    ).value =
      items;


    document.getElementById(
      'formTotal'
    ).value =
      totalText;


    /* =====================================================
       إرسال إلى Google Sheets
       ===================================================== */

    const sheetsPromise =
      sendOrderToGoogleSheets(
        payload
      );


    /* =====================================================
       إرسال FormSubmit
       ===================================================== */

    try {

      window.trackMetaEvent(
        'Lead',
        {
          value: total,

          currency: 'MAD',

          content_ids:
            cart.map(
              item =>
                String(item.id)
            ),

          content_type: 'product',

          contents:
            cart.map(
              item => ({
                id: String(item.id),
                quantity: item.qty
              })
            )
        }
      );

    } catch (error) {

      console.warn(
        'Meta Pixel error:',
        error
      );

    }


    /*
      FormSubmit يبقى خدام
    */

    checkoutForm.submit();


    /*
      نعطي Google Sheets شوية وقت
      قبل تنظيف السلة
    */

    await sheetsPromise;


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
   Product not found
   ========================================================= */

if (!product) {

  document.getElementById(
    'productContent'
  ).innerHTML = `

    <div
      style="
        text-align:center;
        padding:100px 0;
        color:var(--text-muted);
      "
    >

      <i
        class="fas fa-exclamation-triangle"
        style="
          font-size:2rem;
          margin-bottom:12px;
          display:block;
        "
      ></i>

      <p>المنتج غير موجود</p>

      <p
        style="
          margin-top:8px;
          font-size:0.9rem;
        "
      >
        جارٍ تحويلك إلى صفحة المنتجات...
      </p>

      <a
        href="index.html#products"
        class="btn-primary"
        style="
          margin-top:16px;
          display:inline-flex;
        "
      >
        العودة للمنتجات
      </a>

    </div>

  `;


  setTimeout(
    () => {
      window.location.href =
        'index.html#products';
    },
    2500
  );


} else {

  try {

    /* Meta Pixel */

    window.trackMetaEvent(
      'ViewContent',
      {
        content_name: product.name,

        content_ids: [
          String(product.id)
        ],

        content_type: 'product',

        value: product.price,

        currency: 'MAD'
      }
    );


    document.title =
      `HB.negoce | ${product.name}`;


    const pageDescription =
      document.querySelector(
        'meta[name="description"]'
      );


    if (pageDescription) {

      pageDescription.setAttribute(
        'content',
        `${product.name} من ${product.brand} لدى HB.negoce. ${product.desc} اطلب الآن مع التوصيل إلى جميع مدن المغرب.`
      );

    }


    const allImages =
      product.images &&
      product.images.length
        ? product.images
        : [product.image];


    const variants =
      product.variants ||
      [
        {
          index: 0,
          name: '',
          image: allImages[0]
        }
      ];


    document.getElementById(
      'productContent'
    ).innerHTML = `

      <div class="pd-layout">

        <div class="pd-gallery">

          <div class="pd-main-image">

            <img
              id="mainImage"
              src="${variants[0].image}"
              alt="${product.name}"
            />

          </div>


          <div class="pd-thumbnails">

            ${allImages.map(
              (img, i) => `

                <div
                  class="pd-thumb ${
                    i === 0
                      ? 'active'
                      : ''
                  }"
                  data-index="${i}"
                >

                  <img
                    src="${img}"
                    alt="${product.name}"
                  />

                </div>

              `
            ).join('')}

          </div>

        </div>


        <div class="pd-details">

          <span class="pd-brand">
            ${product.brand}
          </span>

          <h1 class="pd-name">
            ${product.name}
          </h1>

          <p class="pd-desc">
            ${product.desc}
          </p>

          <div class="pd-price">

            ${
              product.oldPrice
                ? `
                  <span class="pd-old-price">
                    ${fmtPrice(product.oldPrice)}
                    درهم
                  </span>
                `
                : ''
            }

            ${fmtPrice(product.price)}
            درهم

          </div>


          <div class="pd-stock">

            <i class="fas fa-check-circle"></i>

            متوفر في المخزون

          </div>


          <div class="pd-specs">

            ${product.specs.map(
              s =>

                s ===
                'الاعلى جودة...بلامنازع.'

                  ? `
                    <div
                      class="pd-spec pd-spec-quality"
                    >

                      <i class="fas fa-star"></i>

                      ${s}

                    </div>
                  `

                  : `
                    <div class="pd-spec">

                      <i class="fas fa-check"></i>

                      ${s}

                    </div>
                  `
            ).join('')}

          </div>


          <div
            class="pd-variants"
            id="pdVariants"
          >

            <div class="pd-variants-grid">

              ${variants.map(
                (v, i) => `

                  <button
                    class="pd-variant ${
                      i === 0
                        ? 'active'
                        : ''
                    }"
                    data-index="${i}"
                    title="${
                      v.name ||
                      'الخيار ' + (i + 1)
                    }"
                  >

                    <img
                      class="pd-variant-img"
                      src="${v.image}"
                      alt="${v.name || ''}"
                    />

                  </button>

                `
              ).join('')}

            </div>

          </div>


          <div class="pd-qty-section">

            <span class="pd-qty-label">
              الكمية
            </span>

            <div class="pd-qty-selector">

              <button
                class="pd-qty-btn"
                id="qtyMinus"
              >
                −
              </button>

              <span
                class="pd-qty-value"
                id="qtyValue"
              >
                1
              </span>

              <button
                class="pd-qty-btn"
                id="qtyPlus"
              >
                +
              </button>

            </div>

          </div>


          <div class="pd-actions">

            <button
              class="btn-primary pd-add-btn"
              id="addToCartBtn"
            >

              <i class="fas fa-shopping-bag"></i>

              إضافة للسلة

            </button>

          </div>


          <div class="pd-guarantees">

            <div>

              <i class="fas fa-truck"></i>

              الشحن في اقل من 48 ساعة

            </div>

            <div>

              <i class="fas fa-shield-alt"></i>

              جودة ممتازة

            </div>

          </div>

        </div>

      </div>

    `;


    /* =====================================================
       Product controls
       ===================================================== */

    const mainImage =
      document.getElementById(
        'mainImage'
      );


    const thumbs =
      document.querySelectorAll(
        '.pd-thumb'
      );


    const variantBtns =
      document.querySelectorAll(
        '.pd-variant'
      );


    const qtyMinus =
      document.getElementById(
        'qtyMinus'
      );


    const qtyPlus =
      document.getElementById(
        'qtyPlus'
      );


    const qtyValue =
      document.getElementById(
        'qtyValue'
      );


    const addToCartBtn =
      document.getElementById(
        'addToCartBtn'
      );


    /* Variant */

    variantBtns.forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            variantBtns.forEach(
              b =>
                b.classList.remove(
                  'active'
                )
            );


            btn.classList.add(
              'active'
            );


            selectedVariantIndex =
              Number(
                btn.dataset.index
              );


            const variant =
              variants[
                selectedVariantIndex
              ];


            mainImage.src =
              variant.image;


            thumbs.forEach(
              (t, i) =>
                t.classList.toggle(
                  'active',
                  i === selectedVariantIndex
                )
            );

          }
        );

      }
    );


    /* Thumbnail */

    thumbs.forEach(
      thumb => {

        thumb.addEventListener(
          'click',
          () => {

            thumbs.forEach(
              t =>
                t.classList.remove(
                  'active'
                )
            );


            thumb.classList.add(
              'active'
            );


            const idx =
              Number(
                thumb.dataset.index
              );


            mainImage.src =
              allImages[idx];


            const variantIdx =
              variants.findIndex(
                v =>
                  v.image ===
                  allImages[idx]
              );


            if (variantIdx >= 0) {

              variantBtns.forEach(
                b =>
                  b.classList.remove(
                    'active'
                  )
              );


              variantBtns[
                variantIdx
              ].classList.add(
                'active'
              );


              selectedVariantIndex =
                variantIdx;

            }

          }
        );

      }
    );


    /* Quantity */

    qtyMinus.addEventListener(
      'click',
      () => {

        if (selectedQty > 1) {

          selectedQty--;

          qtyValue.textContent =
            selectedQty;

        }

      }
    );


    qtyPlus.addEventListener(
      'click',
      () => {

        if (selectedQty < 99) {

          selectedQty++;

          qtyValue.textContent =
            selectedQty;

        }

      }
    );


    /* Add to cart */

    addToCartBtn.addEventListener(
      'click',
      addToCartFromPage
    );


    /* =====================================================
       JSON-LD
       ===================================================== */

    try {

      const productJson = {

        "@context":
          "https://schema.org",

        "@type":
          "Product",

        name:
          product.name,

        image:
          allImages,

        description:
          (product.desc || '')
            .slice(0, 300),

        sku:
          product.sku ||
          String(product.id),

        brand: {

          "@type":
            "Brand",

          name:
            product.brand

        },

        offers: {

          "@type":
            "Offer",

          url:
            window.location.href,

          priceCurrency:
            "MAD",

          price:
            product.price !== undefined
              ? String(product.price)
              : "0",

          availability:
            product.inStock === false
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",

          itemCondition:
            "https://schema.org/NewCondition"

        }

      };


      const s =
        document.createElement(
          'script'
        );


      s.type =
        'application/ld+json';


      s.textContent =
        JSON.stringify(
          productJson
        );


      document.head.appendChild(s);

    } catch (e) {

      console.error(
        'JSON-LD error:',
        e
      );

    }


  } catch (e) {

    console.error(
      'Product loading error:',
      e
    );


    document.getElementById(
      'productContent'
    ).innerHTML = `

      <div
        style="
          text-align:center;
          padding:60px 0;
          color:var(--text-muted);
        "
      >

        <i
          class="fas fa-exclamation-triangle"
          style="
            font-size:2rem;
            margin-bottom:12px;
            display:block;
          "
        ></i>

        <p>
          تعذر تحميل المنتج
        </p>

        <a
          href="index.html#products"
          class="btn-primary"
          style="
            margin-top:16px;
            display:inline-flex;
          "
        >
          العودة للمنتجات
        </a>

      </div>

    `;

  }

}


/* =========================================================
   Background video
   ========================================================= */

const bgVideo =
  document.querySelector(
    '.video-bg'
  );


if (bgVideo) {

  bgVideo.muted = true;

  bgVideo.defaultMuted = true;

  bgVideo.setAttribute(
    'playsinline',
    ''
  );


  const hideIfNotPlaying =
    () => {

      setTimeout(
        () => {

          if (bgVideo.paused) {

            bgVideo.style.visibility =
              'hidden';

          }

        },
        400
      );

    };


  const tryPlay =
    () => {

      const p =
        bgVideo.play();

      if (p) {

        p.catch(
          () => {}
        );

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
   WhatsApp floating button
   ========================================================= */

const waFloat =
  document.getElementById(
    'waFloat'
  );


if (waFloat) {

  setTimeout(
    () =>
      waFloat.classList.add(
        'show'
      ),
    1200
  );

}


/* =========================================================
   Initialize cart
   ========================================================= */

saveCart();
```

