/* ==========================================================================
   HIGH TECH — Cart / checkout page
   ========================================================================== */

let SHIPPING = 0;

function initPage() { renderCartPage(); }

function renderCartPage() {
  const root = document.getElementById('cartRoot');
  if (!root) return;

  if (!Cart.items.length) {
    root.innerHTML = `<div class="empty" style="padding:90px 20px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L21.5 7H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
      <h4>سبد خرید خالیه</h4>
      <p style="margin-bottom:22px">هنوز محصولی انتخاب نکردی. یه سر به فروشگاه بزن!</p>
      <a href="shop.html" class="btn btn--primary">رفتن به فروشگاه</a>
    </div>`;
    return;
  }

  const sub = Cart.subtotal();
  const sav = Cart.savings();
  SHIPPING = sub >= 2000000 || sub === 0 ? 0 : 89000;
  const total = sub + SHIPPING;

  root.innerHTML = `
  <div class="cart-layout">
    <div class="cart-list">
      <div class="toolbar">
        <span class="res"><b>${fmt(Cart.count())}</b> کالا در سبد شما</span>
        <button class="btn btn--ghost btn--sm" onclick="if(confirm('سبد خرید خالی شود؟')){Cart.clear();}">خالی کردن سبد</button>
      </div>
      ${Cart.items.map(i => {
        const p = PRODUCTS.find(x => x.id === i.id);
        if (!p) return '';
        return `<div class="citem">
          <a href="product.html?id=${p.id}" class="ci-media"><img src="${prodImg(p)}" alt="${p.name}" loading="lazy"></a>
          <div class="ci-info">
            <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
            <div style="font-size:.82rem;color:var(--muted)">${p.brand} • ${CATS[p.cat].fa}</div>
            <div class="p" style="margin-top:8px">${fmt(p.price)} <small>${TOMAN}</small>
              ${p.old ? `<small style="text-decoration:line-through;color:var(--muted-2);margin-inline-start:8px">${fmt(p.old)}</small>` : ''}
            </div>
            <div class="ci-row">
              <div class="qty-mini">
                <button onclick="Cart.setQty('${p.id}',${i.qty - 1})">−</button>
                <span>${fmt(i.qty)}</span>
                <button onclick="Cart.setQty('${p.id}',${i.qty + 1})">+</button>
              </div>
              <div style="display:flex;align-items:center;gap:16px">
                <b style="color:#fff">${fmt(p.price * i.qty)} <small style="font-size:.7rem;color:var(--muted)">${TOMAN}</small></b>
                <button class="ci-remove" onclick="Cart.remove('${p.id}')" aria-label="حذف">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('')}
      <a href="shop.html" class="btn btn--ghost" style="margin-top:10px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
        ادامه خرید
      </a>
    </div>

    <aside class="summary">
      <h3>خلاصه سفارش</h3>
      <div class="sum-row"><span>جمع کالاها</span><span>${fmt(sub)} ${TOMAN}</span></div>
      ${sav > 0 ? `<div class="sum-row" style="color:#4ade80"><span>سود شما از تخفیف</span><span>${fmt(sav)} ${TOMAN}</span></div>` : ''}
      <div class="sum-row"><span>هزینه ارسال</span><span>${SHIPPING ? fmt(SHIPPING) + ' ' + TOMAN : 'رایگان'}</span></div>
      ${SHIPPING ? `<div style="font-size:.8rem;color:var(--amber);margin-bottom:8px">با خرید ${fmt(2000000 - sub)} تومان بیشتر، ارسال رایگان می‌شود.</div>` : ''}
      <div class="sum-row total"><span>قابل پرداخت</span><span>${fmt(total)} ${TOMAN}</span></div>

      <div class="coupon">
        <input id="couponInput" placeholder="کد تخفیف (مثلاً HIGH10)">
        <button class="btn btn--dark btn--sm" onclick="applyCoupon()">اعمال</button>
      </div>

      <h4 style="font-size:.92rem;margin:18px 0 0;color:var(--muted)">روش پرداخت</h4>
      <div class="pay-methods">
        <label><input type="radio" name="pay" checked> پرداخت آنلاین با کارت بانکی</label>
        <label><input type="radio" name="pay"> پرداخت در محل (فقط تهران)</label>
      </div>

      <a href="checkout.html" class="btn btn--primary btn--block" style="margin-top:22px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>
        ادامه و تسویه حساب
      </a>
      <p style="font-size:.78rem;color:var(--muted);text-align:center;margin-top:14px">پرداخت شما از طریق درگاه امن انجام می‌شود 🔒</p>
    </aside>
  </div>`;
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (code === 'HIGH10') { toast('کد تخفیف اعمال شد', '۱۰٪ تخفیف روی کل سفارش', 'ok'); }
  else if (code) { toast('کد تخفیف نامعتبر', 'این کد معتبر نیست', 'ok'); }
}
