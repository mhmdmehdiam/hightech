# حافظه‌ی بلندمدت پروژه

## پروژه
- **high-tech-next** — فروشگاه اینترنتی Next.js 16 (App Router, Turbopack)،
  React 19، TypeScript 5، رابط فارسی/RTL.
- مسیر: `D:\پروژه دانشگاه\high-tech-next`
- نسخه‌ی قدیمی استاتیک هم هست: `D:\پروژه دانشگاه\high-tech` (HTML/JS).
- دیتابیس: SQLite با `node:sqlite` (experimental) در `data/hightech.db`.
  جدول‌ها: products, posts, orders, settings, categories, users, meta.

## دستورات
- dev: `npm run dev` → `http://localhost:3000`
- typecheck: `./node_modules/typescript/bin/tsc --noEmit`
- build: `npm run build`

## ⚠️ قواعد حیاتی
1. **بعد از `npm run build`، قبل از `next dev` حتماً `.next` را پاک کن.**
   آرتیفکت‌های پروداکشن در `.next` می‌مانند و dev بعدی را قاطی می‌کنند →
   خطاهای hydration جعلی که تقصیر سورس نیستند. (`rm -rf .next`)
2. **ورود ادمین:** `admin` / `hightech1404` (`DEFAULT_ADMIN` در `lib/db.ts`).
3. **قرارداد پروژه:** روی روت‌های داینامیک `export const instant = false;`
   گذاشته می‌شود (همه‌ی صفحات ادمین و اکثر APIها).
4. **`next.config.ts`:** `cacheComponents: true`, `partialPrefetching: true`,
   `reactCompiler: true`, `allowedDevOrigins: ['127.0.0.1','localhost']`.
   `cacheComponents` یعنی Next سعی می‌کند prerender کند و روی مقادیر ناپایدار
   (`Date.now()`, `Math.random()`) خطا می‌دهد. هر روت سشن‌خوان باید
   `await connection()` یا `unstable_noStore()` داشته باشد.
5. **`lib/api.ts`** هِلپرهای اعتبارسنجی دارد: `readJsonBody`, `str`, `num`,
   `isPlainObject`, `isStringArray`. هر API جدید باید از اینها استفاده کند —
   `body: Partial<T>` فقط یک ادعاست، نه بررسی.
6. **سرویسورکر (`public/sw.js`) فقط در پروداکشن ثبت میشود**
   (`components/PwaRegister.tsx`). در dev، Turbopack چانکها را با URL پایدار
   از `/_next/static/` سرو میکند و کشِ cache-first یعنی مرورگر همان باندل
   اولیه را برای همیشه اجرا میکند: تغییر سورس اثر نمیکرد و خطای hydration
   با رفرش از بین نمیرفت. اگر چنین نشانههایی دیدی، اول SW و کش را چک کن.

## ابزارهای تست (در `scripts/`)
- `fuzz-api.mjs` — ۳۶۰ درخواست خرابکارانه؛ **خودش ردیف‌های ساخته‌شده را پاک می‌کند**.
- `audit-errors.mjs` — ۱۵ روت × خطای کنسول/pageerror/درخواست ناموفق.
- `check-hydration.mjs` — عدم تطابق hydration. (روت `/` را با `checked=0`
  «PASS» می‌کند؛ به تیک سبز آن برای `/` تکیه نکن.)
- `sweep.mjs` — ۹۸ ترکیب ویوپورت.
- `db-stats.mjs` — آمار جدول‌ها.
- لاگ dev: `.next/dev/logs/next-development.log` — timestampها **نسبی**اند
  (از لحظه‌ی بوت)، نه ساعت دیوار.

## محیط
- Git Bash: آرگومان `/` به مسیر ویندوز تبدیل می‌شود. `curl` باید
  `--noproxy '*'` داشته باشد. `/tmp` کار نمی‌کند — فایل موقت را داخل پروژه بساز.
- Playwright: `playwright-core` + `channel: 'msedge'`.
