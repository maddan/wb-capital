"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeCREXi = scrapeCREXi;
exports.pushToAPI = pushToAPI;
const playwright_1 = require("playwright");
const axios_1 = require("axios");
const args = Object.fromEntries(process.argv
    .slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
    const [key, val] = a.replace(/^--/, '').split('=');
    return [key.toLowerCase(), val];
}));
const API_BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const CITY = (args.city || process.env.CITY || 'raleigh').toLowerCase();
const STATE = (args.state || process.env.STATE || 'NC').toLowerCase();
const ASSET = (args.asset || process.env.ASSET || 'multifamily').toLowerCase();
function buildSearchUrl() {
    const geo = `${CITY}-${STATE}`;
    const params = new URLSearchParams({ geography: geo, type: ASSET });
    return `https://www.crexi.com/properties?${params.toString()}`;
}
function parseMoney(text) {
    if (!text)
        return 0;
    const s = text.replace(/[,\\s$]/g, '').toUpperCase();
    const m = s.match(/([0-9]+(?:\\.[0-9]+)?)([MK])?/);
    if (!m)
        return parseFloat(s) || 0;
    const num = parseFloat(m[1]);
    const mult = m[2] === 'M' ? 1000000 : m[2] === 'K' ? 1000 : 1;
    return Math.round(num * mult);
}
async function gotoWithRetry(page, url, tries = 4) {
    let lastErr;
    for (let i = 0; i < tries; i++) {
        try {
            const resp = await page.goto(url, { waitUntil: 'commit', timeout: 90000 });
            if (resp && resp.status() >= 400)
                throw new Error(`HTTP ${resp.status()} at ${url}`);
            await page.waitForSelector('a[href*="/properties/"] article, div[class*="Card"], [data-testid*="card"]', { timeout: 90000 });
            return;
        }
        catch (e) {
            lastErr = e;
            await new Promise(r => setTimeout(r, 1500 * (i + 1)));
        }
    }
    throw lastErr;
}
async function scrapeCREXi() {
    const url = buildSearchUrl();
    console.log(`🔎 Fetching CREXi listings for ${CITY}, ${STATE} (${ASSET})`);
    console.log('URL:', url);
    const browser = await playwright_1.chromium.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1366,768',
        ],
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'en-US',
        extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
    });
    const page = await context.newPage();
    await page.route(/\.(png|jpe?g|gif|svg|css|woff2?|mp4)$/i, r => r.abort());
    try {
        await gotoWithRetry(page, url, 4);
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
            const results = [];
            const cards = document.querySelectorAll('a[href*="/properties/"] article, div[class*="Card"], [data-testid*="card"]');
            cards.forEach((el) => {
                const get = (selArr) => {
                    for (const sel of selArr) {
                        const n = el.querySelector(sel);
                        if (n && n.textContent)
                            return n.textContent.trim();
                    }
                    return '';
                };
                const title = get(['h2', 'h3']);
                const address = get(['[data-testid*="address"]', '[class*="Address"]']);
                const price = get(['[data-testid*="price"]', '[class*="Price"]']);
                const cap = get(['[data-testid*="cap"]', '[class*="Cap"]']);
                const units = get(['[data-testid*="units"]', '[class*="Units"]']);
                if (title)
                    results.push({ title, address, price, cap, units });
            });
            return results;
        });
        console.log(`✅ Found ${items.length} listings`);
        return items;
    }
    finally {
        await browser.close();
    }
}
async function pushToAPI(items) {
    var _a;
    if (!(items === null || items === void 0 ? void 0 : items.length)) {
        console.log('No listings found to push.');
        return;
    }
    const mapped = items.map(r => ({
        source: 'crexi',
        title: r.title,
        address: r.address || '',
        city: CITY.charAt(0).toUpperCase() + CITY.slice(1),
        state: STATE.toUpperCase(),
        price: parseMoney(r.price),
        capRate: r.cap ? parseFloat((r.cap || '').replace(/[^0-9.]/g, '')) : undefined,
        units: r.units ? parseInt((r.units || '').replace(/[^0-9]/g, ''), 10) : undefined,
    }));
    try {
        const { data } = await axios_1.default.post(`${API_BASE}/ingest/bulk`, { city: CITY, state: STATE, items: mapped });
        console.log('📦 Bulk ingest result:', data);
    }
    catch (e) {
        console.error('❌ Bulk ingest failed:', ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) || e.message);
    }
}
if (require.main === module) {
    (async () => {
        try {
            const items = await scrapeCREXi();
            await pushToAPI(items);
            console.log('🏁 CREXi crawl complete.');
        }
        catch (e) {
            console.error('Crawler error:', e.message || e);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=crexi.playwright.js.map