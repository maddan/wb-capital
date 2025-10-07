"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLoopNet = scrapeLoopNet;
exports.pushToAPI = pushToAPI;
const puppeteer_1 = require("puppeteer");
const axios_1 = require("axios");
const BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const CITY = process.env.CITY || 'raleigh';
const STATE = process.env.STATE || 'NC';
function parsePrice(text) {
    if (!text)
        return 0;
    const n = text.replace(/[,\s$]/g, '').replace(/M/i, '000000').replace(/K/i, '000');
    const f = parseFloat(n);
    return isNaN(f) ? 0 : f;
}
async function scrapeLoopNet(city = CITY.toLowerCase()) {
    const url = `https://www.loopnet.com/search/apartments-for-sale/${city}-${STATE.toLowerCase()}/`;
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const results = await page.evaluate(() => {
        const items = [];
        const cards = document.querySelectorAll('[data-test="result-list"] article');
        cards.forEach((c) => {
            var _a, _b, _c, _d, _e, _f;
            const title = (_b = (_a = c.querySelector('h2, h3')) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.trim();
            const price = (_d = (_c = c.querySelector('[data-test="price"]')) === null || _c === void 0 ? void 0 : _c.innerText) === null || _d === void 0 ? void 0 : _d.trim();
            const address = (_f = (_e = c.querySelector('[data-test="address"]')) === null || _e === void 0 ? void 0 : _e.innerText) === null || _f === void 0 ? void 0 : _f.trim();
            items.push({ title, price, address });
        });
        return items;
    });
    await browser.close();
    return results.filter(r => r.title && r.address);
}
async function pushToAPI(results) {
    for (const r of results) {
        try {
            await axios_1.default.post(`${BASE}/deals`, {
                source: 'loopnet',
                title: r.title,
                address: r.address,
                city: CITY[0].toUpperCase() + CITY.slice(1),
                state: STATE,
                price: parsePrice(r.price),
            });
            console.log('Added:', r.title);
        }
        catch (e) {
            console.error('Failed:', r.title, e.message);
        }
    }
}
if (require.main === module) {
    (async () => {
        const data = await scrapeLoopNet();
        await pushToAPI(data);
        console.log('✅ LoopNet crawl complete.');
    })();
}
//# sourceMappingURL=loopnet.js.map