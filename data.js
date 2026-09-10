const products = [
  {
    id: 1,
    name: 'Rolex Oyster Perpetual',
    brand: 'Rolex',
    type: 'كلاسيك',
    price: 249,
    oldPrice: 349,
    desc: 'ارتقِ بإطلالتك مع ساعة Rolex Oyster Perpetual الكلاسيكية: تصميم راقٍ بمينا متوازن وسوار فولاذي أنيق يمنحك حضوراً واثقاً من أول اجتماع حتى السهرة. قطعة عملية ومريحة للاستخدام اليومي، وتكمل البدلة واللباس الكاجوال بذوق هادئ لا يخرج من الموضة.',
    image: 'rolex Oyster Perpetual/1.jpeg',
    hoverImage: 'rolex Oyster Perpetual/2.jpeg',
    specs: ['حجم المينا: 36 ملم', 'الزجاج: سافيرا', 'السوار: فولاذ', 'الاعلى جودة...بلامنازع.'],
    images: [
      'rolex Oyster Perpetual/1.jpeg',
      'rolex Oyster Perpetual/2.jpeg',
      'rolex Oyster Perpetual/3.jpeg',
      'rolex Oyster Perpetual/4.jpeg'
    ],
    variants: [
      { index: 1, image: 'rolex Oyster Perpetual/1.jpeg' },
      { index: 2, image: 'rolex Oyster Perpetual/2.jpeg' },
      { index: 3, image: 'rolex Oyster Perpetual/3.jpeg' },
      { index: 4, image: 'rolex Oyster Perpetual/4.jpeg' }
    ]
  },
  {
    id: 2,
    name: 'Rolex Arabic Dial',
    brand: 'Rolex',
    type: 'كلاسيك',
    price: 249,
    oldPrice: 349,
    desc: 'ساعة Rolex Arabic Dial تجمع الطابع الكلاسيكي الراقي مع جمال الأرقام العربية في مينا لافت يعبّر عن ذوقك وهويتك. تفاصيلها المتوازنة وسوارها الفولاذي يمنحانها حضوراً مميزاً في المناسبات الرسمية واليوميات، لتكون اللمسة التي تجعل إطلالتك أكثر فخامة وثقة.',
    image: 'rolex arab/1.jpeg',
    hoverImage: 'rolex arab/2.jpeg',
    specs: ['حجم المينا: 41 ملم', 'الزجاج: سافيرا', 'السوار: فولاذ', 'أرقام عربية', 'الاعلى جودة...بلامنازع.'],
    images: [
      'rolex arab/1.jpeg',
      'rolex arab/2.jpeg',
      'rolex arab/3.jpeg',
      'rolex arab/4.jpeg'
    ],
    variants: [
      { index: 1, image: 'rolex arab/1.jpeg' },
      { index: 2, image: 'rolex arab/2.jpeg' },
      { index: 3, image: 'rolex arab/3.jpeg' },
      { index: 4, image: 'rolex arab/4.jpeg' }
    ]
  },
  {
    id: 3,
    name: 'Rolex Cosmograph Daytona',
    brand: 'Rolex',
    type: 'رياضي',
    price: 249,
    oldPrice: 349,
    desc: 'ساعة Rolex Cosmograph Daytona تمنحك روحاً رياضية فاخرة بتفاصيل كرونوغراف جريئة ومينا غني بالحضور. صُممت لمن يريد ساعة تلفت الانتباه من دون مبالغة، وتنتقل معك بسلاسة بين العمل، السفر والمناسبات. خيار أنيق يجمع المظهر القوي مع راحة الارتداء اليومي.',
    image: 'rolex Cosmograph Daytona/1.jpeg',
    hoverImage: 'rolex Cosmograph Daytona/2.jpeg',
    specs: ['حجم المينا: 40 ملم', 'الزجاج: سافيرا', 'السوار: فولاذ', 'كرونوغراف', 'الاعلى جودة...بلامنازع.'],
    images: [
      'rolex Cosmograph Daytona/1.jpeg',
      'rolex Cosmograph Daytona/2.jpeg',
      'rolex Cosmograph Daytona/3.jpeg'
    ],
    variants: [
      { index: 1, image: 'rolex Cosmograph Daytona/1.jpeg' },
      { index: 2, image: 'rolex Cosmograph Daytona/2.jpeg' },
      { index: 3, image: 'rolex Cosmograph Daytona/3.jpeg' }
    ]
  },
  {
    id: 4,
    name: 'Cartier Santos de Cartier',
    brand: 'Cartier',
    type: 'كلاسيك',
    price: 249,
    oldPrice: 349,
    desc: 'ساعة Cartier Santos de Cartier هي عنوان الأناقة الواثقة: تصميم مربع مميز وخطوط نظيفة تضيف لمسة راقية فوراً إلى معصمك. تناسب من يقدّر التفاصيل الفاخرة والذوق العصري، وترافقك بأناقة مع البدلات والمناسبات أو مع إطلالة يومية مرتبة. هدية مثالية لنفسك أو لشخص مميز.',
    image: 'cartier/1.jpeg',
    hoverImage: 'cartier/2.jpeg',
    specs: ['حجم المينا: 39.8 ملم', 'الزجاج: سافيرا', 'السوار: فولاذ/جلد', 'الاعلى جودة...بلامنازع.'],
    images: [
      'cartier/1.jpeg',
      'cartier/2.jpeg',
      'cartier/3.jpeg',
      'cartier/4.jpeg',
      'cartier/5.jpeg'
    ],
    variants: [
      { index: 1, image: 'cartier/1.jpeg' },
      { index: 2, image: 'cartier/2.jpeg' },
      { index: 3, image: 'cartier/3.jpeg' },
      { index: 4, image: 'cartier/4.jpeg' },
      { index: 5, image: 'cartier/5.jpeg' }
    ]
  },
  {
    id: 5,
    name: 'Casio G-Shock GA-2100',
    brand: 'Casio',
    type: 'رياضي',
    price: 239,
    oldPrice: 299,
    desc: 'ساعة Casio G-Shock GA-2100 خيارك الموثوق لأيام الحركة: شكل رياضي عصري، هيكل متين وراحة تناسب الاستعمال اليومي والأنشطة الخارجية. تجمع بين المظهر الجريء والوظائف العملية لتمنحك ساعة لا تقلق عليها مع إطلالتك الكاجوال أو الرياضية. جاهزة لترافق إيقاع يومك بثقة.',
    image: 'casio/1.jpeg',
    hoverImage: 'casio/2.jpeg',
    specs: ['حجم المينا: 48.5 ملم', 'الزجاج: مينيرال', 'الماء: 200 متر', 'السوار: راتنج', 'شبه تناظرية', 'الاعلى جودة...بلامنازع.'],
    images: [
      'casio/1.jpeg',
      'casio/2.jpeg',
      'casio/3.jpeg',
      'casio/4.jpeg',
      'casio/5.jpeg',
      'casio/6.jpeg',
      'casio/7.jpeg',
      'casio/8.jpeg'
    ],
    variants: [
      { index: 1, image: 'casio/1.jpeg' },
      { index: 2, image: 'casio/2.jpeg' },
      { index: 3, image: 'casio/3.jpeg' },
      { index: 4, image: 'casio/4.jpeg' },
      { index: 5, image: 'casio/5.jpeg' },
      { index: 6, image: 'casio/6.jpeg' },
      { index: 7, image: 'casio/7.jpeg' },
      { index: 8, image: 'casio/8.jpeg' }
    ]
  },
  {
    id: 6,
    name: 'Hublot Big Bang Steel Skeleton',
    brand: 'Hublot',
    type: 'رياضي',
    price: 249,
    oldPrice: 349,
    desc: 'ساعة Hublot Big Bang Steel Skeleton صُممت لمن يحب أن تكون ساعته حديثاً بحد ذاته: هيكل مكشوف يكشف عن تفاصيل مبهرة، وتصميم قوي يجمع الفخامة بالطابع الرياضي. تضيف شخصية جريئة إلى أي إطلالة وتمنحك حضوراً استثنائياً في المناسبات، السهرات واللقاءات المهمة.',
    image: 'hublot/1.jpeg',
    hoverImage: 'hublot/2.jpeg',
    specs: ['حجم المينا: 44 ملم', 'الزجاج: سافيرا', 'السوار: مطاط/فولاذ', 'هيكل مفتوح', 'الاعلى جودة...بلامنازع.'],
    images: [
      'hublot/1.jpeg',
      'hublot/2.jpeg',
      'hublot/3.jpeg',
      'hublot/4.jpeg',
      'hublot/5.jpeg'
    ],
    variants: [
      { index: 1, image: 'hublot/1.jpeg' },
      { index: 2, image: 'hublot/2.jpeg' },
      { index: 3, image: 'hublot/3.jpeg' },
      { index: 4, image: 'hublot/4.jpeg' },
      { index: 5, image: 'hublot/5.jpeg' }
    ]
  }
];
