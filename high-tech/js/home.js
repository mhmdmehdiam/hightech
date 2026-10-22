/* ==========================================================================
   HIGH TECH — Home page
   Hero slider / brands / categories / featured / deals / compare / blog
   ========================================================================== */

/* ---------- Hero slider content ---------- */
const SLIDES = [
  {
    eyebrow: 'جدیدترین‌های دنیای تکنولوژی، همین حالا',
    title: ['تجهیزات حرفه‌ای،', 'تجربه‌ای متفاوت'],
    text: 'از ماوس و کیبورد گیمینگ تا مانیتور و قطعات داخلی — هرچی برای ساختن یک میز کار قدرتمند لازم داری، با ضمانت اصالت و ارسال سریع در High Tech.',
    ctas: [['شروع خرید', 'shop.html', 'primary'], ['محصولات پرطرفدار', '#featured', 'ghost']],
    pid: 'ht-105', badge: 'پرفروش‌ترین', chip: 'chip--hot'
  },
  {
    eyebrow: 'کمپین ویژه — تا ۴۰٪ تخفیف',
    title: ['قدرت خالص برای', 'سیستم رؤیایی'],
    text: 'کارت گرافیک، رم و حافظه‌های فوق‌سریع با قیمت‌های استثنایی. سیستمی بساز که از پس هر بازی و هر پروژه‌ای بربیاد.',
    ctas: [['دیدن قطعات داخلی', 'shop.html?cat=hardware', 'primary'], ['همه تخفیف‌ها', 'shop.html?filter=sale', 'ghost']],
    pid: 'ht-109', badge: 'پیشنهاد ویژه', chip: 'chip--sale'
  },
  {
    eyebrow: 'برای گیمرها و حرفه‌ای‌ها',
    title: ['میز کاری حرفه‌ای،', 'به سبک خودت'],
    text: 'ماوس ارگونومیک، کیبورد مکانیکال و لوازم جانبی‌ای که ساعت‌ها کار و بازی رو راحت‌تر و لذت‌بخش‌تر می‌کنن.',
    ctas: [['کشف لوازم جانبی', 'shop.html?cat=accessory', 'primary'], ['مشاهده فروشگاه', 'shop.html', 'ghost']],
    pid: 'ht-102', badge: 'جدید', chip: 'chip--new'
  }
];

const HERO_STATS = `
  <div class="stats">
    <div class="st"><b>+۱۲٬۰۰۰</b><span>مشتری راضی</span></div>
    <div class="st"><b>+۸۵۰</b><span>محصول متنوع</span></div>
    <div class="st"><b>۴.۹/۵</b><span>امتیاز کاربران</span></div>
  </div>`;

function heroSlideHTML(s, i) {
  const p = PRODUCTS.find(x => x.id === s.pid);
  return `<div class="hero-slide ${i === 0 ? 'is-active' : ''}">
    <div class="hero-copy">
      <span class="eyebrow"><span class="dot"></span> ${s.eyebrow}</span>
      <h1 class="h-xl">${s.title[0]}<br><span class="grad-text">${s.title[1]}</span></h1>
      <p class="lead">${s.text}</p>
      <div class="cta">
        <a href="${s.ctas[0][1]}" class="btn btn--${s.ctas[0][2]}">${s.ctas[0][0]}</a>
        <a href="${s.ctas[1][1]}" class="btn btn--${s.ctas[1][2]}">${s.ctas[1][0]}</a>
      </div>
      ${HERO_STATS}
    </div>
    <div class="hero-visual">
      <div class="orb"></div>
      <div class="orb-ring"></div>
      <div class="hero-card">
        <div class="hc-top">
          <span class="chip ${s.chip}">${s.badge}</span>
          <span class="stars">${STARS(p.rating)}</span>
        </div>
        <div class="hc-visual"><img src="${prodImg(p)}" alt="${p.name}"></div>
        <h4>${p.name}</h4>
        <div class="price">${fmt(p.price)} <small>${TOMAN}</small></div>
        <div class="float-chip fc-1">
          <div class="fc-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 6 9 17l-5-5"/></svg></div>
          <div><b>اصالت تضمینی</b><span>۱۰۰٪ اورجینال</span></div>
        </div>
        <div class="float-chip fc-2">
          <div class="fc-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12h13l-3-3m3 3-3 3M18 5h3v14h-3"/></svg></div>
          <div><b>ارسال سریع</b><span>تحویل ۲۴ ساعته</span></div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- Slider engine ---------- */
let heroIdx = 0, heroTimer = null;

function heroGo(i) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  if (!slides.length) return;
  heroIdx = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('is-active', k === heroIdx));
  dots.forEach((d, k) => d.classList.toggle('on', k === heroIdx));
}
function heroAuto() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => heroGo(heroIdx + 1), 6500);
}

/* ==========================================================================
   COMPARE
   ========================================================================== */
let CMP = ['ht-101', 'ht-105', 'ht-109'];

function renderCompare() {
  const pickers = document.getElementById('cmpPickers');
  const wrapEl = document.getElementById('cmpWrap');
  if (!pickers || !wrapEl) return;

  pickers.innerHTML = CMP.map((id, i) => {
    const p = PRODUCTS.find(x => x.id === id);
    const opts = PRODUCTS.map(x =>
      `<option value="${x.id}" ${x.id === id ? 'selected' : ''}>${x.name}</option>`).join('');
    return `<div class="cmp-pick">
      <div class="cp-img">${p ? `<img src="${prodImg(p)}" alt="${p.name}">` : ''}</div>
      <div class="cp-body">
        <label>محصول ${fmt(i + 1)}</label>
        <select class="select" onchange="setCmp(${i}, this.value)">${opts}</select>
      </div>
      ${CMP.length > 2 ? `<button class="cp-remove" onclick="removeCmp(${i})" aria-label="حذف">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
      </button>` : ''}
    </div>`;
  }).join('') + (CMP.length < 3 ? `<button class="cmp-pick" style="justify-content:center;cursor:pointer;border-style:dashed" onclick="addCmp()">
      <span style="color:#8fb4ff;font-weight:700;font-size:.9rem">+ افزودن محصول به مقایسه</span>
    </button>` : '');

  const items = CMP.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const minPrice = Math.min(...items.map(p => p.price));
  const specKeys = [...new Set(items.flatMap(p => p.specs.map(s => s[0])))];

  const rows = [
    ['برند', p => p.brand],
    ['دسته‌بندی', p => CATS[p.cat].fa],
    ['امتیاز کاربران', p => `<span class="stars">${STARS(p.rating)}</span>`],
    ['تعداد دیدگاه', p => fmt(p.reviews)],
    ['موجودی', p => p.stock > 0
      ? `<span class="cmp-badge-yes">موجود (${fmt(p.stock)})</span>`
      : `<span class="cmp-badge-no">ناموجود</span>`],
    ...specKeys.map(k => [k, p => {
      const s = p.specs.find(x => x[0] === k);
      return s ? s[1] : '<span class="cmp-badge-no">—</span>';
    }])
  ];

  wrapEl.innerHTML = `<table class="cmp-table">
    <thead><tr>
      <th>مشخصه</th>
      ${items.map(p => `<th class="${p.price === minPrice ? 'cmp-best' : ''}">
        <div class="cmp-head">
          <div class="ci"><img src="${prodImg(p)}" alt="${p.name}"></div>
          <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <div class="pr">${fmt(p.price)} <small>${TOMAN}</small></div>
          ${p.price === minPrice ? '<span class="cmp-best-tag">کمترین قیمت</span>' : ''}
        </div>
      </th>`).join('')}
    </tr></thead>
    <tbody>
      ${rows.map(([label, fn]) => `<tr>
        <td>${label}</td>
        ${items.map(p => `<td class="${p.price === minPrice ? 'cmp-best' : ''}">${fn(p)}</td>`).join('')}
      </tr>`).join('')}
      <tr>
        <td>خرید</td>
        ${items.map(p => `<td class="${p.price === minPrice ? 'cmp-best' : ''}">
          <button class="btn btn--primary btn--sm" onclick="Cart.add('${p.id}')">افزودن به سبد</button>
        </td>`).join('')}
      </tr>
    </tbody>
  </table>`;
}

function setCmp(i, id) { CMP[i] = id; renderCompare(); }
function removeCmp(i) { if (CMP.length <= 2) return; CMP.splice(i, 1); renderCompare(); }
function addCmp() {
  if (CMP.length >= 3) return;
  const next = PRODUCTS.find(p => !CMP.includes(p.id));
  if (next) { CMP.push(next.id); renderCompare(); }
}
function resetCompare() { CMP = ['ht-101', 'ht-105', 'ht-109']; renderCompare(); toast('مقایسه بازنشانی شد', 'سه محصول پیشنهادی بارگذاری شد', 'ok'); }

/* ==========================================================================
   BLOG
   ========================================================================== */
const POSTS = [
  {
    pid: 'ht-101', cat: 'راهنمای خرید',
    title: 'راهنمای کامل خرید ماوس گیمینگ در ۱۴۰۴',
    ex: 'از DPI و نرخ پولینگ تا وزن و شکل بدنه — چطور ماوسی انتخاب کنیم که واقعاً به دستت بخوره و سال‌ها کار کنه.',
    date: '۱۲ مهر ۱۴۰۴', read: '۶ دقیقه'
  },
  {
    pid: 'ht-109', cat: 'سخت‌افزار',
    title: 'چطور یک سیستم گیمینگ متعادل ببندیم؟',
    ex: 'تعادل بین پردازنده، کارت گرافیک و حافظه مهم‌تر از بالاترین مشخصات است. اینجا یاد می‌گیری چطور بودجه‌ات را درست خرج کنی.',
    date: '۸ مهر ۱۴۰۴', read: '۹ دقیقه'
  },
  {
    pid: 'ht-104', cat: 'آموزش',
    title: 'کیبورد مکانیکال یا غشایی؟ راهنمای انتخاب',
    ex: 'تفاوت سوییچ‌ها، حس تایپ و عمر مفید — کدام کیبورد برای کار اداری و کدام برای گیمینگ مناسب‌تره؟',
    date: '۳ مهر ۱۴۰۴', read: '۵ دقیقه'
  }
];

function renderBlog() {
  const el = document.getElementById('blogGrid');
  if (!el) return;
  el.innerHTML = POSTS.map(post => {
    const p = PRODUCTS.find(x => x.id === post.pid);
    return `<article class="post reveal">
      <div class="post-media">
        <span class="chip post-cat">${post.cat}</span>
        <img src="${prodImg(p)}" alt="${post.title}" loading="lazy">
      </div>
      <div class="post-body">
        <h3><a href="#blog">${post.title}</a></h3>
        <p>${post.ex}</p>
        <div class="post-meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>${post.date}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${post.read} مطالعه</span>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* ==========================================================================
   INIT
   ========================================================================== */
function initPage() {
  /* ---- Hero slider ---- */
  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.innerHTML = SLIDES.map(heroSlideHTML).join('');
    const dots = document.getElementById('heroDots');
    if (dots) {
      dots.innerHTML = SLIDES.map((_, i) =>
        `<button class="${i === 0 ? 'on' : ''}" onclick="heroGo(${i});heroAuto()" aria-label="اسلاید ${i + 1}"></button>`).join('');
    }
    document.getElementById('heroPrev')?.addEventListener('click', () => { heroGo(heroIdx - 1); heroAuto(); });
    document.getElementById('heroNext')?.addEventListener('click', () => { heroGo(heroIdx + 1); heroAuto(); });

    const heroEl = document.querySelector('.hero');
    heroEl?.addEventListener('mouseenter', () => clearInterval(heroTimer));
    heroEl?.addEventListener('mouseleave', heroAuto);
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { heroGo(heroIdx + 1); heroAuto(); }
      if (e.key === 'ArrowRight') { heroGo(heroIdx - 1); heroAuto(); }
    });

    /* touch swipe */
    let sx = null;
    slider.addEventListener('touchstart', e => { sx = e.touches[0].clientX; clearInterval(heroTimer); }, { passive: true });
    slider.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) heroGo(dx > 0 ? heroIdx - 1 : heroIdx + 1);
      sx = null; heroAuto();
    });

    heroAuto();
  }

  /* ---- Brands marquee ---- */
  const brands = ['Logitech', 'Razer', 'ASUS', 'Samsung', 'Sony', 'Corsair', 'Keychron', 'Dell', 'LG', 'Anker'];
  const bt = document.getElementById('brandTrack');
  if (bt) bt.innerHTML = [...brands, ...brands].map(b => `<span class="brand">${b}</span>`).join('');

  /* ---- Categories ---- */
  const catIcon = { mouse: 'mouse', keyboard: 'keyboard', audio: 'headset', display: 'monitor', hardware: 'gpu', accessory: 'hub' };
  const cg = document.getElementById('catGrid');
  if (cg) {
    cg.innerHTML = Object.entries(CATS).map(([k, v], i) => {
      const count = PRODUCTS.filter(p => p.cat === k).length;
      return `<a href="shop.html?cat=${k}" class="cat-card reveal" style="transition-delay:${i * 60}ms">
        <div class="cc-ic">${ICONS[catIcon[k]]}</div>
        <div>
          <h3>${v.fa}</h3>
          <p>${v.desc} — ${fmt(count)} محصول</p>
          <span class="cc-link">مشاهده محصولات
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
          </span>
        </div>
      </a>`;
    }).join('');
  }

  /* ---- Featured products (top rated) ---- */
  const fg = document.getElementById('featuredGrid');
  if (fg) {
    const featured = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
    fg.innerHTML = featured.map(cardHTML).join('');
  }

  /* ---- Deal mini cards ---- */
  const dm = document.getElementById('dealMini');
  if (dm) {
    const deals = PRODUCTS.filter(p => p.old)
      .sort((a, b) => (1 - b.price / b.old) - (1 - a.price / a.old)).slice(0, 2);
    dm.innerHTML = deals.map(p => {
      const off = Math.round((1 - p.price / p.old) * 100);
      return `<a href="product.html?id=${p.id}" class="card reveal" style="text-align:center">
        <div class="card-media" style="height:120px">
          <span class="chip chip--sale" style="position:absolute;top:12px;right:12px;z-index:2">${fmt(off)}٪</span>
          <img class="p-img" src="${prodImg(p)}" alt="${p.name}" loading="lazy">
        </div>
        <div class="card-body" style="padding:14px;gap:6px">
          <span class="card-title" style="font-size:.86rem;min-height:auto">${p.name}</span>
          <span class="price-now" style="font-size:1rem">${fmt(p.price)} <small>${TOMAN}</small></span>
        </div></a>`;
    }).join('');
  }

  /* ---- Compare & blog ---- */
  renderCompare();
  renderBlog();

  observeReveal();
}
