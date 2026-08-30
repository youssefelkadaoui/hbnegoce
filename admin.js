import { auth, database, storage } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { onValue, ref, remove, set } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

const $ = (id) => document.getElementById(id);
const authView = $('authView'), dashboardView = $('dashboardView'), productForm = $('productForm');
let products = [];

function message(text = '', error = false) { const el = $('adminMessage'); el.textContent = text; el.classList.toggle('error', error); }
function authMessage(text = '', success = false) { const el = $('authMessage'); el.textContent = text; el.classList.toggle('success', success); }
function escapeHtml(value = '') { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
function displayProducts() {
  $('productsCount').textContent = `${products.length} منتج`;
  const list = $('productsList');
  if (!products.length) { list.innerHTML = '<div class="empty">لا توجد منتجات في Firebase بعد. يمكنك إضافة منتج أو استيراد المنتجات الحالية.</div>'; return; }
  list.innerHTML = products.map((product) => `<article class="admin-product"><img src="${escapeHtml(product.image || '')}" alt="" /><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.brand)} · ${escapeHtml(String(product.price))} درهم</p></div><div class="item-actions"><button class="icon-btn" data-edit="${escapeHtml(String(product.id))}" title="تعديل"><i class="fas fa-pen"></i></button><button class="icon-btn delete" data-delete="${escapeHtml(String(product.id))}" title="حذف"><i class="fas fa-trash"></i></button></div></article>`).join('');
}
function clearForm() { productForm.reset(); $('productId').value = ''; $('currentImages').innerHTML = ''; $('formTitle').textContent = 'إضافة منتج'; $('cancelEditBtn').classList.add('hidden'); }
function startEdit(id) { const p = products.find((item) => String(item.id) === String(id)); if (!p) return; $('productId').value = p.id; $('name').value = p.name || ''; $('brand').value = p.brand || ''; $('type').value = p.type || 'كلاسيك'; $('price').value = p.price ?? ''; $('oldPrice').value = p.oldPrice ?? ''; $('desc').value = p.desc || ''; $('specs').value = (p.specs || []).join('\n'); $('currentImages').innerHTML = (p.images || [p.image]).filter(Boolean).map((url) => `<img src="${escapeHtml(url)}" alt="صورة المنتج" />`).join(''); $('formTitle').textContent = 'تعديل المنتج'; $('cancelEditBtn').classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
async function uploadImages(files, id) { const urls = []; for (const file of files) { const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-'); const target = storageRef(storage, `products/${id}/${Date.now()}-${safeName}`); await uploadBytes(target, file); urls.push(await getDownloadURL(target)); } return urls; }

$('loginForm').addEventListener('submit', async (event) => { event.preventDefault(); authMessage(); try { await signInWithEmailAndPassword(auth, $('loginEmail').value.trim(), $('loginPassword').value); } catch (error) { authMessage('تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور ومن تفعيل Email/Password في Firebase.'); } });
$('logoutBtn').addEventListener('click', () => signOut(auth));
$('cancelEditBtn').addEventListener('click', clearForm);
productForm.addEventListener('submit', async (event) => {
  event.preventDefault(); const saveBtn = $('saveBtn'); const id = $('productId').value || String(Date.now()); const existing = products.find((p) => String(p.id) === id); const files = [...$('images').files];
  saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الحفظ…'; message();
  try {
    const uploaded = files.length ? await uploadImages(files, id) : [];
    const images = uploaded.length ? uploaded : (existing?.images || (existing?.image ? [existing.image] : []));
    if (!images.length) throw new Error('image-required');
    const product = { id: Number(id) || id, name: $('name').value.trim(), brand: $('brand').value.trim(), type: $('type').value, price: Number($('price').value), oldPrice: $('oldPrice').value ? Number($('oldPrice').value) : null, desc: $('desc').value.trim(), specs: $('specs').value.split('\n').map((v) => v.trim()).filter(Boolean), image: images[0], hoverImage: images[1] || images[0], images, variants: images.map((image, index) => ({ index: index + 1, image })), updatedAt: Date.now() };
    await set(ref(database, `products/${id}`), product); clearForm(); message('تم حفظ المنتج وسيظهر في المتجر تلقائيًا.');
  } catch (error) { console.error(error); message(error.message === 'image-required' ? 'أضف صورة واحدة على الأقل للمنتج.' : 'تعذر الحفظ. تحقق من قواعد Firebase Storage وRealtime Database.', true); } finally { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> حفظ المنتج'; }
});
$('productsList').addEventListener('click', async (event) => { const edit = event.target.closest('[data-edit]'); if (edit) return startEdit(edit.dataset.edit); const del = event.target.closest('[data-delete]'); if (!del || !confirm('هل تريد حذف هذا المنتج؟')) return; try { await remove(ref(database, `products/${del.dataset.delete}`)); message('تم حذف المنتج.'); } catch { message('تعذر الحذف. تحقق من قواعد قاعدة البيانات.', true); } });
$('importDefaultsBtn').addEventListener('click', async () => { const defaults = window.hbProducts || []; if (!defaults.length || !confirm(`سيتم نشر ${defaults.length} منتجات حالية في Firebase. متابعة؟`)) return; try { await Promise.all(defaults.map((p) => set(ref(database, `products/${p.id}`), { ...p, updatedAt: Date.now() }))); message('تم استيراد المنتجات الحالية بنجاح.'); } catch { message('تعذر الاستيراد. تحقق من قواعد قاعدة البيانات.', true); } });
onAuthStateChanged(auth, (user) => { authView.classList.toggle('hidden', Boolean(user)); dashboardView.classList.toggle('hidden', !user); if (!user) { products = []; displayProducts(); return; } onValue(ref(database, 'products'), (snapshot) => { products = Object.values(snapshot.val() || {}); displayProducts(); }, () => message('تعذر قراءة المنتجات. تحقق من قواعد Realtime Database.', true)); });
