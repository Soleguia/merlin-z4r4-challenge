import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Móviles');
  });

  test('should show search input', async ({ page }) => {
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('should show products grid', async ({ page }) => {
    await page.waitForSelector('a[href^="/product/"]', { timeout: 10000 });
    const products = page.locator('a[href^="/product/"]');
    await expect(products.first()).toBeVisible();
  });
});

test.describe('Cart', () => {
  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();
  });
});