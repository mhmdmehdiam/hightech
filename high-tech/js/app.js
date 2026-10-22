/* ==========================================================================
   HIGH TECH — Core app logic
   Header / Footer / Cart / Toast / Cards
   ========================================================================== */

const TOMAN = 'تومان';
const fmt = n => n.toLocaleString('fa-IR');
const faNum = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const price = n => `<span>${fmt(n)}</span> <small>${TOMAN}</small>`;
const prodImg = p => `assets/products/${p.id}.webp`;

/* ---------- Brand mark (hexagon badge + H with lightning leg) ---------- */
const LOGO_MARK = `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="15.4" y="15.2" width="3.5" height="17.6" rx="1.75"/><rect x="15.4" y="22.25" width="11.4" height="3.5" rx="1.75"/><path d="M31.4 13.6 25.2 23.9h4.9l-2.7 10.5 8.4-12.1h-5.2l3.1-8.7z"/></svg>`;

/* ==========================================================================
   AUTH  (demo only — no server, everything lives in localStorage)
   ========================================================================== */
const USER_KEY = 'hightech_user_v1';
const USERS_KEY = 'hightech_users_v1';

const Auth = {
  get() { return readJSON(USER_KEY, null); },
  isLoggedIn() { return !!this.get(); },
  users() { return readJSON(USERS_KEY, []); },
  register({ name, email, password, phone }) {
    const users = this.users();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, msg: 'این ایمیل قبلاً ثبت شده است. وارد شوید.' };
    const joined = new Date().toISOString().slice(0, 10);
    users.push({ name, email, password, phone: phone || '', joined });
    writeJSON(USERS_KEY, users);
    writeJSON(USER_KEY, { name, email, phone: phone || '', joined });
    return { ok: true };
  },
  login(email, password) {
    const u = this.users().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, msg: 'کاربری با این ایمیل ثبت نشده است.' };
    if (u.password !== password) return { ok: false, msg: 'رمز عبور اشتباه است.' };
    writeJSON(USER_KEY, { name: u.name, email: u.email, phone: u.phone, joined: u.joined });
    return { ok: true };
  },
  logout() { localStorage.removeItem(USER_KEY); },
  /* send guests to login, remembering where they were headed */
  requireLogin() {
    if (this.isLoggedIn()) return true;
    const back = location.pathname.split('/').pop() + location.search + location.hash;
    location.href = 'login.html?next=' + encodeURIComponent(back);
    return false;
  }
};

/* ==========================================================================
   ORDERS (demo only)
   ========================================================================== */
const ORDERS_KEY = 'hightech_orders_v1';
const Orders = {
  all() { return readJSON(ORDERS_KEY, []); },
  add(order) { const a = this.all(); a.unshift(order); writeJSON(ORDERS_KEY, a); },
  code() {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return 'HT-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate())
      + '-' + Math.floor(1000 + Math.random() * 9000);
  }
};

/* ==========================================================================
   VALIDATORS
   ========================================================================== */
const toEn = s => String(s)
  .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const V = {
  required: v => String(v).trim().length > 0,
  min: (v, n) => String(v).trim().length >= n,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()),
  phone: v => /^09\d{9}$/.test(toEn(v).replace(/\D/g, '')),
  postal: v => /^\d{10}$/.test(toEn(v).replace(/\D/g, ''))
};

/* mark a field valid / invalid and return the boolean */
function markField(input, ok, msg) {
  const field = input.closest('.field');
  if (!field) return ok;
  field.classList.toggle('has-err', !ok);
  const err = field.querySelector('.error');
  if (err && msg) err.textContent = msg;
  return ok;
}
function validateForm(pairs) {
  let ok = true;
  pairs.forEach(([input, test, msg]) => { if (!markField(input, test, msg)) ok = false; });
  return ok;
}

/* ---------- Cart state ---------- */
const CART_KEY = 'hightech_cart_v1';
const WISH_KEY = 'hightech_wish_v1';

const readJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const Cart = {
  items: readJSON(CART_KEY, []),
  save() { writeJSON(CART_KEY, this.items); Cart.sync(); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  subtotal() {
    return this.items.reduce((s, i) => {
      const p = PRODUCTS.find(x => x.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  savings() {
    return this.items.reduce((s, i) => {
      const p = PRODUCTS.find(x => x.id === i.id);
      return s + (p && p.old ? (p.old - p.price) * i.qty : 0);
    }, 0);
  },
  add(id, qty = 1) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const found = this.items.find(i => i.id === id);
    if (found) found.qty += qty; else this.items.push({ id, qty });
    this.save();
    toast('به سبد اضافه شد', p.name, 'cart');
    Cart.renderDrawer();
  },
  setQty(id, qty) {
    const it = this.items.find(i => i.id === id);
    if (!it) return;
    if (qty <= 0) this.remove(id);
    else { it.qty = qty; this.save(); Cart.renderDrawer(); }
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    Cart.renderDrawer();
  },
  clear() { this.items = []; this.save(); Cart.renderDrawer(); },
  sync() {
    const n = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = fmt(n);
      el.classList.toggle('show', n > 0);
    });
    if (typeof renderCartPage === 'function') renderCartPage();
  },
  renderDrawer() {
    const body = document.getElementById('drawerBody');
    const foot = document.getElementById('drawerFoot');
    if (!body) return;
    if (!this.items.length) {
      body.innerHTML = `<div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L21.5 7H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
        <h4>سبد خرید خالیه</h4><p>یه سر به فروشگاه بزن و چیزای خوب انتخاب کن.</p>
        <a href="shop.html" class="btn btn--primary" style="margin-top:18px">رفتن به فروشگاه</a></div>`;
      if (foot) foot.innerHTML = '';
      return;
    }
    body.innerHTML = this.items.map(i => {
      const p = PRODUCTS.find(x => x.id === i.id);
      if (!p) return '';
      return `<div class="citem">
        <div class="ci-media"><img src="${prodImg(p)}" alt="${p.name}" loading="lazy"></div>
        <div class="ci-info">
          <h4>${p.name}</h4>
          <div class="p">${fmt(p.price * i.qty)} <small>${TOMAN}</small></div>
          <div class="ci-row">
            <div class="qty-mini">
              <button onclick="Cart.setQty('${p.id}',${i.qty - 1})" aria-label="کاهش">−</button>
              <span>${fmt(i.qty)}</span>
              <button onclick="Cart.setQty('${p.id}',${i.qty + 1})" aria-label="افزایش">+</button>
            </div>
            <button class="ci-remove" onclick="Cart.remove('${p.id}')" aria-label="حذف">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
            </button>
          </div>
        </div></div>`;
    }).join('');

    if (foot) {
      const sub = this.subtotal(), sav = this.savings();
      foot.innerHTML = `
        <div class="sum-row"><span>جمع کل</span><span>${fmt(sub)} ${TOMAN}</span></div>
        ${sav > 0 ? `<div class="sum-row" style="color:#4ade80"><span>سود شما</span><span>${fmt(sav)} ${TOMAN}</span></div>` : ''}
        <div class="sum-row"><span>هزینه ارسال</span><span>رایگان</span></div>
        <div class="sum-row total"><span>قابل پرداخت</span><span>${fmt(sub)} ${TOMAN}</span></div>
        <a href="cart.html" class="btn btn--primary btn--block">تکمیل خرید</a>`;
    }
  }
};

/* ---------- Toast ---------- */
function toast(title, sub = '', type = 'ok') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="ti">${type === 'cart'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>'}</div>
    <div><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
}

function socialSoon(name) {
  toast('به‌زودی', `صفحه‌ی ${name} ما به‌زودی فعال می‌شود.`, 'ok');
}

/* ---------- Product card ---------- */
function cardHTML(p) {
  const wish = readJSON(WISH_KEY, []).includes(p.id);
  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const badgeMap = { hot: ['chip--hot', 'پرفروش'], new: ['chip--new', 'جدید'], sale: ['chip--sale', `${fmt(off)}٪ تخفیف`] };
  let badges = '';
  if (p.badge && badgeMap[p.badge]) badges += `<span class="chip ${badgeMap[p.badge][0]}">${badgeMap[p.badge][1]}</span>`;
  else if (off > 0) badges += `<span class="chip chip--sale">${fmt(off)}٪ تخفیف</span>`;

  return `<article class="card reveal" data-cat="${p.cat}" data-price="${p.price}" data-rating="${p.rating}">
    <div class="card-media">
      <div class="card-badges">${badges}</div>
      <button class="card-fav ${wish ? 'on' : ''}" onclick="toggleWish(this,'${p.id}')" aria-label="علاقه‌مندی">
        <svg viewBox="0 0 24 24" fill="${wish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <img class="p-img" src="${prodImg(p)}" alt="${p.name}" loading="lazy" decoding="async">
      <div class="card-quick">
        <a href="product.html?id=${p.id}" class="btn btn--dark btn--sm btn--block">مشاهده محصول</a>
      </div>
    </div>
    <div class="card-body">
      <span class="card-brand">${p.brand}</span>
      <h3 class="card-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="card-rate">
        <span class="stars">${STARS(p.rating)}</span>
        <span>${p.rating.toLocaleString('fa-IR')}</span>
        <span>(${fmt(p.reviews)} نظر)</span>
      </div>
      <div class="card-foot">
        <div class="price-box">
          ${p.old ? `<span class="price-old">${fmt(p.old)} ${TOMAN}</span>` : ''}
          <span class="price-now">${fmt(p.price)} <small>${TOMAN}</small></span>
        </div>
        <button class="add-btn" onclick="Cart.add('${p.id}')" aria-label="افزودن به سبد">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function toggleWish(btn, id) {
  let w = readJSON(WISH_KEY, []);
  const on = w.includes(id);
  w = on ? w.filter(x => x !== id) : [...w, id];
  writeJSON(WISH_KEY, w);
  btn.classList.toggle('on', !on);
  btn.querySelector('svg').setAttribute('fill', !on ? 'currentColor' : 'none');
  toast(!on ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', '', 'ok');
}

/* ---------- Header ---------- */
function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const page = document.body.dataset.page || '';
  const cats = Object.entries(CATS).map(([k, v]) =>
    `<a href="shop.html?cat=${k}"><span class="di">${ICONS[k === 'hardware' ? 'gpu' : k === 'audio' ? 'headset' : k === 'accessory' ? 'hub' : k]} </span>${v.fa}</a>`).join('');

  el.innerHTML = `
  <div class="topbar">
    <div class="wrap">
      <div class="tb-items">
        <span>🚚 <b>ارسال رایگان</b> برای خرید بالای ۲ میلیون تومان</span>
        <span class="tb-l"><span>📞 پشتیبانی: <b>۰۲۱-۹۱۰۰۲۰۳۰</b></span></span>
      </div>
      <div class="tb-l">
        <a href="account.html#orders">پیگیری سفارش</a>
        <a href="faq.html">راهنمای خرید</a>
      </div>
    </div>
  </div>
  <nav class="nav wrap">
    <a href="index.html" class="logo">
      <span class="mark">
        ${LOGO_MARK}
      </span>
      <span class="txt"><b>High Tech</b><small>ACCESSORIES</small></span>
    </a>
    <ul class="menu">
      <li class="${page === 'home' ? 'active' : ''}"><a href="index.html">خانه</a></li>
      <li class="${page === 'shop' ? 'active' : ''}"><a href="shop.html">فروشگاه</a></li>
      <li class="has-drop">
        <a href="shop.html">دسته‌بندی‌ها
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </a>
        <div class="dropdown">${cats}</div>
      </li>
      <li><a href="shop.html?filter=sale">تخفیف‌ها</a></li>
      <li><a href="index.html#blog">وبلاگ</a></li>
      <li><a href="contact.html">تماس با ما</a></li>
    </ul>
    <div class="nav-tools">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="search" placeholder="جستجوی محصول..." onkeydown="if(event.key==='Enter')location.href='shop.html?q='+encodeURIComponent(this.value)">
      </div>
      <button class="icon-btn" aria-label="حساب کاربری" onclick="location.href=Auth.isLoggedIn()?'account.html':'login.html'">
        ${Auth.isLoggedIn()
          ? `<span class="nav-av">${(Auth.get().name || '؟').trim().charAt(0)}</span>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>`}
      </button>
      <button class="icon-btn" aria-label="علاقه‌مندی‌ها" onclick="location.href='shop.html?filter=wish'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <button class="icon-btn" aria-label="سبد خرید" onclick="openDrawer()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L21.5 7H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
        <span class="cart-count">۰</span>
      </button>
      <button class="icon-btn burger" aria-label="منو" onclick="openMobile()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </nav>`;

  // dropdown toggle
  const drop = el.querySelector('.has-drop');
  if (drop) {
    drop.querySelector('a').addEventListener('click', e => {
      if (window.innerWidth > 960) { e.preventDefault(); drop.classList.toggle('open'); }
    });
    document.addEventListener('click', e => { if (!drop.contains(e.target)) drop.classList.remove('open'); });
  }
}

/* ---------- Footer ---------- */
function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="site-footer" id="footer">
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-about">
          <a href="index.html" class="logo">
            <span class="mark">${LOGO_MARK}</span>
            <span class="txt"><b>High Tech</b><small>ACCESSORIES</small></span>
          </a>
          <p>فروشگاه تخصصی لوازم جانبی کامپیوتر و گیمینگ. اصالت کالا، ارسال سریع و پشتیبانی واقعی — چون تجهیزات خوب، تجربه‌ی خوب می‌سازد.</p>
          <div class="socials">
            <a href="#" onclick="event.preventDefault();socialSoon('اینستاگرام')" aria-label="اینستاگرام"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
            <a href="#" onclick="event.preventDefault();socialSoon('تلگرام')" aria-label="تلگرام"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M21 4 3 11l5 2 2 6 3-4 5 3 3-14z"/><path d="m8 13 8-6-6 8"/></svg></a>
            <a href="#" onclick="event.preventDefault();socialSoon('یوتیوب')" aria-label="یوتیوب"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 5 2.5-5 2.5z" fill="currentColor"/></svg></a>
            <a href="#" onclick="event.preventDefault();socialSoon('واتساپ')" aria-label="واتساپ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.3A9 9 0 1 0 12 3z"/><path d="M8.5 9c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .5c-1-.5-1.5-1-2-2l.5-1-1-2z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>دسته‌بندی‌ها</h4>
          <ul>
            <li><a href="shop.html?cat=mouse">ماوس</a></li>
            <li><a href="shop.html?cat=keyboard">کیبورد</a></li>
            <li><a href="shop.html?cat=audio">هدست و صدا</a></li>
            <li><a href="shop.html?cat=display">مانیتور</a></li>
            <li><a href="shop.html?cat=hardware">قطعات داخلی</a></li>
          </ul>
        </div>
        <div>
          <h4>خدمات مشتریان</h4>
          <ul>
            <li><a href="account.html#orders">پیگیری سفارش</a></li>
            <li><a href="warranty.html">شرایط گارانتی</a></li>
            <li><a href="warranty.html#returns">رویه بازگشت کالا</a></li>
            <li><a href="faq.html">سوالات متداول</a></li>
            <li><a href="contact.html">تماس با ما</a></li>
          </ul>
        </div>
        <div>
          <h4>درباره High Tech</h4>
          <ul>
            <li><a href="about.html">داستان ما</a></li>
            <li><a href="about.html#values">ارزش‌های ما</a></li>
            <li><a href="about.html#jobs">فرصت‌های شغلی</a></li>
            <li><a href="index.html#blog">وبلاگ فنی</a></li>
            <li><a href="about.html#privacy">حریم خصوصی</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ۱۴۰۴ High Tech — تمامی حقوق محفوظ است.</span>
        <div class="pay"><span>پرداخت امن</span><span>درگاه بانکی</span><span>SSL</span></div>
      </div>
    </div>
  </footer>`;
}

/* ---------- Cart drawer markup ---------- */
function mountDrawer() {
  if (document.getElementById('cartDrawer')) return;
  const d = document.createElement('div');
  d.className = 'drawer'; d.id = 'cartDrawer';
  d.innerHTML = `
    <div class="backdrop" onclick="closeDrawer()"></div>
    <aside class="panel">
      <div class="drawer-head">
        <h3>سبد خرید <span class="cc" id="drawerCount">۰</span></h3>
        <button class="icon-btn" onclick="closeDrawer()" aria-label="بستن">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="drawer-body" id="drawerBody"></div>
      <div class="drawer-foot" id="drawerFoot"></div>
    </aside>`;
  document.body.appendChild(d);
}
const openDrawer = () => {
  Cart.renderDrawer();
  const c = document.getElementById('drawerCount');
  if (c) c.textContent = fmt(Cart.count());
  document.getElementById('cartDrawer')?.classList.add('open');
  document.body.classList.add('no-scroll');
};
const closeDrawer = () => {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
};

/* ---------- Mobile menu ---------- */
function mountMobile() {
  if (document.getElementById('mobileMenu')) return;
  const cats = Object.entries(CATS).map(([k, v]) => `<a href="shop.html?cat=${k}">${v.fa}</a>`).join('');
  const m = document.createElement('div');
  m.className = 'mobile-menu'; m.id = 'mobileMenu';
  m.innerHTML = `
    <div class="backdrop" onclick="closeMobile()"></div>
    <aside class="panel">
      <div class="mm-head">
        <a href="index.html" class="logo"><span class="mark">${LOGO_MARK}</span><span class="txt"><b>High Tech</b></span></a>
        <button class="icon-btn" onclick="closeMobile()" aria-label="بستن"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <nav>
        <a href="index.html">خانه</a>
        <a href="shop.html">فروشگاه</a>
        ${cats}
        <a href="shop.html?filter=sale">تخفیف‌ها</a>
        <a href="index.html#blog">وبلاگ</a>
        <a href="about.html">درباره ما</a>
        <a href="contact.html">تماس با ما</a>
        <a href="${Auth.isLoggedIn() ? 'account.html' : 'login.html'}">${Auth.isLoggedIn() ? 'حساب کاربری' : 'ورود / ثبت‌نام'}</a>
      </nav>
    </aside>`;
  document.body.appendChild(m);
}
const openMobile = () => { document.getElementById('mobileMenu')?.classList.add('open'); document.body.classList.add('no-scroll'); };
const closeMobile = () => { document.getElementById('mobileMenu')?.classList.remove('open'); document.body.classList.remove('no-scroll'); };

/* ---------- Reveal on scroll ---------- */
function observeReveal() {
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  mountDrawer();
  mountMobile();
  Cart.sync();
  Cart.renderDrawer();
  observeReveal();

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeMobile(); } });

  /* FAQ accordion (works on any page that uses .faq-item) */
  document.addEventListener('click', e => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const item = q.closest('.faq-item');
    const box = item.parentElement;
    const wasOpen = item.classList.contains('on');
    box.querySelectorAll('.faq-item.on').forEach(x => {
      x.classList.remove('on');
      const a = x.querySelector('.faq-a');
      if (a) a.style.maxHeight = '';
    });
    if (!wasOpen) {
      item.classList.add('on');
      const a = item.querySelector('.faq-a');
      if (a) a.style.maxHeight = a.scrollHeight + 'px';
    }
  });

  /* demo forms — contact page etc. */
  document.querySelectorAll('[data-demo-form]').forEach(f => {
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      toast(f.dataset.demoForm || 'ارسال شد', 'پیام شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.', 'ok');
      f.reset();
    });
  });

  if (typeof initPage === 'function') initPage();

  // deep-link: #cart opens the cart drawer
  if (location.hash === '#cart') openDrawer();
});
