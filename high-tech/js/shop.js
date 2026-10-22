/* ==========================================================================
   HIGH TECH — Shop page (filters / sort / search)
   ========================================================================== */

const ShopState = {
  cats: new Set(),
  brands: new Set(),
  maxPrice: 45000000,
  minRating: 0,
  q: '',
  filter: '',
  sort: 'pop'
};

function initPage() {
  const params = new URLSearchParams(location.search);
  if (params.get('cat')) ShopState.cats.add(params.get('cat'));
  if (params.get('q')) ShopState.q = params.get('q').trim();
  if (params.get('filter')) ShopState.filter = params.get('filter');

  buildFilters();
  applyShop();
}

function buildFilters() {
  /* Category list */
  const catBox = document.getElementById('catFilter');
  catBox.innerHTML = Object.entries(CATS).map(([k, v]) => {
    const n = PRODUCTS.filter(p => p.cat === k).length;
    return `<label><input type="checkbox" value="${k}" ${ShopState.cats.has(k) ? 'checked' : ''}
      onchange="toggleCat(this)"> ${v.fa}<span class="cnt">${fmt(n)}</span></label>`;
  }).join('');

  /* Brand list */
  const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
  document.getElementById('brandFilter').innerHTML = brands.map(b => {
    const n = PRODUCTS.filter(p => p.brand === b).length;
    return `<label><input type="checkbox" value="${b}" ${ShopState.brands.has(b) ? 'checked' : ''}
      onchange="toggleBrand(this)"> ${b}<span class="cnt">${fmt(n)}</span></label>`;
  }).join('');

  /* Rating */
  document.getElementById('rateFilter').innerHTML = [4.5, 4, 3].map(r =>
    `<label><input type="radio" name="rate" value="${r}" ${ShopState.minRating === r ? 'checked' : ''}
      onchange="setRating(${r})"> <span class="stars">${STARS(r)}</span> و بالاتر</label>`).join('');

  /* Price */
  const pr = document.getElementById('priceRange');
  pr.addEventListener('input', () => {
    ShopState.maxPrice = +pr.value;
    document.getElementById('priceLabel').textContent = `تا ${fmt(+pr.value)} تومان`;
    applyShop();
  });

  document.getElementById('sortSelect').addEventListener('change', e => { ShopState.sort = e.target.value; applyShop(); });
}

function toggleCat(el) { el.checked ? ShopState.cats.add(el.value) : ShopState.cats.delete(el.value); applyShop(); }
function toggleBrand(el) { el.checked ? ShopState.brands.add(el.value) : ShopState.brands.delete(el.value); applyShop(); }
function setRating(r) { ShopState.minRating = ShopState.minRating === r ? 0 : r; applyShop(); }

function resetFilters() {
  ShopState.cats.clear(); ShopState.brands.clear();
  ShopState.maxPrice = 45000000; ShopState.minRating = 0; ShopState.q = ''; ShopState.filter = '';
  document.querySelectorAll('#catFilter input, #brandFilter input').forEach(i => i.checked = false);
  document.querySelectorAll('#rateFilter input').forEach(i => i.checked = false);
  const pr = document.getElementById('priceRange'); pr.value = pr.max;
  document.getElementById('priceLabel').textContent = 'تا ۴۵٬۰۰۰٬۰۰۰ تومان';
  document.getElementById('sortSelect').value = 'pop';
  ShopState.sort = 'pop';
  applyShop();
}

function removeFilter(type, val) {
  if (type === 'cat') { ShopState.cats.delete(val); document.querySelector(`#catFilter input[value="${val}"]`).checked = false; }
  if (type === 'brand') { ShopState.brands.delete(val); document.querySelector(`#brandFilter input[value="${val}"]`).checked = false; }
  if (type === 'q') ShopState.q = '';
  if (type === 'filter') ShopState.filter = '';
  if (type === 'price') { ShopState.maxPrice = 45000000; const pr = document.getElementById('priceRange'); pr.value = pr.max; document.getElementById('priceLabel').textContent = 'تا ۴۵٬۰۰۰٬۰۰۰ تومان'; }
  applyShop();
}

function applyShop() {
  const wish = readJSON(WISH_KEY, []);
  let list = PRODUCTS.slice();

  if (ShopState.cats.size) list = list.filter(p => ShopState.cats.has(p.cat));
  if (ShopState.brands.size) list = list.filter(p => ShopState.brands.has(p.brand));
  list = list.filter(p => p.price <= ShopState.maxPrice);
  if (ShopState.minRating) list = list.filter(p => p.rating >= ShopState.minRating);
  if (ShopState.filter === 'sale') list = list.filter(p => p.old);
  if (ShopState.filter === 'wish') list = list.filter(p => wish.includes(p.id));
  if (ShopState.q) {
    const q = ShopState.q.toLowerCase();
    list = list.filter(p => (p.name + ' ' + p.brand + ' ' + CATS[p.cat].fa).toLowerCase().includes(q));
  }

  switch (ShopState.sort) {
    case 'cheap': list.sort((a, b) => a.price - b.price); break;
    case 'expensive': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'off': list.sort((a, b) => (b.old ? 1 - b.price / b.old : 0) - (a.old ? 1 - a.price / a.old : 0)); break;
    case 'new': list.sort((a, b) => (b.badge === 'new') - (a.badge === 'new')); break;
    default: list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  }

  /* Grid */
  const grid = document.getElementById('shopGrid');
  const empty = document.getElementById('shopEmpty');
  grid.innerHTML = list.map(cardHTML).join('');
  empty.style.display = list.length ? 'none' : 'block';

  /* Result count */
  document.getElementById('resultCount').innerHTML = `<b>${fmt(list.length)}</b> محصول پیدا شد`;

  /* Active filter chips */
  const chips = [];
  ShopState.cats.forEach(c => chips.push(['cat', c, CATS[c].fa]));
  ShopState.brands.forEach(b => chips.push(['brand', b, b]));
  if (ShopState.q) chips.push(['q', '', `جستجو: ${ShopState.q}`]);
  if (ShopState.filter === 'sale') chips.push(['filter', '', 'تخفیف‌دار']);
  if (ShopState.filter === 'wish') chips.push(['filter', '', 'علاقه‌مندی‌ها']);
  if (ShopState.maxPrice < 45000000) chips.push(['price', '', `تا ${fmt(ShopState.maxPrice)} تومان`]);

  document.getElementById('activeFilters').innerHTML = chips.map(([t, v, label]) =>
    `<span class="af">${label}
      <button onclick="removeFilter('${t}','${v}')" aria-label="حذف فیلتر">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button></span>`).join('');

  observeReveal();
}
