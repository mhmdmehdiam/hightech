/* ==========================================================================
   HIGH TECH — Product catalog & vector icons
   ========================================================================== */

/* ---------- Inline line-art icons (stroke uses currentColor) ---------- */
const ICONS = {
  mouse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="M12 6.5v4"/><path d="M7 10.5h10"/></svg>`,
  keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2.5"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M7.5 13.5h9"/></svg>`,
  headset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4.5" height="7.5" rx="2"/><rect x="16.5" y="13" width="4.5" height="7.5" rx="2"/><path d="M20 17.5c0 2-1.5 3-3.5 3"/></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.5" width="20" height="13" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/></svg>`,
  gpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="2"/><circle cx="8.5" cy="12" r="3.2"/><path d="M14.5 10h5M14.5 14h3"/><path d="M5 17.5v2.5"/></svg>`,
  ram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7.5" width="20" height="8" rx="1.5"/><path d="M6 15.5V19M10 15.5V19M14 15.5V19M18 15.5V19"/><path d="M6 10.5h3M11 10.5h3"/></svg>`,
  ssd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="16" cy="12" r="2.8"/><path d="M6 9.5h5M6 14.5h5"/></svg>`,
  psu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="3.6"/><path d="M15.5 10h4.5M15.5 14h3"/></svg>`,
  cooler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="14" rx="2"/><circle cx="12" cy="9" r="4"/><path d="M9.5 20.5h5M12 16v4.5"/></svg>`,
  webcam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10.5" r="6.5"/><circle cx="12" cy="10.5" r="2.6"/><path d="M5.5 20.5h13"/></svg>`,
  speaker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="7" r="1.6"/></svg>`,
  mousepad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="7"/><path d="M8 9.5h8M8 13h5"/></svg>`,
  hub: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="7" rx="2.5"/><path d="M6 9v3M10 9v3M14 9v3M18 9v3"/><path d="M12 9V5"/></svg>`,
  laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 18.5h20l-1.5-3.5H3.5L2 18.5z"/></svg>`,
  cable: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v6"/><path d="M3.5 2h5M15.5 22h5"/></svg>`,
  chair: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v11h12V3"/><path d="M4 14h16"/><path d="M12 14v7M8 21h8"/></svg>`
};

/* ---------- Helpers ---------- */
const STARS = n => {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<svg viewBox="0 0 24 24" fill="${i <= Math.round(n) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6"><path d="m12 2 3 6.5 7 .9-5 4.8 1.2 7L12 18l-6.2 3.2L7 14.2 2 9.4l7-.9L12 2z"/></svg>`;
  }
  return s;
};

const CATS = {
  mouse:     { fa: 'ماوس',          desc: 'دقت و سرعت در هر کلیک' },
  keyboard:  { fa: 'کیبورد',        desc: 'تایپ و گیمینگ حرفه‌ای' },
  audio:     { fa: 'هدست و صدا',     desc: 'صدای فراگیر و واضح' },
  display:   { fa: 'مانیتور',        desc: 'تصویر زنده و دقیق' },
  hardware:  { fa: 'قطعات داخلی',    desc: 'قدرت خالص برای سیستم' },
  accessory: { fa: 'لوازم جانبی',    desc: 'هرچی برای میز کار لازم داری' }
};

/* ---------- Products ---------- */
const PRODUCTS = [
  {
    id: 'ht-101', name: 'ماوس گیمینگ لاجیتک G Pro X Superlight 2',
    brand: 'Logitech', cat: 'mouse', price: 4850000, old: 5600000,
    rating: 4.9, reviews: 214, badge: 'hot', icon: 'mouse',
    g: ['#3b82f6', '#8b5cf6'], stock: 12,
    short: 'ماوس بی‌سیم فوق‌سبک ۶۰ گرمی با سنسور HERO 2 و دقت ۳۲,۰۰۰ DPI — انتخاب اول گیمرهای حرفه‌ای.',
    specs: [['نوع اتصال', 'بی‌سیم Lightspeed'], ['سنسور', 'HERO 2 — 32,000 DPI'], ['وزن', '۶۰ گرم'], ['عمر باتری', 'تا ۹۵ ساعت'], ['گارانتی', '۲۴ ماه شرکتی']],
    colors: ['#0f172a', '#f8fafc', '#e11d48']
  },
  {
    id: 'ht-102', name: 'ماوس اداری بی‌سیم لاجیتک MX Master 3S',
    brand: 'Logitech', cat: 'mouse', price: 3920000, old: 4300000,
    rating: 4.8, reviews: 168, badge: 'new', icon: 'mouse',
    g: ['#0ea5e9', '#22d3ee'], stock: 20,
    short: 'ماوس ارگونومیک با اسکرول الکترومغناطیسی MagSpeed و کلیک بی‌صدا — ساخته‌شده برای بهره‌وری.',
    specs: [['نوع اتصال', 'بی‌سیم + بلوتوث'], ['سنسور', '8,000 DPI'], ['دکمه‌ها', '۷ عدد قابل شخصی‌سازی'], ['عمر باتری', 'تا ۷۰ روز'], ['گارانتی', '۱۸ ماه']],
    colors: ['#1e293b', '#e2e8f0']
  },
  {
    id: 'ht-103', name: 'کیبورد مکانیکال کیکرون K8 Pro',
    brand: 'Keychron', cat: 'keyboard', price: 5290000, old: 6100000,
    rating: 4.7, reviews: 96, badge: '', icon: 'keyboard',
    g: ['#8b5cf6', '#ec4899'], stock: 8,
    short: 'کیبورد ۷۵٪ بی‌سیم با سوییچ‌های قابل تعویض داغ، ساختار آلومینیومی و پشتیبانی از سه حالت اتصال.',
    specs: [['چیدمان', '۷۵٪ — ۸۴ کلید'], ['سوییچ', 'Gateron Brown'], ['اتصال', 'بلوتوث / USB-C / 2.4G'], ['بک‌لایت', 'RGB'], ['گارانتی', '۱۲ ماه']],
    colors: ['#111827', '#f5f5f4', '#3b82f6']
  },
  {
    id: 'ht-104', name: 'کیبورد گیمینگ رِیزر BlackWidow V4 Pro',
    brand: 'Razer', cat: 'keyboard', price: 7450000, old: 8200000,
    rating: 4.8, reviews: 142, badge: 'hot', icon: 'keyboard',
    g: ['#22c55e', '#22d3ee'], stock: 6,
    short: 'کیبورد مکانیکال گیمینگ با سوییچ‌های سبز رِیزر، دیال کنترل و پالم‌رست مغناطیسی — آماده نبرد.',
    specs: [['چیدمان', 'فول‌سایز'], ['سوییچ', 'Razer Green Mechanical'], ['بک‌لایت', 'Chroma RGB'], ['نرخ پاسخ', '۸۰۰۰ هرتز'], ['گارانتی', '۲۴ ماه']],
    colors: ['#0b1220', '#1f2937']
  },
  {
    id: 'ht-105', name: 'هدست گیمینگ استیل‌سریز Arctis Nova Pro',
    brand: 'SteelSeries', cat: 'audio', price: 8900000, old: 9900000,
    rating: 4.9, reviews: 187, badge: 'hot', icon: 'headset',
    g: ['#3b82f6', '#22d3ee'], stock: 9,
    short: 'هدست پرچمدار با صدای Hi-Res، حذف نویز فعال و دو باتری قابل تعویض — بدون وقفه در بازی.',
    specs: [['نوع', 'بی‌سیم دوگانه'], ['درایور', '۴۰ میلی‌متری Neodymium'], ['میکروفون', 'ClearCast Gen 2 حذف نویز'], ['باتری', '۲ × قابل تعویض'], ['گارانتی', '۲۴ ماه']],
    colors: ['#111827', '#e5e7eb']
  },
  {
    id: 'ht-106', name: 'هدست بلوتوثی سونی WH-1000XM5',
    brand: 'Sony', cat: 'audio', price: 11800000, old: 13500000,
    rating: 4.9, reviews: 402, badge: 'sale', icon: 'headset',
    g: ['#6366f1', '#a855f7'], stock: 15,
    short: 'بهترین حذف نویز دنیا با ۸ میکروفون، صدای Hi-Res و ۳۰ ساعت پخش — آرامش مطلق.',
    specs: [['نوع', 'بی‌سیم بلوتوث ۵.۲'], ['حذف نویز', 'فعال پیشرفته (ANC)'], ['عمر باتری', 'تا ۳۰ ساعت'], ['کدک', 'LDAC / AAC / SBC'], ['گارانتی', '۱۸ ماه']],
    colors: ['#0f0f10', '#d4d4d8', '#7c3aed']
  },
  {
    id: 'ht-107', name: 'مانیتور گیمینگ ال‌جی UltraGear 27GP850',
    brand: 'LG', cat: 'display', price: 15600000, old: 17400000,
    rating: 4.8, reviews: 233, badge: 'hot', icon: 'monitor',
    g: ['#ef4444', '#f59e0b'], stock: 11,
    short: 'مانیتور ۲۷ اینچ QHD با نرخ ۱۸۰ هرتز، ۱ms و پنل Nano IPS — روان، دقیق و بی‌نقص.',
    specs: [['اندازه', '۲۷ اینچ'], ['رزولوشن', '2560×1440 (QHD)'], ['نرخ نوسازی', '۱۸۰ هرتز'], ['پنل', 'Nano IPS'], ['گارانتی', '۳۶ ماه']],
    colors: ['#111827']
  },
  {
    id: 'ht-108', name: 'مانیتور حرفه‌ای دل UltraSharp U2723QE',
    brand: 'Dell', cat: 'display', price: 21400000, old: 23000000,
    rating: 4.7, reviews: 118, badge: 'new', icon: 'monitor',
    g: ['#0ea5e9', '#3b82f6'], stock: 7,
    short: 'مانیتور ۴K با پوشش ۹۸٪ DCI-P3، پنل IPS Black و هاب USB-C — استاندارد طلایی طراحان.',
    specs: [['اندازه', '۲۷ اینچ'], ['رزولوشن', '3840×2160 (4K)'], ['پوشش رنگ', '۹۸٪ DCI-P3'], ['پورت', 'USB-C با پاور ۹۰ وات'], ['گارانتی', '۳۶ ماه']],
    colors: ['#0f172a', '#e2e8f0']
  },
  {
    id: 'ht-109', name: 'کارت گرافیک ایسوس RTX 4070 Ti Super',
    brand: 'ASUS', cat: 'hardware', price: 42800000, old: 46500000,
    rating: 4.9, reviews: 156, badge: 'hot', icon: 'gpu',
    g: ['#22c55e', '#3b82f6'], stock: 5,
    short: 'کارت گرافیک نسل ۴۰ با ۱۶ گیگ حافظه GDDR6X و خنک‌کننده سه‌فن — قدرت رندر بی‌رقیب.',
    specs: [['حافظه', '۱۶GB GDDR6X'], ['پردازنده', 'NVIDIA RTX 4070 Ti SUPER'], ['رابط', 'PCIe 4.0'], ['خروجی', 'HDMI 2.1 × 2'], ['گارانتی', '۳۶ ماه']],
    colors: ['#111827']
  },
  {
    id: 'ht-110', name: 'رم کورسیر Vengeance DDR5 32GB',
    brand: 'Corsair', cat: 'hardware', price: 6900000, old: 7600000,
    rating: 4.8, reviews: 204, badge: '', icon: 'ram',
    g: ['#8b5cf6', '#6366f1'], stock: 24,
    short: 'کیت حافظه DDR5 با فرکانس ۶۰۰۰MHz، پروفایل EXPO/XMP و هیت‌سینک آلومینیومی.',
    specs: [['ظرفیت', '۳۲GB (۲×۱۶)'], ['فرکانس', '6000 MHz'], ['نوع', 'DDR5'], ['ولتاژ', '۱.۳۵ ولت'], ['گارانتی', 'مادام‌العمر']],
    colors: ['#0f172a', '#e5e7eb']
  },
  {
    id: 'ht-111', name: 'حافظه SSD سامسونگ 990 Pro ظرفیت ۲ ترابایت',
    brand: 'Samsung', cat: 'hardware', price: 8400000, old: 9200000,
    rating: 4.9, reviews: 318, badge: 'sale', icon: 'ssd',
    g: ['#ec4899', '#8b5cf6'], stock: 30,
    short: 'SSD NVMe با سرعت خواندن ۷۴۵۰MB/s و کنترلر جدید — بوت و لود فوق‌سریع.',
    specs: [['ظرفیت', '۲ ترابایت'], ['رابط', 'PCIe 4.0 NVMe'], ['سرعت خواندن', '۷۴۵۰ MB/s'], ['فرم‌فاکتور', 'M.2 2280'], ['گارانتی', '۶۰ ماه']],
    colors: ['#111827']
  },
  {
    id: 'ht-112', name: 'پاور ماژولار کولرمستر MWE 850W Gold',
    brand: 'Cooler Master', cat: 'hardware', price: 5100000, old: 5700000,
    rating: 4.7, reviews: 92, badge: '', icon: 'psu',
    g: ['#f59e0b', '#ef4444'], stock: 16,
    short: 'منبع تغذیه ۸۵۰ وات با استاندارد 80Plus Gold، طراحی تمام‌ماژولار و فن بی‌صدا.',
    specs: [['توان', '۸۵۰ وات'], ['استاندارد', '80Plus Gold'], ['ماژولار', 'تمام‌ماژولار'], ['فن', '۱۴۰ میلی‌متری'], ['گارانتی', '۶۰ ماه']],
    colors: ['#111827']
  },
  {
    id: 'ht-113', name: 'وب‌کم لاجیتک Brio 4K Ultra HD',
    brand: 'Logitech', cat: 'accessory', price: 6300000, old: 7000000,
    rating: 4.6, reviews: 127, badge: 'new', icon: 'webcam',
    g: ['#0ea5e9', '#22d3ee'], stock: 14,
    short: 'وب‌کم ۴K با HDR، فوکوس خودکار و لنز شیشه‌ای — تصویری حرفه‌ای برای جلسات و استریم.',
    specs: [['رزولوشن', '4K UHD'], ['نرخ فریم', '۳۰fps @4K'], ['میکروفون', 'دوگانه با حذف نویز'], ['میدان دید', '۹۰ درجه'], ['گارانتی', '۱۸ ماه']],
    colors: ['#0f172a', '#e5e7eb']
  },
  {
    id: 'ht-114', name: 'اسپیکر کریتیو Pebble Pro',
    brand: 'Creative', cat: 'accessory', price: 2450000, old: 2800000,
    rating: 4.7, reviews: 189, badge: 'sale', icon: 'speaker',
    g: ['#22d3ee', '#3b82f6'], stock: 26,
    short: 'اسپیکر دسکتاپ جمع‌وجمع با صدای استریو شفاف، RGB و اتصال بلوتوث/USB — شیک و قدرتمند.',
    specs: [['توان', '۲× ۵ وات RMS'], ['اتصال', 'بلوتوث / USB-C / جک ۳.۵'], ['نورپردازی', 'RGB'], ['ویژگی', 'تقویت‌کننده باس'], ['گارانتی', '۱۲ ماه']],
    colors: ['#111827', '#e5e7eb']
  },
  {
    id: 'ht-115', name: 'ماوس‌پد گیمینگ رِیزر Strider XXL',
    brand: 'Razer', cat: 'accessory', price: 980000, old: 1250000,
    rating: 4.6, reviews: 143, badge: 'sale', icon: 'mousepad',
    g: ['#22c55e', '#a3e635'], stock: 40,
    short: 'ماوس‌پد بزرگ با سطح پارچه‌ای ضدآب، لبه دوخته‌شده و چسبندگی کامل روی میز.',
    specs: [['ابعاد', '۹۰۰ × ۴۰۰ میلی‌متر'], ['جنس', 'پارچه ضدآب'], ['ضخامت', '۳ میلی‌متر'], ['لبه', 'دوخته‌شده ضدپوسیدگی'], ['گارانتی', '۶ ماه']],
    colors: ['#111827']
  },
  {
    id: 'ht-116', name: 'هاب USB-C انکر ۷ کاره',
    brand: 'Anker', cat: 'accessory', price: 1950000, old: 2200000,
    rating: 4.8, reviews: 265, badge: '', icon: 'hub',
    g: ['#8b5cf6', '#22d3ee'], stock: 33,
    short: 'هاب ۷ کاره با HDMI 4K، سه پورت USB، کارت‌خوان و پاس‌ترو ۱۰۰ وات — همه‌کاره و جمع‌وجور.',
    specs: [['پورت‌ها', '۷ عدد'], ['خروجی تصویر', 'HDMI 4K@30Hz'], ['پاس‌ترو', '۱۰۰ وات Power Delivery'], ['بدنه', 'آلومینیوم'], ['گارانتی', '۱۸ ماه']],
    colors: ['#0f172a', '#d4d8e0']
  }
];
