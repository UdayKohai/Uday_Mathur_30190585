// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, USERS, detailAddToCartLocator, login, loginAsStandardUser, parsePrice } from '../support/saucedemo';

test.describe('Product Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-INV-001 Inventory displays exactly six products', async ({ page }) => {
    // 1. Inspect the inventory grid
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    await expect(page.locator('.inventory_item_img img')).toHaveCount(6);
    await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveCount(6);
    await expect(page.locator('.btn_inventory')).toHaveCount(6);
  });

  test('TC-INV-002 Product names, prices and descriptions are correct', async ({ page }) => {
    // 1. Verify every product name and price against the catalogue baseline
    for (const product of PRODUCTS) {
      const card = page.locator('[data-test="inventory-item"]', { hasText: product.name });
      await expect(card).toHaveCount(1);
      await expect(card.locator('[data-test="inventory-item-price"]')).toHaveText(`$${product.price.toFixed(2)}`);
      await expect(card.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
    }
  });

  test('TC-INV-003 All product images load and match their product', async ({ page }) => {
    // 1. Verify every image renders and is unique
    const images = page.locator('.inventory_item_img img');
    const details = await images.evaluateAll(nodes =>
      nodes.map(node => {
        const image = node as HTMLImageElement;
        return { src: image.getAttribute('src'), alt: image.getAttribute('alt'), width: image.naturalWidth };
      }),
    );

    expect(details).toHaveLength(6);
    for (const detail of details) {
      expect(detail.width, `image ${detail.src} failed to load`).toBeGreaterThan(0);
      expect(detail.alt).toBeTruthy();
    }
    expect(new Set(details.map(detail => detail.src)).size).toBe(details.length);
  });

  test('TC-INV-004 Product name link opens the product detail page', async ({ page }) => {
    // 1. Click the product name
    await page.getByText('Sauce Labs Backpack', { exact: true }).click();

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
    await expect(detailAddToCartLocator(page)).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('TC-INV-005 Back to products returns to the inventory', async ({ page }) => {
    // 1. Open a detail page and go back
    await page.getByText('Sauce Labs Onesie', { exact: true }).click();
    await expect(page).toHaveURL(/inventory-item\.html/);

    await page.locator('[data-test="back-to-products"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('TC-INV-006 Prices are formatted consistently', async ({ page }) => {
    // 1. Read every displayed price
    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();

    expect(prices).toHaveLength(6);
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });
});

test.describe('Product Inventory - defect personas', () => {
  // Known application defect: problem_user serves a single broken image for all six products.
  test.fixme('TC-INV-007 problem_user image defect is detected', async ({ page }) => {
    // 1. Log in as problem_user and compare images with the expected sources
    await login(page, USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);

    const sources = await page.locator('.inventory_item_img img').evaluateAll(
      nodes => nodes.map(node => (node as HTMLImageElement).getAttribute('src') ?? ''),
    );

    // Known defect: every card falls back to the same broken image asset.
    expect(new Set(sources).size, 'problem_user renders duplicate product images').toBe(sources.length);
  });
});

test.describe('Product Sorting', () => {
  const sortDropdown = '[data-test="product-sort-container"]';

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-SRT-006 Default sort order is Name (A to Z)', async ({ page }) => {
    // 1. Read the active sort option and the rendered order
    await expect(page.locator(sortDropdown)).toHaveValue('az');
    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(names[0]).toBe('Sauce Labs Backpack');
  });

  test('TC-SRT-001 Sort by Name (A to Z)', async ({ page }) => {
    // 1. Switch away from the default order and back again
    await page.locator(sortDropdown).selectOption('za');
    await page.locator(sortDropdown).selectOption('az');

    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('TC-SRT-002 Sort by Name (Z to A)', async ({ page }) => {
    // 1. Select 'Name (Z to A)'
    await page.locator(sortDropdown).selectOption('za');

    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
  });

  test('TC-SRT-003 Sort by Price (low to high)', async ({ page }) => {
    // 1. Select 'Price (low to high)'
    await page.locator(sortDropdown).selectOption('lohi');

    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map(parsePrice);
    expect(prices).toEqual([7.99, 9.99, 15.99, 15.99, 29.99, 49.99]);
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Onesie');
  });

  test('TC-SRT-004 Sort by Price (high to low)', async ({ page }) => {
    // 1. Select 'Price (high to low)'
    await page.locator(sortDropdown).selectOption('hilo');

    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map(parsePrice);
    expect(prices).toEqual([49.99, 29.99, 15.99, 15.99, 9.99, 7.99]);
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Fleece Jacket');
  });

  // Known application defect: the sort selection resets to 'Name (A to Z)' after leaving the inventory page.
  test.fixme('TC-SRT-005 Sort selection persists across navigation', async ({ page }) => {
    // 1. Apply a sort order
    await page.locator(sortDropdown).selectOption('hilo');

    // 2. Navigate to a detail page and back
    await page.getByText('Sauce Labs Fleece Jacket', { exact: true }).click();
    await page.locator('[data-test="back-to-products"]').click();

    await expect(page.locator(sortDropdown)).toHaveValue('hilo');
    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map(parsePrice);
    expect(prices).toEqual([49.99, 29.99, 15.99, 15.99, 9.99, 7.99]);
  });
});
