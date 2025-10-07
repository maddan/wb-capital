
import puppeteer from 'puppeteer';
import axios from 'axios';

const BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const CITY = process.env.CITY || 'raleigh';
const STATE = process.env.STATE || 'NC';

function parsePrice(text?: string) {
  if (!text) return 0;
  const n = text.replace(/[,\s$]/g, '').replace(/M/i, '000000').replace(/K/i, '000');
  const f = parseFloat(n);
  return isNaN(f) ? 0 : f;
}

export async function scrapeLoopNet(city = CITY.toLowerCase()) {
  const url = `https://www.loopnet.com/search/apartments-for-sale/${city}-${STATE.toLowerCase()}/`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const results = await page.evaluate(() => {
    const items: any[] = [];
    const cards = document.querySelectorAll('[data-test="result-list"] article');
    cards.forEach((c: any) => {
      const title = c.querySelector('h2, h3')?.innerText?.trim();
      const price = c.querySelector('[data-test="price"]')?.innerText?.trim();
      const address = c.querySelector('[data-test="address"]')?.innerText?.trim();
      items.push({ title, price, address });
    });
    return items;
  });

  await browser.close();
  return results.filter(r => r.title && r.address);
}

export async function pushToAPI(results: any[]) {
  for (const r of results) {
    try {
      await axios.post(`${BASE}/deals`, {
        source: 'loopnet',
        title: r.title,
        address: r.address,
        city: CITY[0].toUpperCase()+CITY.slice(1),
        state: STATE,
        price: parsePrice(r.price),
      });
      console.log('Added:', r.title);
    } catch (e: any) {
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
