const products = [
  {
    id: 1,
    name: 'Rolex Oyster Perpetual',
    brand: 'Rolex',
    type: 'كلاسيك',
    price: 249,
    oldPrice: 349,
    desc: 'ارتقِ بإطلالتك مع ساعة Rolex Oyster Perpetual الكلاسيكية: تصميم راقٍ بمينا متوازن وسوار فولاذي أنيق يمنحك حضوراً واثقاً من أول اجتماع حتى السهرة. قطعة عملية ومريحة للاستخدام اليومي، وتكمل البدلة واللباس الكاجوال بذوق هادئ لا يخرج من الموضة.',
    salesTitle: 'الفخامة الهادئة والجودة التي تدوم معك لسنوات',
    salesDesc: 'هل تبحث عن ساعة تجمع بين البساطة الراقية والأناقة المثالية؟ صُممت Rolex Oyster Perpetual بعناية ومواد مختارة لتمنحك مظهراً أنيقاً وبريقاً يدوم. سواء كنت في اجتماع عمل أو مناسبة خاصة، ستضيف هذه الساعة لمسة من الهيبة والذوق الرفيع إلى إطلالتك.',
    orderBenefits: ['توصيل مجاني لجميع المدن المغربية', 'تصل في علبة فاخرة مناسبة للإهداء أو الحفظ', 'يمكنك معاينة الساعة قبل الدفع'],
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
    salesTitle: 'تميز شرقي بلمسة فاخرة وجودة عالية',
    salesDesc: 'تميز عن الجميع واجعل معصمك يتحدث بلغة الفخامة. تجمع Rolex Arabic Dial بين الأرقام العربية الأنيقة والتفاصيل الكلاسيكية الراقية، لتمنحك طابعاً استثنائياً يلفت الأنظار في المناسبات واليوميات. تصميمها المتوازن يجعلها خياراً رائعاً لمن يقدّر الهوية والذوق الرفيع.',
    orderBenefits: ['توصيل مجاني حتى باب منزلك', 'تأتي داخل علبة فاخرة ومميزة', 'افتح الطرد وتأكد من الساعة قبل الدفع'],
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
    salesTitle: 'أسطورة السرعة والجرأة بتفاصيل تدوم',
    salesDesc: 'إذا كنت من عشاق الجرأة والتصاميم الرياضية الفاخرة، فإن Rolex Cosmograph Daytona هي الاختيار المناسب للرجل الطموح. بتفاصيل مينائها المتقنة وعداداتها الدقيقة، تمنحك مظهراً قوياً يرافقك في العمل والسفر والمناسبات، مع خامات مختارة للاستخدام اليومي.',
    orderBenefits: ['شحن مجاني وسريع لجميع المدن', 'علبة فخمة تليق بقيمة الساعة', 'جودة عالية مع حق المعاينة قبل الدفع'],
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
    salesTitle: 'الأناقة الفرنسية الفريدة بتفاصيل استثنائية',
    salesDesc: 'اخرج عن المألوف واكتشف سحر التصميم المربع الأيقوني لساعة Cartier Santos. ببراغيها الظاهرة ومينائها الكلاسيكي، تمنحك مظهراً دبلوماسياً وجذاباً. تصميم أنيق يرفع من رقي إطلالتك في كل مناسبة، ويجعلها هدية جميلة لمن يقدّر التفاصيل الفاخرة.',
    orderBenefits: ['توصيل مجاني حتى باب منزلك', 'تصل في علبة فاخرة وأنيقة', 'المعاينة قبل الدفع لتتأكد من اختيارك'],
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
    salesTitle: 'الصلابة المطلقة والتصميم العصري بعلبة فاخرة',
    salesDesc: 'لا تتنازل عن أناقتك اليومية ولا عن الصلابة. تجمع Casio G-Shock GA-2100 بين التصميم المثمن العصري والطابع الرياضي العملي، لتكون مريحة على المعصم ومناسبة للحركة والأنشطة اليومية. ساعة جريئة ترافق إطلالتك الكاجوال والرياضية بثقة.',
    orderBenefits: ['شحن مجاني لجميع مدن المغرب', 'تأتي مع علبة فاخرة ممتازة', 'جودة عالية مع المعاينة قبل الدفع'],
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
    salesTitle: 'الفن الميكانيكي الجريء بخامة فاخرة',
    salesDesc: 'لمن لا يرضى إلا بالتميز الجريء، تجسد Hublot Big Bang Steel Skeleton الابتكار بفضل مينائها المكشوف الذي يبرز التفاصيل الميكانيكية. هيكلها القوي وطابعها الرياضي الفاخر يجعلانها قطعة تلفت الأنظار وتمنح معصمك حضوراً استثنائياً في السهرات واللقاءات المهمة.',
    orderBenefits: ['التوصيل مجاني بالكامل', 'تصل داخل علبة فاخرة', 'افتح الطرد وافحصها قبل الدفع'],
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
