(function () {
  const details = document.getElementById('orderDetails');
  const pendingOrderId = localStorage.getItem('hb_pending_purchase');
  let order;

  try {
    order = JSON.parse(localStorage.getItem('hb_last_order') || 'null');
  } catch (error) {
    order = null;
  }

  const isConfirmedOrder = Boolean(order && pendingOrderId && order.orderId === pendingOrderId);
  const formatPrice = (value) => Number(value || 0).toLocaleString('ar-MA');
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

  if (!isConfirmedOrder) {
    details.innerHTML = '<p class="order-note">لا توجد تفاصيل طلب حديثة لعرضها. يمكنك العودة إلى المتجر لإتمام طلبك.</p>';
    return;
  }

  const products = order.items.map((item) => `
    <li>
      <span>${escapeHtml(item.name)}${item.variant ? ` <small>(رقم ${escapeHtml(item.variant)})</small>` : ''} × ${Number(item.qty || 1)}</span>
      <strong>${formatPrice(Number(item.price) * Number(item.qty || 1))} د.م</strong>
    </li>`).join('');

  details.innerHTML = `
    <div class="order-reference"><span>رقم الطلب</span><strong>${escapeHtml(order.orderId)}</strong></div>
    <div class="order-section"><h2>ملخص المنتجات</h2><ul>${products}</ul></div>
    <div class="order-total"><span>الإجمالي</span><strong>${formatPrice(order.total)} د.م</strong></div>
    <div class="customer-details"><span>الاسم: ${escapeHtml(order.customer.name)}</span><span>العنوان: ${escapeHtml(order.customer.address)}</span></div>`;

  localStorage.removeItem('hb_pending_purchase');
}());
