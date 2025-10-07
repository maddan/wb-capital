// tools/save-storage.ts
import { chromium } from "playwright";
(async ()=>{
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.crexi.com/login"); // or homepage then login
  console.log("➡️  Log in manually, then press Enter here...");
  process.stdin.once("data", async ()=>{
    await context.storageState({ path: "crexi.storage.json" });
    console.log("✅ Saved to crexi.storage.json");
    await browser.close(); process.exit(0);
  });
})();
