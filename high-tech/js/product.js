/* ==========================================================================
   HIGH TECH — Product detail page
   ========================================================================== */

let CUR = null;
let CUR_QTY = 1;
let GALLERY_IMG = '';
let GALLERY_VIEWS = [];

function initPage() {
  const id = new URLSearchParams(location.search).get('id');
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  CUR = p;
  document.title = `${p.name} | High Tech`;

  document.getElementById('crumbName').textContent = p.name;
  document.getElementById('crumbShop').href = `shop.html?cat=${p.cat}`;
  document.getElementById('crumbShop').textContent = CATS[p.cat].fa;

  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const layout = document.getElementById('pdLayout');

  /* gallery: four views of the same product shot */
  GALLERY_IMG = prodImg(p);
  GALLERY_VIEWS = [
    { s: 1,    p: '50% 50%', label: 'نمای کامل' },
    { s: 1.8,  p: '50% 45%', label: 'نمای جزئیات' },
    { s: 1.5,  p: '32% 32%', label: 'نمای نزدیک' },
    { s: 1.5,  p: '70% 72%', label: 'نمای کنار' }
  ];

  layout.innerHTML = `
    <div class="pd-gallery">
      <div class="main" id="pdMain">
        <img src="${GALLERY_IMG}" alt="${p.name}" style="object-position:${GALLERY_VIEWS[0].p};transform:scale(${GALLERY_VIEWS[0].s})">
      </div>
      <div class="pd-thumbs">
        ${GALLERY_VIEWS.map((v, i) =>
          `<div class="th ${i === 0 ? 'on' : ''}" onclick="pickView(this,${i})" title="${v.label}">
            <img src="${GALLERY_IMG}" alt="${p.name} — ${v.label}" style="object-position:${v.p};transform:scale(${v.s})">
          </div>`).join('')}
      </div>
    </div>

    <div class="pd-info">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="chip">${p.brand}</span>
        <span class="chip">${CATS[p.cat].fa}</span>
        ${off ? `<span class="chip chip--sale">${fmt(off)}٪ تخفیف</span>` : ''}
        ${p.badge === 'new' ? '<span class="chip chip--new">جدید</span>' : ''}
        ${p.badge === 'hot' ? '<span class="chip chip--hot">پرفروش</span>' : ''}
      </div>
      <h1>${p.name}</h1>
      <div class="pd-meta">
        <span class="stars">${STARS(p.rating)}</span>
        <span>${p.rating.toLocaleString('fa-IR')} از ۵</span>
        <span>${fmt(p.reviews)} دیدگاه</span>
        <span style="color:#4ade80">${p.stock > 0 ? `موجود در انبار (${fmt(p.stock)} عدد)` : 'ناموجود'}</span>
      </div>

      <div class="pd-price">
        ${p.old ? `<span class="old">${fmt(p.old)} ${TOMAN}</span>` : ''}
        <span class="now">${fmt(p.price)} <small>${TOMAN}</small></span>
      </div>

      <p class="pd-desc">${p.short}</p>

      ${p.colors.length > 1 ? `<div class="pd-opt">
        <h5>رنگ</h5>
        <div class="swatches">
          ${p.colors.map((c, i) => `<span class="swatch ${i === 0 ? 'on' : ''}" style="background:${c}" title="رنگ ${fmt(i + 1)}" onclick="pickColor(this)"></span>`).join('')}
        </div>
      </div>` : ''}

      <div class="pd-opt">
        <h5>تعداد</h5>
        <div class="qty">
          <button onclick="stepQty(-1)" aria-label="کاهش">−</button>
          <input id="pdQty" value="۱" readonly>
          <button onclick="stepQty(1)" aria-label="افزایش">+</button>
        </div>
      </div>

      <div class="pd-actions">
        <button class="btn btn--primary" onclick="addCurrent()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>
          افزودن به سبد خرید
        </button>
        <button class="btn btn--ghost" onclick="toggleWishBtn(this,'${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          علاقه‌مندی
        </button>
      </div>

      <div class="pd-trust">
        <div class="pt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/></svg> ضمانت اصالت کالا</div>
        <div class="pt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h13l-3-3m3 3-3 3M18 5h3v14h-3"/></svg> ارسال سریع ۲۴ ساعته</div>
        <div class="pt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/><path d="M12 7v5l3 2"/></svg> ۷ روز مهلت بازگشت</div>
      </div>
    </div>`;

  /* Tabs content */
  document.getElementById('tab-desc').innerHTML = `
    <div style="max-width:80ch;color:var(--muted);line-height:2">
      <p style="color:#d3ddf2;font-size:1.05rem;margin-bottom:18px">${p.short}</p>
      <p>محصول <b style="color:#fff">${p.name}</b> از برند معتبر <b style="color:#fff">${p.brand}</b> یکی از گزینه‌های حرفه‌ای در دسته‌ی «${CATS[p.cat].fa}» است که برای کاربرانی طراحی شده که به کیفیت، دوام و عملکرد اهمیت می‌دهند. این محصول با متریال درجه‌یک و کنترل کیفیت دقیق تولید شده و مناسب استفاده‌ی روزمره و حرفه‌ای است.</p>
      <p style="margin-top:14px">تمامی محصولات High Tech با گارانتی معتبر و ضمانت اصالت عرضه می‌شوند. در صورت وجود هرگونه مشکل، تیم پشتیبانی ما در تمام روزهای هفته آماده‌ی کمک به شماست.</p>
    </div>`;

  document.getElementById('tab-specs').innerHTML = `
    <table class="spec-table">
      <tr><td>برند</td><td>${p.brand}</td></tr>
      <tr><td>دسته‌بندی</td><td>${CATS[p.cat].fa}</td></tr>
      ${p.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
      <tr><td>کد کالا</td><td>${p.id.toUpperCase()}</td></tr>
      <tr><td>موجودی</td><td>${fmt(p.stock)} عدد</td></tr>
    </table>`;

  const reviews = [
    ['امیر', 'کیفیت ساخت واقعاً بالاست و دقیقاً مطابق توضیحات بود. از خریدم راضی‌ام.', 5],
    ['نگین', 'بسته‌بندی خوب و ارسال سریع. عملکردش هم عالیه، پیشنهاد می‌کنم.', 5],
    ['رضا', 'نسبت به قیمتش ارزش خرید بالایی داره. فقط کمی دیرتر از موعد رسید.', 4]
  ];
  document.getElementById('tab-review').innerHTML = `
    <div style="display:grid;gap:16px;max-width:820px">
      ${reviews.map(([n, txt, r]) => `
        <div class="citem" style="padding:20px">
          <span class="av" style="width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--grad);flex:none">${n[0]}</span>
          <div class="ci-info">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <b style="font-size:.95rem">${n}</b>
              <span class="stars" style="font-size:.8rem">${STARS(r)}</span>
            </div>
            <p style="color:var(--muted);font-size:.92rem">${txt}</p>
          </div>
        </div>`).join('')}
    </div>`;

  /* Tabs switching */
  document.getElementById('pdTabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('#pdTabs .tab').forEach(t => t.classList.remove('on'));
    document.querySelectorAll('.tab-panel').forEach(t => t.classList.remove('on'));
    btn.classList.add('on');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('on');
  });

  /* Related — fill a full row of 4 */
  const sameCat = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id);
  const others = PRODUCTS.filter(x => x.cat !== p.cat && x.id !== p.id).sort((a, b) => b.rating - a.rating);
  const pool = [...sameCat, ...others].slice(0, 4);
  document.getElementById('relatedGrid').innerHTML = pool.map(cardHTML).join('');

  observeReveal();
}

function pickView(el, i) {
  document.querySelectorAll('.pd-thumbs .th').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  const v = GALLERY_VIEWS[i];
  document.getElementById('pdMain').innerHTML =
    `<img src="${GALLERY_IMG}" alt="" style="object-position:${v.p};transform:scale(${v.s})">`;
}
function pickColor(el) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('on'));
  el.classList.add('on');
}
function stepQty(d) {
  CUR_QTY = Math.max(1, Math.min(CUR.stock, CUR_QTY + d));
  document.getElementById('pdQty').value = fmt(CUR_QTY);
}
function addCurrent() {
  Cart.add(CUR.id, CUR_QTY);
  openDrawer();
}
function toggleWishBtn(btn, id) {
  const w = readJSON(WISH_KEY, []);
  const on = w.includes(id);
  toggleWish(btn, id);
}
