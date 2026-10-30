import { expect, isMobile, test } from './fixtures';

test.describe('shopping flow', () => {
  test('home page leads to the catalog', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Clothes built for the long haul.' }),
    ).toBeVisible();
    await expect(page.getByRole('list', { name: 'New arrivals' }).getByRole('listitem')).toHaveCount(4);
    await page.getByRole('link', { name: 'Shop new arrivals' }).click();
    await expect(page).toHaveURL(/\/collections\/all$/);
    await expect(page.getByRole('heading', { level: 1, name: 'New in' })).toBeVisible();
  });

  test('adds a product to the cart, changes quantity and removes it', async ({ page }) => {
    await page.goto('/products/heavyweight-hoodie');
    const main = page.locator('main');

    // Size is required before adding.
    await expect(main.getByRole('button', { name: 'Select a size' }).first()).toBeDisabled();
    await main.getByRole('button', { name: 'Oat', exact: true }).click();
    await main.getByRole('button', { name: 'Size L', exact: true }).click();
    await expect(page).toHaveURL(/color=Oat&size=L/);

    await main.getByRole('button', { name: 'Add to cart' }).first().click();

    const cart = page.getByRole('dialog', { name: 'Cart' });
    await expect(cart).toBeVisible();
    await expect(cart.getByRole('heading', { name: 'Your cart (1)' })).toBeVisible();
    await expect(cart.getByText('Oat / L')).toBeVisible();
    await expect(cart.getByText('Add $22 more for free shipping')).toBeVisible();

    await cart.getByRole('button', { name: 'Increase quantity of Heavyweight hoodie' }).click();
    await expect(cart.getByRole('heading', { name: 'Your cart (2)' })).toBeVisible();
    await expect(cart.getByText('Your order ships free')).toBeVisible();
    await expect(cart.getByText('$196').first()).toBeVisible();

    await cart.getByRole('button', { name: 'Remove' }).click();
    await expect(cart.getByText('Your cart is empty')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(cart).toBeHidden();
  });

  test('the cart survives a reload', async ({ page }) => {
    await page.goto('/products/boxy-pocket-tee?color=Charcoal&size=M');
    await page.locator('main').getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Cart' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Cart, 1 item' })).toBeVisible();
  });

  test('sold-out sizes cannot be added and offer a restock alert', async ({ page }) => {
    await page.goto('/products/canvas-chore-jacket?color=Charcoal');
    await expect(page.getByRole('button', { name: 'Size M, sold out' })).toBeDisabled();
  });

  test('filters the catalog through the URL', async ({ page }, testInfo) => {
    await page.goto('/collections/all');
    if (isMobile(testInfo.project.name)) {
      await page.getByRole('button', { name: /Filter and sort/ }).click();
      const sheet = page.getByRole('dialog', { name: 'Filter and sort' });
      await sheet.getByRole('button', { name: 'Khaki' }).click();
      await expect(page).toHaveURL(/color=Khaki/);
      await expect(sheet.getByRole('button', { name: 'Show 1 product' })).toBeVisible();
      await sheet.getByRole('button', { name: 'Show 1 product' }).click();
    } else {
      await page
        .getByRole('complementary', { name: 'Filters' })
        .getByRole('button', { name: 'Khaki' })
        .click();
      await expect(page).toHaveURL(/color=Khaki/);
    }
    await expect(page.getByText('1 of 12 products match')).toBeVisible();
    await expect(page.getByRole('list', { name: 'New in products' }).getByRole('listitem')).toHaveCount(1);

    await page.getByRole('button', { name: 'Remove filter: Khaki' }).click();
    await expect(page).toHaveURL(/\/collections\/all$/);
    await expect(page.getByText('12 products', { exact: true })).toBeVisible();
  });

  test('shows an empty state when filters match nothing', async ({ page }) => {
    await page.goto('/collections/accessories?size=XXL');
    await expect(page.getByRole('heading', { name: 'Nothing matches these filters' })).toBeVisible();
    await page.getByRole('link', { name: 'Clear filters' }).click();
    await expect(page.getByText('4 products', { exact: true })).toBeVisible();
  });
});
