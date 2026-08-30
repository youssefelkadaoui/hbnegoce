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
function withTimeout(promise, action, timeout = 25000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('request-timeout'), { action })), timeout))
  ]);
}
function saveErrorMessage(error) {
  const code = error?.code || '';
  if (error?.message === 'image-required') return 'أضف صورة واحدة على الأقل للمنتج.';
  if (error?.message === 'request-timeout') return `انتهت مهلة ${error.action === 'upload' ? 'رفع الصورة' : 'حفظ المنتج'}. تأكد من اتصال الإنترنت ومن إنشاء خدمة Firebase المطلوبة.`;
  if (code === 'storage/unauthorized') return 'ليس لديك صلاحية رفع الصور. انشر قواعد Firebase Storage التي تسمح بالكتابة للمستخدم المسجل.';
  if (code === 'storage/bucket-not-found') return 'Firebase Storage غير مفعّل أو اسم Storage Bucket غير صحيح في إعداد Firebase.';
  if (code === 'storage/project-not-found') return 'لم يتم العثور على مشروع Firebase Storage. فعّله من Firebase Console.';
  if (code === 'permission_denied' || code === 'database/permission-denied') return 'ليس لديك صلاحية حفظ المنتج. انشر قواعد Realtime Database التي تسمح بالكتابة للمستخدم المسجل.';
  return `تعذر الحفظ${code ? ` (${code})` : ''}. افتح Console في المتصفح لمراجعة الخطأ أو تحقق من قواعد Firebase.`;
}
function loginErrorMessage(error) {
  const code = error?.code || '';
  if (error?.message === 'request-timeout') return 'انتهت مهلة تسجيل الدخول. تحقق من اتصال الإنترنت أو من عدم حجب Firebase.';
  if (code === 'auth/unauthorized-domain') return 'نطاق الموقع غير مسموح في Firebase. أضف نطاق GitHub Pages في Authentication → Settings → Authorized domains.';
  if (code === 'auth/operation-not-allowed') return 'فعّل Email/Password من Firebase Authentication → Sign-in method.';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'البريد الإلكتروني أو كلمة المرور غير صحيحين.';
  if (code === 'auth/too-many-requests') return 'تم إيقاف المحاولات مؤقتًا بسبب كثرتها. انتظر قليلًا ثم جرّب مرة أخرى.';
  if (code === 'auth/network-request-failed') return 'تعذر الوصول إلى Firebase عبر الشبكة. تأكد من اتصال الإنترنت ومن فتح رابط GitHub Pages، وليس رابط ملفات GitHub.';
  return `تعذر تسجيل الدخول${code ? ` (${code})` : ''}.`;
}
function displayProducts() {
  $('productsCount').textContent = `${products.length} منتج`;
  const list = $('productsList');
  if (!products.length) { list.innerHTML = '<div class="empty">لا توجد منتجات في Firebase بعد. يمكنك إضافة منتج أو استيراد المنتجات الحالية.</div>'; return; }
  list.innerHTML = products.map((product) => `<article class="admin-product"><img src="${escapeHtml(product.image || '')}" alt="" /><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.brand)} · ${escapeHtml(String(product.price))} درهم</p></div><div class="item-actions"><button class="icon-btn" data-edit="${escapeHtml(String(product.id))}" title="تعديل"><i class="fas fa-pen"></i></button><button class="icon-btn delete" data-delete="${escapeHtml(String(product.id))}" title="حذف"><i class="fas fa-trash"></i></button></div></article>`).join('');
}
function clearForm() { productForm.reset(); $('productId').value = ''; $('currentImages').innerHTML = ''; $('formTitle').textContent = 'إضافة منتج'; $('cancelEditBtn').classList.add('hidden'); }
function startEdit(id) { const p = products.find((item) => String(item.id) === String(id)); if (!p) return; $('productId').value = p.id; $('name').value = p.name || ''; $('brand').value = p.brand || ''; $('type').value = p.type || 'كلاسيك'; $('price').value = p.price ?? ''; $('oldPrice').value = p.oldPrice ?? ''; $('desc').value = p.desc || ''; $('specs').value = (p.specs || []).join('\n'); $('currentImages').innerHTML = (p.images || [p.image]).filter(Boolean).map((url) => `<img src="${escapeHtml(url)}" alt="صورة المنتج" />`).join(''); $('formTitle').textContent = 'تعديل المنتج'; $('cancelEditBtn').classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
async function uploadImages(files, id) { const urls = []; for (const file of files) { const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-'); const target = storageRef(storage, `products/${id}/${Date.now()}-${safeName}`); await withTimeout(uploadBytes(target, file), 'upload'); urls.push(await withTimeout(getDownloadURL(target), 'upload')); } return urls; }

$('loginForm').addEventListener('submit', async (event) => { event.preventDefault(); const button = event.currentTarget.querySelector('button[type="submit"]'); authMessage(); button.disabled = true; button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الدخول…'; try { await withTimeout(signInWithEmailAndPassword(auth, $('loginEmail').value.trim(), $('loginPassword').value), 'login'); } catch (error) { console.error('Firebase login failed:', error); authMessage(loginErrorMessage(error)); } finally { button.disabled = false; button.innerHTML = '<i class="fas fa-right-to-bracket"></i> تسجيل الدخول'; } });
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
    await withTimeout(set(ref(database, `products/${id}`), product), 'database'); clearForm(); message('تم حفظ المنتج وسيظهر في المتجر تلقائيًا.');
  } catch (error) { console.error('Product save failed:', error); message(saveErrorMessage(error), true); } finally { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> حفظ المنتج'; }
});
$('productsList').addEventListener('click', async (event) => { const edit = event.target.closest('[data-edit]'); if (edit) return startEdit(edit.dataset.edit); const del = event.target.closest('[data-delete]'); if (!del || !confirm('هل تريد حذف هذا المنتج؟')) return; try { await remove(ref(database, `products/${del.dataset.delete}`)); message('تم حذف المنتج.'); } catch { message('تعذر الحذف. تحقق من قواعد قاعدة البيانات.', true); } });
$('importDefaultsBtn').addEventListener('click', async () => { const defaults = window.hbProducts || []; if (!defaults.length || !confirm(`سيتم نشر ${defaults.length} منتجات حالية في Firebase. متابعة؟`)) return; try { await Promise.all(defaults.map((p) => set(ref(database, `products/${p.id}`), { ...p, updatedAt: Date.now() }))); message('تم استيراد المنتجات الحالية بنجاح.'); } catch { message('تعذر الاستيراد. تحقق من قواعد قاعدة البيانات.', true); } });
onAuthStateChanged(auth, (user) => { authView.classList.toggle('hidden', Boolean(user)); dashboardView.classList.toggle('hidden', !user); if (!user) { products = []; displayProducts(); return; } onValue(ref(database, 'products'), (snapshot) => { products = Object.values(snapshot.val() || {}); displayProducts(); }, () => message('تعذر قراءة المنتجات. تحقق من قواعد Realtime Database.', true)); });
