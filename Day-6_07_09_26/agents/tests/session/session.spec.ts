// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { BASE_URL, CHECKOUT_DATA, ERRORS, addToCartLocator, fillCheckoutInformation, loginAsStandardUser } from '../support/saucedemo';

const cartBadge = '[data-test="shopping-cart-badge"]';
const cartLink = '[data-test="shopping-cart-link"]';

test.describe('Session Management', () => {
  test('TC-SES-001 Direct inventory URL access without login is blocked', async ({ page }) => {
    // 1. Navigate directly to the inventory page with no session
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.inventoryGuard);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('TC-SES-002 Direct protected URL access without login is blocked', async ({ page }) => {
    const protectedRoutes = ['cart.html', 'checkout-step-one.html', 'checkout-step-two.html'];

    // 1. Attempt each protected route without a session
    for (const route of protectedRoutes) {
      await page.goto(`https://www.saucedemo.com/${route}`);

      await expect(page).toHaveURL(BASE_URL);
      await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: You can only access');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    }
  });

  test('TC-SES-003 Page refresh preserves session and cart state', async ({ page }) => {
    // 1. Log in, add a product and refresh the inventory page
    await loginAsStandardUser(page);
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await page.reload();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator(cartBadge)).toHaveText('1');
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(1);

    // 2. Refresh on the checkout overview page
    await page.locator(cartLink).click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await page.reload();

    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');
  });

  test('TC-SES-004 Session invalidation mid-flow is handled gracefully', async ({ page, context }) => {
    // 1. Log in, add a product, then clear the session
    await loginAsStandardUser(page);
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await context.clearCookies();

    // 2. Attempt to continue to the checkout information page
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: You can only access');
  });

  test('TC-SES-005 Browser back and forward navigation during checkout', async ({ page }) => {
    // 1. Progress to the checkout overview page then go back
    await loginAsStandardUser(page);
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await page.locator(cartLink).click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await page.goBack();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 2. Go forward and finish the order
    await page.goForward();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator(cartBadge)).toHaveCount(0);
  });
});

test.describe('Error Handling', () => {
  test('TC-ERR-001 Error banners are consistent and dismissible', async ({ page }) => {
    // 1. Trigger a login validation error
    await page.goto(BASE_URL);
    await page.locator('[data-test="login-button"]').click();
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toHaveText(ERRORS.usernameRequired);

    // 2. Dismiss the login error banner
    await page.locator('[data-test="error-button"]').click();
    await expect(loginError).toHaveCount(0);

    // 3. Trigger a checkout validation error
    await loginAsStandardUser(page);
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await page.locator(cartLink).click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();

    const checkoutError = page.locator('[data-test="error"]');
    await expect(checkoutError).toHaveText(ERRORS.firstNameRequired);

    // 4. Dismiss the checkout error banner
    await page.locator('[data-test="error-button"]').click();
    await expect(checkoutError).toHaveCount(0);
    await expect(page.locator('[data-test="firstName"]')).toBeEditable();
  });
});
