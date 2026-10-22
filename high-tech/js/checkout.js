/* ==========================================================================
   HIGH TECH — Checkout (3 steps) — demo, no real payment gateway
   ========================================================================== */

const CO = {
  step: 1,
  shipping: 'post',
  payment: 'online'
};

const PROVINCES = ['تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'آذربایجان غربی', 'گیلان', 'مازندران', 'خوزستان', 'کرمان', 'قم', 'یزد', 'کرمانشاه', 'هرمزگان'];

const SHIP = [
  { id: 'post', name: 'پست پیشتاز', desc: 'تحویل ۳ تا ۵ روز کاری', price: 45000, icon: 'truck' },
  { id: 'tipax', name: 'تیپاکس', desc: 'تحویل ۱ تا ۲ روز کاری', price: 89000, icon: 'bolt' },
  { id: 'pickup', name: 'تحویل حضوری', desc: 'دریافت از فروشگاه — تهران', price: 0, icon: 'store' }
];

const PAY = [
  { id: 'online', name: 'پرداخت آنلاین', desc: 'کارت بانکی — درگاه امن شاپرک', icon: 'card' },
  { id: 'cod', name: 'پرداخت در محل', desc: 'فقط برای تهران و کرج', icon: 'cash' }
];

const ICO = {
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/></svg>'
};

let LAST_ORDER = null;

const subTotal = () => Cart.subtotal();
const shipCost = () => {
  const s = SHIP.find(x => x.id === CO.shipping);
  if (!s) return 0;
  if (s.id === 'post' && subTotal() >= 2000000) return 0;
  return s.price;
};
const grandTotal = () => subTotal() + shipCost();

/* ---------- HTML blocks ---------- */
function stepperHTML() {
  const steps = [['۱', 'اطلاعات گیرنده'], ['۲', 'روش ارسال'], ['۳', 'پرداخت']];
  return `<div class="stepper">${steps.map(([n, l], i) => {
    const k = i + 1;
    return `<div class="step ${CO.step === k ? 'on' : ''} ${CO.step > k ? 'done' : ''}" data-step="${k}">
      <span class="num">${CO.step > k ? '✓' : n}</span><span class="lbl">${l}</span>
      ${k < 3 ? '<span class="bar"></span>' : ''}
    </div>`;
  }).join('')}</div>`;
}

function optCardsHTML(list, selected, type) {
  return `<div class="opt-cards">${list.map(o => `
    <label class="opt-card ${o.id === selected ? 'on' : ''}" onclick="selectOpt('${type}','${o.id}')">
      <input type="radio" name="${type}" ${o.id === selected ? 'checked' : ''}>
      <span class="oc-i">${ICO[o.icon]}</span>
      <span class="oc-body"><b>${o.name}</b><span>${o.desc}</span></span>
      <span class="oc-price">${type === 'ship'
        ? (o.price === 0 ? 'رایگان' : fmt(o.price) + ' تومان')
        : ''}</span>
    </label>`).join('')}</div>`;
}

function summaryHTML() {
  const st = subTotal(), sh = shipCost(), sav = Cart.savings();
  return `
    <div class="co-panel">
      <h3>${ICO.bag} خلاصه سفارش</h3>
      <div class="order-mini">
        ${Cart.items.map(i => {
          const p = PRODUCTS.find(x => x.id === i.id);
          if (!p) return '';
          return `<div class="omi">
            <img src="${prodImg(p)}" alt="${p.name}">
            <div class="oi-body"><h5>${p.name}</h5><span>${fmt(i.qty)} عدد</span></div>
            <b>${fmt(p.price * i.qty)}</b>
          </div>`;
        }).join('')}
      </div>
      <div class="sum-box">
        <div class="sum-row"><span>جمع کالاها</span><span>${fmt(st)} تومان</span></div>
        ${sav > 0 ? `<div class="sum-row" style="color:#4ade80"><span>سود شما</span><span>${fmt(sav)} تومان</span></div>` : ''}
        <div class="sum-row"><span>هزینه ارسال</span><span>${sh ? fmt(sh) + ' تومان' : 'رایگان'}</span></div>
        <div class="sum-row total"><span>قابل پرداخت</span><span>${fmt(grandTotal())} تومان</span></div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--line);font-size:.8rem;color:var(--muted)">
        <span style="width:30px;height:30px;display:grid;place-items:center;flex:none;color:var(--brand-2)">${ICO.shield}</span>
        پرداخت شما از طریق درگاه امن انجام می‌شود
      </div>
    </div>`;
}

function renderSummary() {
  const el = document.getElementById('coSummary');
  if (el) el.innerHTML = summaryHTML();
}

/* ---------- Main render ---------- */
function renderCheckout() {
  const root = document.getElementById('checkoutRoot');
  if (!root) return;

  if (LAST_ORDER) { root.innerHTML = successHTML(); window.scrollTo(0, 0); return; }

  if (!Cart.items.length) {
    root.innerHTML = `<div class="empty" style="padding:90px 20px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L21.5 7H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
      <h4>سبد خرید خالیه</h4>
      <p style="margin-bottom:22px">برای تسویه حساب اول باید محصولی انتخاب کنی.</p>
      <a href="shop.html" class="btn btn--primary">رفتن به فروشگاه</a>
    </div>`;
    return;
  }

  const u = Auth.get() || {};
  const parts = (u.name || '').trim().split(' ');
  const preFirst = parts[0] || '';
  const preLast = parts.slice(1).join(' ') || '';

  root.innerHTML = `
    ${stepperHTML()}
    <div class="checkout-layout">
      <div>
        <div class="co-step ${CO.step === 1 ? 'on' : ''}" id="coStep1">
          <div class="co-panel">
            <h3>${ICO.user} اطلاعات گیرنده</h3>
            <div class="form-grid form-grid--2">
              <div class="field">
                <label>نام <span class="req">*</span></label>
                <input id="fFirst" value="${preFirst}" placeholder="مثلاً محمد">
                <span class="error">نام را وارد کنید.</span>
              </div>
              <div class="field">
                <label>نام خانوادگی <span class="req">*</span></label>
                <input id="fLast" value="${preLast}" placeholder="مثلاً رضایی">
                <span class="error">نام خانوادگی را وارد کنید.</span>
              </div>
              <div class="field">
                <label>شماره موبایل <span class="req">*</span></label>
                <input id="fPhone" value="${u.phone || ''}" inputmode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹">
                <span class="error">شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.</span>
              </div>
              <div class="field">
                <label>ایمیل <span class="hint">(اختیاری)</span></label>
                <input id="fEmail" value="${u.email || ''}" inputmode="email" placeholder="you@example.com">
                <span class="error">ایمیل معتبر نیست.</span>
              </div>
              <div class="field">
                <label>استان <span class="req">*</span></label>
                <select id="fProvince">
                  <option value="">انتخاب کنید…</option>
                  ${PROVINCES.map(p => `<option ${u.province === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
                <span class="error">استان را انتخاب کنید.</span>
              </div>
              <div class="field">
                <label>شهر <span class="req">*</span></label>
                <input id="fCity" value="${u.city || ''}" placeholder="مثلاً تهران">
                <span class="error">شهر را وارد کنید.</span>
              </div>
              <div class="field" style="grid-column:1/-1">
                <label>نشانی کامل <span class="req">*</span></label>
                <textarea id="fAddress" style="min-height:96px" placeholder="خیابان، کوچه، پلاک، واحد">${u.address || ''}</textarea>
                <span class="error">نشانی را کامل‌تر وارد کنید (حداقل ۱۰ کاراکتر).</span>
              </div>
              <div class="field">
                <label>کد پستی <span class="req">*</span></label>
                <input id="fPostal" value="${u.postal || ''}" inputmode="numeric" placeholder="۱۰ رقم">
                <span class="error">کد پستی باید ۱۰ رقم باشد.</span>
              </div>
            </div>
            <div class="co-actions">
              <a href="cart.html" class="btn btn--ghost">بازگشت به سبد</a>
              <button class="btn btn--primary" onclick="goStep(2)">ادامه — روش ارسال</button>
            </div>
          </div>
        </div>

        <div class="co-step ${CO.step === 2 ? 'on' : ''}" id="coStep2">
          <div class="co-panel">
            <h3>${ICO.truck} روش ارسال</h3>
            <div id="shipBox">${optCardsHTML(SHIP, CO.shipping, 'ship')}</div>
            ${subTotal() >= 2000000 ? `<p class="hint" style="margin-top:14px;font-size:.82rem;color:#4ade80">🎉 خرید شما بالای ۲ میلیون تومان است — ارسال با پست پیشتاز رایگان شد.</p>` : ''}
            <div class="co-actions">
              <button class="btn btn--ghost" onclick="goStep(1)">مرحله قبل</button>
              <button class="btn btn--primary" onclick="goStep(3)">ادامه — پرداخت</button>
            </div>
          </div>
        </div>

        <div class="co-step ${CO.step === 3 ? 'on' : ''}" id="coStep3">
          <div class="co-panel">
            <h3>${ICO.card} روش پرداخت</h3>
            <div id="payBox">${optCardsHTML(PAY, CO.payment, 'pay')}</div>
            <div style="margin-top:22px;padding-top:20px;border-top:1px solid var(--line)">
              <label class="check-row" id="termsRow">
                <input type="checkbox" id="fTerms">
                <span>قوانین و شرایط فروش High Tech را مطالعه کرده و می‌پذیرم.</span>
              </label>
              <span class="error" id="termsErr" style="display:none;font-size:.78rem;color:#fca5a5;margin-top:8px">برای ثبت سفارش باید قوانین را بپذیرید.</span>
            </div>
            <div class="co-actions">
              <button class="btn btn--ghost" onclick="goStep(2)">مرحله قبل</button>
              <button class="btn btn--primary" onclick="placeOrder()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                ثبت نهایی سفارش
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="coSummary">${summaryHTML()}</div>
    </div>`;

  /* clear the error style as soon as the user types */
  root.querySelectorAll('.field input,.field select,.field textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.field')?.classList.remove('has-err'));
    el.addEventListener('change', () => el.closest('.field')?.classList.remove('has-err'));
  });
}

/* ---------- Step navigation ---------- */
function goStep(n) {
  if (n > CO.step && !validateStep(CO.step)) return;
  CO.step = n;
  document.querySelectorAll('.co-step').forEach((el, i) => el.classList.toggle('on', i + 1 === n));
  document.querySelectorAll('.stepper .step').forEach(el => {
    const k = +el.dataset.step;
    el.classList.toggle('on', k === n);
    el.classList.toggle('done', k < n);
    const num = el.querySelector('.num');
    num.textContent = k < n ? '✓' : ['۱', '۲', '۳'][k - 1];
  });
  renderSummary();
  window.scrollTo({ top: document.querySelector('.stepper')?.offsetTop - 120 || 0, behavior: 'smooth' });
}

function validateStep(step) {
  if (step !== 1) return true;
  const g = id => document.getElementById(id);
  let ok = true;
  const check = (el, test, msg) => { if (!markField(el, test, msg)) ok = false; };

  check(g('fFirst'), V.min(g('fFirst').value, 2), 'نام را کامل وارد کنید.');
  check(g('fLast'), V.min(g('fLast').value, 2), 'نام خانوادگی را کامل وارد کنید.');
  check(g('fPhone'), V.phone(g('fPhone').value), 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
  check(g('fEmail'), !g('fEmail').value.trim() || V.email(g('fEmail').value), 'ایمیل معتبر نیست.');
  check(g('fProvince'), V.required(g('fProvince').value), 'استان را انتخاب کنید.');
  check(g('fCity'), V.min(g('fCity').value, 2), 'شهر را وارد کنید.');
  check(g('fAddress'), V.min(g('fAddress').value, 10), 'نشانی را کامل‌تر وارد کنید (حداقل ۱۰ کاراکتر).');
  check(g('fPostal'), V.postal(g('fPostal').value), 'کد پستی باید ۱۰ رقم باشد.');

  if (!ok) {
    const bad = document.querySelector('.co-step.on .field.has-err');
    bad?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

function selectOpt(type, id) {
  if (type === 'ship') CO.shipping = id; else CO.payment = id;
  const list = type === 'ship' ? SHIP : PAY;
  const box = document.getElementById(type === 'ship' ? 'shipBox' : 'payBox');
  if (box) box.innerHTML = optCardsHTML(list, id, type);
  renderSummary();
}

/* ---------- Place order ---------- */
function placeOrder() {
  const terms = document.getElementById('fTerms');
  const err = document.getElementById('termsErr');
  if (!terms.checked) { err.style.display = 'block'; terms.focus(); return; }
  err.style.display = 'none';

  const g = id => document.getElementById(id).value.trim();
  const ship = SHIP.find(x => x.id === CO.shipping);
  const pay = PAY.find(x => x.id === CO.payment);

  LAST_ORDER = {
    code: Orders.code(),
    date: new Date().toISOString(),
    items: Cart.items.map(i => ({ id: i.id, qty: i.qty })),
    subtotal: subTotal(),
    shipping: shipCost(),
    shippingName: ship.name,
    paymentName: pay.name,
    total: grandTotal(),
    status: 'wait',
    address: {
      name: g('fFirst') + ' ' + g('fLast'),
      phone: g('fPhone'), email: g('fEmail'),
      province: g('fProvince'), city: g('fCity'),
      address: g('fAddress'), postal: g('fPostal')
    }
  };

  Orders.add(LAST_ORDER);
  Cart.clear();
  renderCheckout();
  toast('سفارش ثبت شد', 'کد رهگیری: ' + LAST_ORDER.code, 'ok');
}

/* ---------- Success ---------- */
function successHTML() {
  const o = LAST_ORDER;
  const count = o.items.reduce((s, i) => s + i.qty, 0);
  return `<div class="success-screen">
    <div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
    <h1 class="h-lg">سفارش شما ثبت شد!</h1>
    <p>ممنون از خریدت. جزئیات سفارش به شماره <b style="color:#fff">${faNum(o.address.phone)}</b> پیامک شد و همکاران ما به‌زودی تماس می‌گیرند.</p>
    <div class="order-code"><span>کد رهگیری سفارش</span><b>${o.code}</b></div>
    <div class="co-panel" style="text-align:right;margin-bottom:30px">
      <div class="sum-row"><span>تعداد کالا</span><span>${fmt(count)} عدد</span></div>
      <div class="sum-row"><span>روش ارسال</span><span>${o.shippingName}</span></div>
      <div class="sum-row"><span>روش پرداخت</span><span>${o.paymentName}</span></div>
      <div class="sum-row"><span>گیرنده</span><span>${o.address.name} — ${o.address.city}</span></div>
      <div class="sum-row total"><span>مبلغ کل</span><span>${fmt(o.total)} تومان</span></div>
    </div>
    <div class="success-actions">
      <a href="account.html#orders" class="btn btn--primary">مشاهده سفارش‌های من</a>
      <a href="shop.html" class="btn btn--ghost">ادامه خرید</a>
    </div>
  </div>`;
}

function initPage() { renderCheckout(); }
