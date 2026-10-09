// Captures the homepage of each site in work/sites.json and writes
// work/shots/<id>.webp (1280x800) and work/shots/<id>-640.webp (640x400).
// Run by .github/workflows/portfolio-screenshots.yml (weekly + on change).
// A site that fails to load keeps its previous screenshot.
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const sites = JSON.parse(await readFile(new URL('../work/sites.json', import.meta.url), 'utf8'));
const outDir = new URL('../work/shots/', import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  locale: 'en-GB',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 wirral.ai-portfolio',
});

let ok = 0;
for (const site of sites) {
  const page = await context.newPage();
  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 45_000 }).catch(async () => {
      await page.goto(site.url, { waitUntil: 'load', timeout: 45_000 });
    });
    // Let entrance animations and lazy images settle, then hide common cookie banners.
    await page.waitForTimeout(2500);
    await page.addStyleTag({
      content: `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[aria-label*="cookie" i]{display:none!important}`,
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const png = await page.screenshot({ type: 'png' });
    await sharp(png).resize(1280, 800, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(new URL(`${site.id}.webp`, outDir).pathname);
    await sharp(png).resize(640, 400, { fit: 'cover', position: 'top' }).webp({ quality: 74 }).toFile(new URL(`${site.id}-640.webp`, outDir).pathname);
    console.log(`✓ ${site.name} (${site.url})`);
    ok++;
  } catch (err) {
    console.warn(`✗ ${site.name} (${site.url}): ${err.message} — keeping the previous screenshot`);
  } finally {
    await page.close();
  }
}
await browser.close();
if (ok === 0) {
  console.error('No screenshots captured.');
  process.exit(1);
}
