"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = scrape;
exports.pushToAPI = pushToAPI;
const playwright_1 = require("playwright");
const axios_1 = require("axios");
const BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const CITY = (process.env.CITY || 'raleigh').toLowerCase();
const STATE = (process.env.STATE || 'NC').toLowerCase();
const URL = `https://www.loopnet.com/search/apartments-for-sale/${CITY}-${STATE}/`;
function parsePrice(text) {
    if (!text)
        return 0;
    const s = text.replace(/[\s$,]/g, '')
        .replace(/(\d+(?:\.\d+)?)M$/i, (_, m) => String(Math.round(parseFloat(m) * 1000000)))
        .replace(/(\d+(?:\.\d+)?)K$/i, (_, k) => String(Math.round(parseFloat(k) * 1000)));
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
}
async function gotoWithRetry(page, url, tries = 4) {
    let lastErr;
    for (let i = 0; i < tries; i++) {
        try {
            const resp = await page.goto(url, { waitUntil: 'commit', timeout: 90000 });
            if (resp && resp.status() >= 400)
                throw new Error(`HTTP ${resp.status()} at ${url}`);
            await page.waitForSelector('[data-test="result-list"] article, article[class*="Placard"]', { timeout: 90000 });
            return;
        }
        catch (e) {
            lastErr = e;
            await new Promise(r => setTimeout(r, 1500 * (i + 1)));
        }
    }
    throw lastErr;
}
async function scrape() {
    const browser = await playwright_1.chromium.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-features=IsolateOrigins,site-per-process',
            '--window-size=1366,768',
        ],
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'en-US',
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://www.loopnet.com/',
        },
    });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(120000);
    await page.route(/\.(png|jpe?g|gif|svg|css|woff2?|mp4)$/i, r => r.abort());
    try {
        await gotoWithRetry(page, URL, 4);
        const cookieSelectors = [
            'button:has-text("Accept All")',
            'button:has-text("I Accept")',
            'button[aria-label*="accept"]',
        ];
        for (const sel of cookieSelectors) {
            const btn = await page.$(sel).catch(() => null);
            if (btn) {
                await btn.click({ timeout: 2000 }).catch(() => { });
                break;
            }
        }
        await page.evaluate(() => new Promise(resolve => {
            let y = 0;
            const t = setInterval(() => {
                window.scrollBy(0, 1200);
                y += 1200;
                if (y > 9000) {
                    clearInterval(t);
                    resolve();
                }
            }, 200);
        }));
        const items = await page.evaluate(() => {
            const out = [];
            const cards = document.querySelectorAll('[data-test="result-list"] article, article[class*="Placard"]');
            cards.forEach((c) => {
                var _a, _b, _c;
                const title = (((_a = c.querySelector('h2, h3')) === null || _a === void 0 ? void 0 : _a.textContent) || '').trim();
                const price = (((_b = c.querySelector('[data-test="price"], [class*="Price"]')) === null || _b === void 0 ? void 0 : _b.textContent) || '').trim();
                const address = (((_c = c.querySelector('[data-test="address"], [class*="Address"]')) === null || _c === void 0 ? void 0 : _c.textContent) || '').trim();
                if (title && address)
                    out.push({ title, price, address });
            });
            return out;
        });
        return items;
    }
    finally {
        await browser.close();
    }
}
async function pushToAPI(items) {
    var _a;
    for (const r of items) {
        try {
            await axios_1.default.post(`${BASE}/deals`, {
                source: 'loopnet',
                title: r.title,
                address: r.address,
                city: CITY.charAt(0).toUpperCase() + CITY.slice(1),
                state: STATE.toUpperCase(),
                price: parsePrice(r.price),
            });
            console.log('✅ Added:', r.title);
        }
        catch (e) {
            console.error('❌ Failed:', r.title, ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) || e.message);
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
        }
        catch (e) {
            console.error('Crawler error:', e.message || e);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=loopnet.playwright.js.map