checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();

  if (!cart.length) {
    showToast('سلة الطلب فارغة');
    return;
  }

  if (!name || !phone || !address) {
    showToast('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  // تجهيز المنتجات
  const items = cart.map(item =>
    `- ${item.name} ${item.variant ? '(رقم ' + item.variant + ')' : ''} × ${item.qty} = ${fmtPrice(item.price * item.qty)} درهم`
  ).join('\n');

  // حساب المجموع
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalText = fmtPrice(total) + ' درهم';

  // ==========================================
  // 1. إرسال الطلب إلى GOOGLE SHEETS
  // ==========================================

  const googleForm = document.createElement('form');

  googleForm.method = 'POST';
  googleForm.action = googleSheetsEndpoint;
  googleForm.target = 'googleSheetsSubmitFrame';
  googleForm.style.display = 'none';

  const googleData = {
    name: name,
    phone: phone,
    address: address,
    products: items,
    total: totalText,
    currency: 'MAD'
  };

  Object.entries(googleData).forEach(([key, value]) => {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = key;
    input.value = value;

    googleForm.appendChild(input);
  });

  document.body.appendChild(googleForm);

  // إرسال إلى Google Sheets
  googleForm.submit();

  // حذف الفورم بعد الإرسال
  setTimeout(() => {
    googleForm.remove();
  }, 2000);


  // ==========================================
  // 2. تجهيز FORMSUBMIT
  // ==========================================

  document.getElementById('formSubject').value =
    `طلب جديد من ${name}`;

  document.getElementById('formProducts').value = items;

  document.getElementById('formTotal').value = totalText;


  // ==========================================
  // 3. Meta Pixel
  // ==========================================

  if (typeof window.trackMetaEvent === 'function') {
    window.trackMetaEvent('Lead', {
      value: total,
      currency: 'MAD',
      content_ids: cart.map(item => String(item.id)),
      content_type: 'product',
      contents: cart.map(item => ({
        id: String(item.id),
        quantity: item.qty
      }))
    });
  }


  // ==========================================
  // 4. إرسال الطلب إلى FORMSUBMIT
  // ==========================================

  checkoutForm.submit();


  // ==========================================
  // 5. تنظيف السلة
  // ==========================================

  showToast('تم إرسال الطلب بنجاح ✅');

  cart = [];

  saveCart();

  closeCheckoutModal();

  closeCartSidebar();

  checkoutForm.reset();

  document.getElementById('formProducts').value = '';
  document.getElementById('formTotal').value = '';
});
