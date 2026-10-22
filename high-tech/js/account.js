/* ==========================================================================
   HIGH TECH — Account dashboard
   ========================================================================== */

const AC_ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="9" r="6"/><path d="M15.5 5.3A6 6 0 1 1 15 18.7"/></svg>'
};

const AC_TABS = [
  { id: 'dashboard', label: 'داشبورد', icon: 'grid' },
  { id: 'orders', label: 'سفارش‌های من', icon: 'bag' },
  { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: 'heart' },
  { id: 'addresses', label: 'آدرس‌ها', icon: 'pin' },
  { id: 'profile', label: 'اطلاعات حساب', icon: 'user' }
];

const faDate = iso => {
  try { return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso)); }
  catch { return '—'; }
};

let ACTIVE = 'dashboard';

function initPage() {
  if (!Auth.requireLogin()) return;
  const hash = location.hash.replace('#', '');
  ACTIVE = AC_TABS.some(t => t.id === hash) ? hash : 'dashboard';
  renderAccount();
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '');
    if (AC_TABS.some(t => t.id === h)) { ACTIVE = h; renderAccount(); }
  });
}

function renderAccount() {
  const u = Auth.get();
  const orders = Orders.all();
  const wish = readJSON(WISH_KEY, []);

  /* nav */
  document.getElementById('acNav').innerHTML = `
    <div class="an-user">
      <span class="an-av">${(u.name || '؟').trim().charAt(0)}</span>
      <div><b>${u.name}</b><span>${u.email}</span></div>
    </div>
    ${AC_TABS.map(t => `<a href="#${t.id}" class="${t.id === ACTIVE ? 'on' : ''}">${AC_ICONS[t.icon]}${t.label}</a>`).join('')}
    <a href="#" class="danger" onclick="event.preventDefault();doLogout()">${AC_ICONS.logout} خروج از حساب</a>`;

  /* panels */
  document.getElementById('acPanels').innerHTML =
    panelDashboard(orders, wish) + panelOrders(orders) + panelWishlist(wish) +
    panelAddresses(orders) + panelProfile(u);

  document.querySelectorAll('.ac-panel').forEach(p => p.classList.toggle('on', p.id === 'ac-' + ACTIVE));
  observeReveal();
}

/* ---------- Dashboard ---------- */
function panelDashboard(orders, wish) {
  const spent = orders.reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 3);
  return `<div class="ac-panel" id="ac-dashboard">
    <div class="stat-cards">
      <div class="stat-card"><span class="si">${AC_ICONS.bag}</span><b>${fmt(orders.length)}</b><span>سفارش ثبت‌شده</span></div>
      <div class="stat-card"><span class="si">${AC_ICONS.heart}</span><b>${fmt(wish.length)}</b><span>محصول مورد علاقه</span></div>
      <div class="stat-card"><span class="si">${AC_ICONS.coins}</span><b>${fmt(spent)}</b><span>مجموع خرید (تومان)</span></div>
    </div>
    <div class="ac-card">
      <h3>آخرین سفارش‌ها</h3>
      ${recent.length ? recent.map(orderRow).join('')
        : `<div class="empty" style="padding:36px 16px">
             <h4>هنوز سفارشی ثبت نکردی</h4>
             <p style="margin-bottom:18px">اولین سفارشت رو ثبت کن و از تخفیف‌های ویژه بهره ببر.</p>
             <a href="shop.html" class="btn btn--primary">رفتن به فروشگاه</a>
           </div>`}
      ${orders.length > 3 ? `<a href="#orders" class="btn btn--ghost btn--block" style="margin-top:8px">مشاهده همه سفارش‌ها</a>` : ''}
    </div>
  </div>`;
}

/* ---------- Orders ---------- */
function panelOrders(orders) {
  return `<div class="ac-panel" id="ac-orders">
    <div class="ac-card">
      <h3>سفارش‌های من</h3>
      ${orders.length ? orders.map(orderRow).join('')
        : `<div class="empty" style="padding:50px 16px">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
             <h4>لیست سفارش‌ها خالیه</h4>
             <p style="margin-bottom:18px">وقتی سفارشی ثبت کنی، اینجا می‌تونی پیگیری‌اش کنی.</p>
             <a href="shop.html" class="btn btn--primary">شروع خرید</a>
           </div>`}
    </div>
  </div>`;
}

const ORDER_STATUS = {
  wait: ['badge-status--wait', 'در حال پردازش'],
  ship: ['badge-status--ship', 'در حال ارسال'],
  done: ['badge-status--ok', 'تحویل شده']
};

function orderRow(o) {
  const items = o.items.map(i => PRODUCTS.find(p => p.id === i.id)).filter(Boolean);
  const count = o.items.reduce((s, i) => s + i.qty, 0);
  const [cls, label] = ORDER_STATUS[o.status] || ORDER_STATUS.wait;
  return `<div class="order-row">
    <div class="or-thumbs">${items.slice(0, 4).map(p => `<img src="${prodImg(p)}" alt="${p.name}">`).join('')}</div>
    <div>
      <div class="or-code">${o.code}</div>
      <div class="or-meta">
        <span>${faDate(o.date)}</span>
        <span>${fmt(count)} کالا</span>
        <span>${o.shippingName}</span>
        <span>${o.paymentName}</span>
      </div>
    </div>
    <div style="text-align:left">
      <div style="font-weight:900;color:#fff;margin-bottom:8px;white-space:nowrap">${fmt(o.total)} تومان</div>
      <span class="badge-status ${cls}">${label}</span>
    </div>
  </div>`;
}

/* ---------- Wishlist ---------- */
function panelWishlist(wish) {
  const items = wish.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  return `<div class="ac-panel" id="ac-wishlist">
    <div class="ac-card">
      <h3>علاقه‌مندی‌های من</h3>
      ${items.length ? `<div class="prod-grid prod-grid--3" style="margin-top:4px">${items.map(cardHTML).join('')}</div>`
        : `<div class="empty" style="padding:50px 16px">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
             <h4>لیست علاقه‌مندی‌ها خالیه</h4>
             <p style="margin-bottom:18px">روی آیکون قلب هر محصول بزن تا اینجا ذخیره بشه.</p>
             <a href="shop.html" class="btn btn--primary">دیدن محصولات</a>
           </div>`}
    </div>
  </div>`;
}

/* ---------- Addresses ---------- */
function panelAddresses(orders) {
  const last = orders.find(o => o.address)?.address;
  return `<div class="ac-panel" id="ac-addresses">
    <div class="ac-card">
      <h3>آدرس‌های من</h3>
      ${last ? `<div class="opt-card" style="cursor:default;align-items:flex-start">
          <span class="oc-i">${AC_ICONS.pin}</span>
          <span class="oc-body">
            <b>${last.name} — ${faNum(last.phone)}</b>
            <span style="display:block;margin-top:6px;line-height:1.9">${last.province}، ${last.city}، ${last.address} — کد پستی ${faNum(last.postal)}</span>
          </span>
          <span class="chip">آدرس پیش‌فرض</span>
        </div>` : `<p style="color:var(--muted);margin-bottom:20px">هنوز آدرسی ثبت نشده. اولین سفارشت که ثبت بشه، آدرسش اینجا ذخیره می‌شه.</p>`}
    </div>
    <div class="ac-card">
      <h3>افزودن آدرس جدید</h3>
      <form data-demo-form="آدرس جدید ذخیره شد">
        <div class="form-grid form-grid--2">
          <div class="field"><label>عنوان آدرس</label><input placeholder="مثلاً خانه"></div>
          <div class="field"><label>کد پستی</label><input inputmode="numeric" placeholder="۱۰ رقم"></div>
          <div class="field" style="grid-column:1/-1"><label>نشانی کامل</label><textarea style="min-height:90px" placeholder="خیابان، کوچه، پلاک، واحد"></textarea></div>
        </div>
        <button class="btn btn--primary" type="submit" style="margin-top:18px">ذخیره آدرس</button>
      </form>
    </div>
  </div>`;
}

/* ---------- Profile ---------- */
function panelProfile(u) {
  return `<div class="ac-panel" id="ac-profile">
    <div class="ac-card">
      <h3>اطلاعات حساب</h3>
      <form id="profileForm">
        <div class="form-grid form-grid--2">
          <div class="field">
            <label>نام و نام خانوادگی <span class="req">*</span></label>
            <input id="pName" value="${u.name || ''}">
            <span class="error">نام را کامل وارد کنید.</span>
          </div>
          <div class="field">
            <label>ایمیل <span class="req">*</span></label>
            <input id="pEmail" value="${u.email || ''}" inputmode="email">
            <span class="error">ایمیل معتبر وارد کنید.</span>
          </div>
          <div class="field">
            <label>شماره موبایل</label>
            <input id="pPhone" value="${u.phone || ''}" inputmode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹">
            <span class="error">شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.</span>
          </div>
          <div class="field">
            <label>تاریخ عضویت</label>
            <input value="${faDate(u.joined)}" disabled style="opacity:.6">
          </div>
        </div>
        <button class="btn btn--primary" type="submit" style="margin-top:20px">ذخیره تغییرات</button>
      </form>
    </div>
  </div>`;
}

/* ---------- Actions ---------- */
function saveProfile(e) {
  e.preventDefault();
  const name = document.getElementById('pName');
  const email = document.getElementById('pEmail');
  const phone = document.getElementById('pPhone');
  const ok = validateForm([
    [name, V.min(name.value, 3), 'نام را کامل وارد کنید.'],
    [email, V.email(email.value), 'ایمیل معتبر وارد کنید.'],
    [phone, !phone.value.trim() || V.phone(phone.value), 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.']
  ]);
  if (!ok) return;

  const u = Auth.get();
  const updated = { ...u, name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim() };
  writeJSON(USER_KEY, updated);

  /* keep the credentials record in sync */
  const users = Auth.users().map(x => x.email === u.email
    ? { ...x, name: updated.name, email: updated.email, phone: updated.phone } : x);
  writeJSON(USERS_KEY, users);

  toast('تغییرات ذخیره شد', 'اطلاعات حساب شما به‌روز شد', 'ok');
  renderAccount();
}

function doLogout() {
  Auth.logout();
  toast('خارج شدی', 'به امید دیدار!', 'ok');
  setTimeout(() => location.href = 'index.html', 600);
}

/* profile form needs a delegated submit (re-rendered often) */
document.addEventListener('submit', e => {
  if (e.target && e.target.id === 'profileForm') saveProfile(e);
});
