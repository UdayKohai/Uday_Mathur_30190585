// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { BASE_URL, addToCartLocator, loginAsStandardUser } from '../support/saucedemo';

const cartBadge = '[data-test="shopping-cart-badge"]';
const cartLink = '[data-test="shopping-cart-link"]';

test.describe('Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC-NAV-001 Burger menu opens and closes', async ({ page }) => {
    // 1. Open the burger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();

    await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();

    // 2. Close the burger menu
    await page.getByRole('button', { name: 'Close Menu' }).click();

    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeHidden();
  });

  test('TC-NAV-002 All Items navigates to the inventory page', async ({ page }) => {
    // 1. Navigate to the cart page
    await page.locator(cartLink).click();
    await expect(page).toHaveURL(/cart\.html/);

    // 2. Open the burger menu and click All Items
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="inventory-sidebar-link"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('TC-NAV-003 About link points to the Sauce Labs website', async ({ page }) => {
    // 1. Open the burger menu and inspect the About link
    await page.getByRole('button', { name: 'Open Menu' }).click();

    await expect(page.locator('[data-test="about-sidebar-link"]')).toHaveAttribute('href', 'https://saucelabs.com/');
  });

  test('TC-NAV-004 Reset App State clears the cart', async ({ page }) => {
    // 1. Add two products to the cart
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await addToCartLocator(page, 'sauce-labs-bike-light').click();
    await expect(page.locator(cartBadge)).toHaveText('2');

    // 2. Open the burger menu and click Reset App State
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="reset-sidebar-link"]').click();
    await page.getByRole('button', { name: 'Close Menu' }).click();

    await expect(page.locator(cartBadge)).toHaveCount(0);

    // 3. Inspect the cart page
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('TC-NAV-005 Footer links are present and correct', async ({ page }) => {
    // 1. Inspect the footer links and copyright
    await expect(page.locator('[data-test="social-twitter"]')).toHaveAttribute(
      'href',
      'https://twitter.com/saucelabs',
    );
    await expect(page.locator('[data-test="social-facebook"]')).toHaveAttribute(
      'href',
      'https://www.facebook.com/saucelabs',
    );
    await expect(page.locator('[data-test="social-linkedin"]')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/sauce-labs/',
    );
    await expect(page.locator('[data-test="footer-copy"]')).toContainText('Sauce Labs. All Rights Reserved.');
  });
});

test.describe('Logout', () => {
  test('TC-OUT-001 Logout returns the user to the login page', async ({ page }) => {
    // 1. Log in and open the burger menu
    await loginAsStandardUser(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();

    // 2. Click Logout
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="username"]')).toHaveValue('');
    await expect(page.locator('[data-test="password"]')).toHaveValue('');
  });

  test('TC-OUT-002 Browser back after logout does not restore the session', async ({ page }) => {
    // 1. Log in and log out
    await loginAsStandardUser(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL(BASE_URL);

    // 2. Press the browser Back button
    await page.goBack();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  // Known application defect: cart contents survive logout because session storage is not cleared.
  test.fixme('TC-OUT-003 Session and cart state are cleared on logout', async ({ page }) => {
    // 1. Log in, add a product and log out
    await loginAsStandardUser(page);
    await addToCartLocator(page, 'sauce-labs-backpack').click();
    await expect(page.locator(cartBadge)).toHaveText('1');
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // 2. Log in again
    await loginAsStandardUser(page);

    await expect(page.locator(cartBadge)).toHaveCount(0);
  });
});
