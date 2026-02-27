#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://127.0.0.1:5173/';
const outDir = process.argv[3] || 'test-artifacts';

function ts() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

    const consoleLogs = [];
    page.on('console', (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', (err) => {
      consoleLogs.push({ type: 'pageerror', text: String(err) });
    });

    const stamp = ts();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120_000 });
    await page.waitForSelector('#root', { timeout: 60_000 });

    // give React a moment to paint modals/cutscenes
    await page.waitForTimeout(1000);

    const shot1 = path.join(outDir, `dev-${stamp}-01-initial.png`);
    await page.screenshot({ path: shot1, fullPage: true });

    // Try to click "Start" button if present (landing modal)
    const startClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const start = buttons.find(b => /\bstart\b/i.test(b.textContent || ''));
      if (start) { start.click(); return true; }
      return false;
    });

    if (startClicked) {
      await page.waitForTimeout(1200);
      const shot2 = path.join(outDir, `dev-${stamp}-02-after-start.png`);
      await page.screenshot({ path: shot2, fullPage: true });

      // Advance cutscene if a "Continue"-like button exists (cutscene overlay)
      const continued = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cont = buttons.find(b => /continue|next|start playing/i.test((b.textContent||'').toLowerCase()));
        if (cont) { cont.click(); return true; }
        return false;
      });
      if (continued) {
        await page.waitForTimeout(1200);
        const shot3 = path.join(outDir, `dev-${stamp}-03-after-continue.png`);
        await page.screenshot({ path: shot3, fullPage: true });
      }
    }

    const logPath = path.join(outDir, `dev-${stamp}-console.json`);
    await fs.writeFile(logPath, JSON.stringify({ url, console: consoleLogs }, null, 2));

    console.log(JSON.stringify({ ok: true, url, outDir, files: await fs.readdir(outDir) }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('screenshot failed:', err);
  process.exit(1);
});
