// src/crawler/loopnet.playwright.ts
import { chromium, Page } from 'playwright';
import axios from 'axios';

const BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const CITY = (process.env.CITY || 'raleigh').toLowerCase();
const STATE = (process.env.STATE || 'NC').toLowerCase();
const URL = `https://www.loopnet.com/search/apartments-for-sale/${CITY}-${STATE}/`;

function parsePrice(text?: string) {
  if (!text) return 0;
  const s = text.replace(/[\s$,]/g, '')
    .replace(/(\d+(?:\.\d+)?)M$/i, (_, m) => String(Math.round(parseFloat(m) * 1_000_000)))
    .replace(/(\d+(?:\.\d+)?)K$/i, (_, k) => String(Math.round(parseFloat(k) * 1_000)));
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

async function gotoWithRetry(page: Page, url: string, tries = 4) {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      const resp = await page.goto(url, { waitUntil: 'commit', timeout: 90_000 });
      if (resp && resp.status() >= 400) throw new Error(`HTTP ${resp.status()} at ${url}`);
      // Wait for a real element that denotes results are present
      await page.waitForSelector('[data-test="result-list"] article, article[class*="Placard"]', { timeout: 90_000 });
      return;
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function scrape() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-http2', // key for HTTP/2 flakiness
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1366,768',
    ],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.loopnet.com/',
    },
  });

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(120_000);
  page.setDefaultTimeout(120_000);

  // Block heavy assets
  await page.route(/\.(png|jpe?g|gif|svg|css|woff2?|mp4)$/i, r => r.abort());

  try {
    await gotoWithRetry(page, URL, 4);

    // Handle cookie/consent banners if they appear
    const cookieSelectors = [
      'button:has-text("Accept All")',
      'button:has-text("I Accept")',
      'button[aria-label*="accept"]',
    ];
    for (const sel of cookieSelectors) {
      const btn = await page.$(sel).catch(() => null);
      if (btn) { await btn.click({ timeout: 2000 }).catch(() => {}); break; }
    }

    // Lazy loading: scroll
    await page.evaluate(() => new Promise<void>(resolve => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy(0, 1200);
        y += 1200;
        if (y > 9000) { clearInterval(t); resolve(); }
      }, 200);
    }));

    const items = await page.evaluate(() => {
      const out: any[] = [];
      const cards = document.querySelectorAll('[data-test="result-list"] article, article[class*="Placard"]');
      cards.forEach((c: any) => {
        const title = (c.querySelector('h2, h3')?.textContent || '').trim();
        const price = (c.querySelector('[data-test="price"], [class*="Price"]')?.textContent || '').trim();
        const address = (c.querySelector('[data-test="address"], [class*="Address"]')?.textContent || '').trim();
        if (title && address) out.push({ title, price, address });
      });
      return out;
    });

    return items;
  } finally {
    await browser.close();
  }
}

export async function pushToAPI(items: any[]) {
  for (const r of items) {
    try {
      await axios.post(`${BASE}/deals`, {
        source: 'loopnet',
        title: r.title,
        address: r.address,
        city: CITY.charAt(0).toUpperCase() + CITY.slice(1),
        state: STATE.toUpperCase(),
        price: parsePrice(r.price),
      });
      console.log('✅ Added:', r.title);
    } catch (e: any) {
      console.error('❌ Failed:', r.title, e?.response?.status || e.message);
    }
  }
}

if (require.main === module) {
  (async () => {
    try {
      const items = await scrape();
      console.log(`Found ${items.length} listings`);
      await pushToAPI(items);
      console.log('✅ LoopNet crawl complete.');
    } catch (e: any) {
      console.error('Crawler error:', e.message || e);
      process.exit(1);
    }
  })();
}
