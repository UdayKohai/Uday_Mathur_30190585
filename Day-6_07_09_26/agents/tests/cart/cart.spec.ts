// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, addToCartLocator, detailAddToCartLocator, detailRemoveLocator, loginAsStandardUser, removeLocator } from '../support/saucedemo';

const cartBadge = '[data-test="shopping-cart-badge"]';
const cartLink = '[data-test="shopping-cart-link"]';

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-ADD-006 Cart badge is absent for an empty cart', async ({ page }) => {
    // 1. Inspect the cart icon on a fresh session
    await expect(page.locator(cartLink)).toBeVisible();
    await expect(page.locator(cartBadge)).toHaveCount(0);
  });

  test('TC-ADD-001 Add a single item to the cart', async ({ page }) => {
    // 1. Add 'Sauce Labs Backpack' to the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();

    await expect(page.locator(cartBadge)).toHaveText('1');
    await expect(removeLocator(page, 'sauce-labs-backpack')).toBeVisible();

    // 2. Open the cart page
    await page.locator(cartLink).click();

    const item = page.locator('[data-test="inventory-item"]');
    await expect(item).toHaveCount(1);
    await expect(item.locator('[data-test="item-quantity"]')).toHaveText('1');
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  });

  test('TC-ADD-002 Add multiple items and verify the badge count', async ({ page }) => {
    // 1. Add three products to the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await expect(page.locator(cartBadge)).toHaveText('1');

    await addToCartLocator(page, 'sauce-labs-bike-light').click();
    await expect(page.locator(cartBadge)).toHaveText('2');

    await addToCartLocator(page, 'sauce-labs-onesie').click();
    await expect(page.locator(cartBadge)).toHaveText('3');

    // 2. Open the cart page
    await page.locator(cartLink).click();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(['$29.99', '$9.99', '$7.99']);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1', '1']);
  });

  test('TC-ADD-003 Add all six products to the cart', async ({ page }) => {
    // 1. Add every product
    for (const product of PRODUCTS) {
      await addToCartLocator(page, product.id).click();
    }

    await expect(page.locator(cartBadge)).toHaveText('6');
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(6);

    // 2. Open the cart page
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('TC-ADD-004 Add to cart from the product detail page', async ({ page }) => {
    // 1. Open the detail page and add the product
    await page.getByText('Sauce Labs Bike Light', { exact: true }).click();
    await detailAddToCartLocator(page).click();

    await expect(page.locator(cartBadge)).toHaveText('1');
    await expect(detailRemoveLocator(page)).toBeVisible();

    // 2. Return to the inventory page
    await page.locator('[data-test="back-to-products"]').click();

    await expect(removeLocator(page, 'sauce-labs-bike-light')).toBeVisible();
    await expect(page.locator(cartBadge)).toHaveText('1');
  });

  test('TC-ADD-005 Add/Remove button toggle state is consistent', async ({ page }) => {
    // 1. Add the product
    await addToCartLocator(page, 'sauce-labs-onesie').click();
    await expect(removeLocator(page, 'sauce-labs-onesie')).toBeVisible();

    // 2. Remove the product
    await removeLocator(page, 'sauce-labs-onesie').click();

    await expect(addToCartLocator(page, 'sauce-labs-onesie')).toBeVisible();
    await expect(page.locator(cartBadge)).toHaveCount(0);
  });
});

test.describe('Remove from Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-REM-001 Remove an item from the inventory page', async ({ page }) => {
    // 1. Add and then remove the product from the inventory page
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await removeLocator(page, 'sauce-labs-backpack').click();

    await expect(addToCartLocator(page, 'sauce-labs-backpack')).toBeVisible();
    await expect(page.locator(cartBadge)).toHaveCount(0);

    // 2. Open the cart page
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('TC-REM-002 Remove an item from the cart page', async ({ page }) => {
    // 1. Add two products and open the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await addToCartLocator(page, 'sauce-labs-bike-light').click();
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);

    // 2. Remove the bike light row
    await removeLocator(page, 'sauce-labs-bike-light').click();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator(cartBadge)).toHaveText('1');
  });

  test('TC-REM-003 Remove an item from the product detail page', async ({ page }) => {
    // 1. Add the product and open its detail page
    await addToCartLocator(page, 'sauce-labs-fleece-jacket').click();
    await page.getByText('Sauce Labs Fleece Jacket', { exact: true }).click();
    await expect(detailRemoveLocator(page)).toBeVisible();

    // 2. Remove it from the detail page
    await detailRemoveLocator(page).click();

    await expect(detailAddToCartLocator(page)).toBeVisible();
    await expect(page.locator(cartBadge)).toHaveCount(0);
  });

  test('TC-REM-004 Removing all items empties the cart', async ({ page }) => {
    // 1. Add three products and open the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await addToCartLocator(page, 'sauce-labs-bike-light').click();
    await addToCartLocator(page, 'sauce-labs-onesie').click();
    await page.locator(cartLink).click();

    // 2. Remove each item in turn
    await removeLocator(page, 'sauce-labs-backpack').click();
    await expect(page.locator(cartBadge)).toHaveText('2');

    await removeLocator(page, 'sauce-labs-bike-light').click();
    await expect(page.locator(cartBadge)).toHaveText('1');

    await removeLocator(page, 'sauce-labs-onesie').click();
    await expect(page.locator(cartBadge)).toHaveCount(0);

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-CRT-005 Cart icon navigates to the cart page', async ({ page }) => {
    // 1. Click the shopping cart icon
    await page.locator(cartLink).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('[data-test="cart-quantity-label"]')).toHaveText('QTY');
    await expect(page.locator('[data-test="cart-desc-label"]')).toHaveText('Description');
  });

  test('TC-CRT-001 Cart displays correct items, quantities and prices', async ({ page }) => {
    // 1. Add two products and open the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await addToCartLocator(page, 'sauce-labs-onesie').click();
    await page.locator(cartLink).click();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(['$29.99', '$7.99']);
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(2);
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-CRT-002 Continue Shopping returns to the inventory', async ({ page }) => {
    // 1. Add a product and open the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await page.locator(cartLink).click();

    // 2. Click Continue Shopping
    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator(cartBadge)).toHaveText('1');
  });

  test('TC-CRT-003 Cart contents persist across navigation', async ({ page }) => {
    // 1. Add a product
    await addToCartLocator(page, 'sauce-labs-backpack').click();

    // 2. Navigate to a detail page and back
    await page.getByText('Sauce Labs Bike Light', { exact: true }).click();
    await expect(page.locator(cartBadge)).toHaveText('1');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page.locator(cartBadge)).toHaveText('1');

    // 3. Open the cart
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-CRT-004 Attempt to checkout with an empty cart', async ({ page }) => {
    // 1. Open the empty cart and click Checkout
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await page.locator('[data-test="checkout"]').click();

    // 2. Complete the checkout form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    // Known gap: the application allows an empty, zero-value order to reach the overview page.
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');
  });
});
