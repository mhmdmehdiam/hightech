/* ==========================================================================
   HIGH TECH — Login / Register  (demo auth, localStorage only)
   ========================================================================== */

let NEXT_URL = 'account.html';

function initPage() {
  const params = new URLSearchParams(location.search);
  if (params.get('next')) NEXT_URL = params.get('next');

  /* already signed in? go straight through */
  if (Auth.isLoggedIn()) {
    location.replace(NEXT_URL);
    return;
  }

  /* tabs */
  document.querySelectorAll('.auth-tabs button').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /* clear error styling while typing */
  document.querySelectorAll('.auth-form .field input').forEach(el => {
    el.addEventListener('input', () => el.closest('.field')?.classList.remove('has-err'));
  });

  document.getElementById('formLogin').addEventListener('submit', doLogin);
  document.getElementById('formRegister').addEventListener('submit', doRegister);
}

function switchTab(tab) {
  document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  document.getElementById('formLogin').classList.toggle('on', tab === 'login');
  document.getElementById('formRegister').classList.toggle('on', tab === 'register');
  document.getElementById('authTitle').textContent = tab === 'login' ? 'خوش برگشتی' : 'حساب تازه بساز';
  document.getElementById('authSub').textContent = tab === 'login'
    ? 'برای پیگیری سفارش‌ها و ذخیره‌ی علاقه‌مندی‌ها وارد شو.'
    : 'با ثبت‌نام، سفارش‌هایت را پیگیری کن و علاقه‌مندی‌هایت را ذخیره کن.';
  hideAlerts();
}

function showErr(msg) {
  document.getElementById('authAlertMsg').textContent = msg;
  document.getElementById('authAlert').classList.add('show');
  document.getElementById('authOk').classList.remove('show');
  document.querySelector('.auth-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function showOk(msg) {
  document.getElementById('authOkMsg').textContent = msg;
  document.getElementById('authOk').classList.add('show');
  document.getElementById('authAlert').classList.remove('show');
}
function hideAlerts() {
  document.getElementById('authAlert').classList.remove('show');
  document.getElementById('authOk').classList.remove('show');
}

function doLogin(e) {
  e.preventDefault();
  hideAlerts();
  const email = document.getElementById('lEmail');
  const pass = document.getElementById('lPass');

  const ok = validateForm([
    [email, V.email(email.value), 'ایمیل معتبر وارد کنید.'],
    [pass, V.min(pass.value, 1), 'رمز عبور را وارد کنید.']
  ]);
  if (!ok) return;

  const res = Auth.login(email.value.trim(), pass.value);
  if (!res.ok) { showErr(res.msg); return; }

  showOk('ورود موفق! در حال انتقال…');
  setTimeout(() => location.href = NEXT_URL, 700);
}

function doRegister(e) {
  e.preventDefault();
  hideAlerts();
  const name = document.getElementById('rName');
  const email = document.getElementById('rEmail');
  const phone = document.getElementById('rPhone');
  const pass = document.getElementById('rPass');
  const pass2 = document.getElementById('rPass2');
  const terms = document.getElementById('rTerms');
  const termsErr = document.getElementById('termsErr');

  let ok = validateForm([
    [name, V.min(name.value, 3), 'نام را کامل وارد کنید.'],
    [email, V.email(email.value), 'ایمیل معتبر وارد کنید.'],
    [phone, !phone.value.trim() || V.phone(phone.value), 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'],
    [pass, V.min(pass.value, 6), 'رمز عبور باید حداقل ۶ کاراکتر باشد.'],
    [pass2, pass2.value === pass.value && V.min(pass2.value, 6), 'تکرار رمز عبور یکسان نیست.']
  ]);

  if (!terms.checked) { termsErr.style.display = 'block'; ok = false; }
  else termsErr.style.display = 'none';

  if (!ok) return;

  const res = Auth.register({
    name: name.value.trim(),
    email: email.value.trim(),
    password: pass.value,
    phone: phone.value.trim()
  });
  if (!res.ok) { showErr(res.msg); return; }

  showOk('حساب ساخته شد! خوش آمدی 🎉');
  setTimeout(() => location.href = NEXT_URL, 900);
}
