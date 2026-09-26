# نشر متجر HB.negoce مجاناً وإدارة المنتجات

## 1. قاعدة البيانات وتسجيل دخول المدير (Supabase)

1. أنشئ حساباً ومشروعاً مجانياً من [Supabase](https://supabase.com/).
2. من **SQL Editor** شغّل النص التالي، مع استبدال بريدك في الموضع المحدد:

```sql
create table public.products (
  id bigint primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Anyone can view products" on public.products for select using (true);
create policy "Only store admin can manage products" on public.products
for all to authenticated
using ((auth.jwt() ->> 'email') = 'PUT_YOUR_EMAIL_HERE')
with check ((auth.jwt() ->> 'email') = 'PUT_YOUR_EMAIL_HERE');
```

3. من **Authentication → Users** اضغط **Add user** وأنشئ حساب المدير بالبريد نفسه وكلمة مرور قوية. لا تفعّل التسجيل العام للمستخدمين.
4. من **Project Settings → API** انسخ `Project URL` و`anon public key` إلى الحقلين داخل `config.js`. المفتاح `anon` مسموح علناً؛ لا تنسخ أبداً مفتاح `service_role`.
5. افتح `admin.html` وسجّل الدخول. الكتالوج يبدأ فارغاً؛ أضف المنتج برابط صورة، أو ارفعه أولاً إلى **Storage** في Supabase ثم الصق رابطه العام. المنتجات المنشورة ستظهر في الصفحة الرئيسية. يمكنك استخدام زر **حذف جميع المنتجات** لإفراغ الكتالوج المنشور عند الحاجة.

## 2. نشر الموقع مجاناً (GitHub Pages)

1. أنشئ مستودعاً جديداً على GitHub، ثم ارفع كل ملفات هذا المجلد إليه، بما فيها `admin.html` و`config.js`.
2. في المستودع افتح **Settings → Pages**، واختر **Deploy from a branch** ثم `main` و`/(root)` واحفظ.
3. انتظر دقيقة؛ سيظهر رابط مثل `https://اسمك.github.io/اسم-المستودع/`. هذا هو رابط متجرك المجاني.
4. لا تشارك رابط `admin.html` وكلمة مرور المدير. الحماية الفعلية تبقى في Supabase حتى لو عرف شخص الرابط.

> ملاحظة: لا يوجد في الاستضافة المجانية دومين مخصص تلقائياً؛ يمكن ربط دومين تملكه لاحقاً من إعدادات GitHub Pages.
