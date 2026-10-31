import { expect, test } from './fixtures';

const PAGES = [
  '/',
  '/collections/all',
  '/collections/outerwear',
  '/products/heavyweight-hoodie',
  '/journal',
  '/journal/fixing-a-torn-seam-at-home',
  '/search?q=jacket',
];

for (const path of PAGES) {
  test(`every image loads on ${path}`, async ({ page }) => {
    await page.goto(path);
    // Bring lazy images into view so the browser actually requests them.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    await page.waitForLoadState('networkidle');
    // Only images a visitor can see: hidden breakpoints and off-screen carousel slides are lazy by design.
    const images = await page.locator('main img').evaluateAll((els) =>
      (els as HTMLImageElement[])
        .filter((img) => {
          const r = img.getBoundingClientRect();
          return img.checkVisibility() && r.width > 0 && r.right > 0 && r.left < window.innerWidth;
        })
        .map((img) => ({ src: img.currentSrc || img.src, ok: img.complete && img.naturalWidth > 0 })),
    );
    expect(images.length).toBeGreaterThan(0);
    expect(images.filter((i) => !i.ok).map((i) => i.src)).toEqual([]);
  });
}

test('images are served as WebP or AVIF', async ({ page }) => {
  const types: string[] = [];
  page.on('response', (res) => {
    if (res.url().includes('/_next/image')) types.push(res.headers()['content-type'] ?? '');
  });
  await page.goto('/products/heavyweight-hoodie');
  await page.waitForLoadState('networkidle');
  expect(types.length).toBeGreaterThan(0);
  expect(types.every((t) => t === 'image/webp' || t === 'image/avif')).toBe(true);
});
