import { expect, isMobile, test } from './fixtures';

test('search dialog opens with the keyboard and finds products', async ({ page }, testInfo) => {
  await page.goto('/');
  if (isMobile(testInfo.project.name)) {
    await page.getByRole('button', { name: 'Search products' }).click();
  } else {
    await page.locator('body').press('Control+k');
  }
  const dialog = page.getByRole('dialog', { name: 'Search products' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').fill('jacket');
  await expect(dialog.getByRole('option')).toHaveCount(2);
  await dialog.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/\/products\/(canvas-chore|quilted-liner)-jacket/);
});

test('search shows a helpful message when nothing matches', async ({ page }) => {
  await page.goto('/search?q=submarine');
  await expect(page.getByRole('heading', { name: 'No products match “submarine”' })).toBeVisible();
});

test('changing the country reprices the store', async ({ page }, testInfo) => {
  await page.goto('/products/heavyweight-hoodie');
  await expect(page.locator('main').getByText('$98').first()).toBeVisible();
  if (isMobile(testInfo.project.name)) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page
      .getByRole('dialog', { name: 'Menu' })
      .getByRole('button', { name: /United Kingdom/ })
      .click();
  } else {
    await page.getByRole('button', { name: /Country and currency: US/ }).click();
    await page
      .getByRole('dialog', { name: 'Choose country and currency' })
      .getByRole('button', { name: /United Kingdom/ })
      .click();
  }
  await expect(page.locator('main').getByText('£78').first()).toBeVisible();
  await expect(page.getByText('Free shipping to United Kingdom on orders over £100.').first()).toBeVisible();
});

test('wishlist saves on this device', async ({ page }) => {
  await page.goto('/products/wool-overshirt');
  await page.getByRole('button', { name: 'Save Wool overshirt to wishlist' }).click();
  await expect(page.getByRole('button', { name: 'Remove Wool overshirt from wishlist' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.goto('/wishlist');
  await expect(page.getByText('1 item.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Wool overshirt' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Remove Wool overshirt from wishlist' }).click();
  await expect(page.getByRole('heading', { name: 'Your wishlist is empty' })).toBeVisible();
});

test('journal filters by topic and links to products', async ({ page }) => {
  await page.goto('/journal');
  await page.getByRole('button', { name: 'Field notes' }).click();
  await expect(page.getByRole('link', { name: /Packing light/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Why we sew in small runs/ })).toBeHidden();

  await page.goto('/journal/what-fabric-weight-tells-you');
  await expect(
    page.getByRole('heading', { level: 1, name: 'What fabric weight actually tells you' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Products in this story' }).getByRole('link')).toHaveCount(3);
});

test('unknown pages render the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'We can’t find that page.' })).toBeVisible();
});

test.describe('analytics consent', () => {
  test.use({ consent: null });

  test('events are only sent after the visitor accepts', async ({ page }) => {
    await page.goto('/products/boxy-pocket-tee?color=Oat&size=M');
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    await expect(banner).toBeVisible();
    expect(await page.evaluate(() => window.dataLayer ?? [])).toEqual([]);

    await banner.getByRole('button', { name: 'Accept analytics' }).click();
    await expect(banner).toBeHidden();
    await page.locator('main').getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Cart' })).toBeVisible();

    const events = await page.evaluate(() =>
      (window.dataLayer as { event?: string }[]).map((e) => e.event).filter(Boolean),
    );
    expect(events).toContain('add_to_cart');
  });
});
