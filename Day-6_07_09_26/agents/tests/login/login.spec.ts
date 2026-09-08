// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { BASE_URL, ERRORS, PASSWORD, USERS, login } from '../support/saucedemo';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-LGN-001 Login with valid standard credentials', async ({ page }) => {
    // 1. Enter 'standard_user' in the Username field
    await page.locator('[data-test="username"]').fill(USERS.standard);

    // 2. Enter 'secret_sauce' in the Password field
    await page.locator('[data-test="password"]').fill(PASSWORD);

    // 3. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
    await expect(page.locator('[data-test="inventory-"]')).toHaveCount(6);
  });

  test('TC-LGN-002 Login page UI elements are present and correct', async ({ page }) => {
    // 1. Verify the login form controls
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', 'Password');
    await expect(page.locator('[data-test="login-button"]')).toBeEnabled();

    // 2. Read the accepted credentials help panel
    const credentials = page.locator('#login_credentials');
    for (const user of Object.values(USERS)) {
      await expect(credentials).toContainText(user);
    }
    await expect(page.locator('.login_password')).toContainText('Password for all users:');
    await expect(page.locator('.login_password')).toContainText(PASSWORD);
  });

  test('TC-LGN-003 Password field masks the entered value', async ({ page }) => {
    // 1. Type the password into the Password field
    const password = page.locator('[data-test="password"]');
    await password.fill(PASSWORD);

    await expect(password).toHaveAttribute('type', 'password');
    await expect(password).toHaveValue(PASSWORD);
  });

  test('TC-LGN-004 Login with both fields empty', async ({ page }) => {
    // 1. Click Login without entering any data
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.usernameRequired);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-LGN-005 Login with username only', async ({ page }) => {
    // 1. Enter the username, leave the password blank and click Login
    await page.locator('[data-test="username"]').fill(USERS.standard);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.passwordRequired);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-LGN-006 Login with password only', async ({ page }) => {
    // 1. Leave the username blank, enter the password and click Login
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.usernameRequired);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-LGN-007 Login with a valid username and an invalid password', async ({ page }) => {
    // 1. Enter a valid username with a wrong password and click Login
    await login(page, USERS.standard, 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.noMatch);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-LGN-008 Login with a non-existent username', async ({ page }) => {
    // 1. Enter an unknown username and click Login
    await login(page, 'ghost_user');

    // The message is identical to TC-LGN-007, preventing user enumeration.
    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.noMatch);
  });

  test('TC-LGN-009 Locked-out user is denied access', async ({ page }) => {
    // 1. Log in as the locked out user
    await login(page, USERS.lockedOut);

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.lockedOut);
    await expect(page).toHaveURL(BASE_URL);

    // 2. Confirm no session was created
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.inventoryGuard);
  });

  test('TC-LGN-010 Username is treated as case-sensitive', async ({ page }) => {
    // 1. Log in with an upper case username
    await login(page, 'STANDARD_USER');

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.noMatch);
  });

  test('TC-LGN-011 Username with leading and trailing whitespace', async ({ page }) => {
    // 1. Log in with a whitespace padded username
    await login(page, '  standard_user  ');

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.noMatch);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-LGN-012 Error banner can be dismissed', async ({ page }) => {
    // 1. Trigger an error by clicking Login with empty fields
    await page.locator('[data-test="login-button"]').click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();

    // 2. Click the close button on the error banner
    await page.locator('[data-test="error-button"]').click();

    await expect(error).toHaveCount(0);
  });

  test('TC-LGN-013 Login can be submitted with the Enter key', async ({ page }) => {
    // 1. Enter valid credentials and press Enter from the password field
    await page.locator('[data-test="username"]').fill(USERS.standard);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="password"]').press('Enter');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  // Known application defect: problem_user serves the same broken image for every product,
  // so this assertion cannot pass until the defect is fixed.
  test.fixme('TC-LGN-014 problem_user login exposes known image defects', async ({ page }) => {
    // 1. Log in as problem_user
    await login(page, USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Inspect the product image sources
    const sources = await page.locator('.inventory_item_img img').evaluateAll(
      images => images.map(image => (image as HTMLImageElement).getAttribute('src')),
    );
    const uniqueSources = new Set(sources);

    // Known defect: problem_user renders the same placeholder image for every product.
    expect(uniqueSources.size, 'each product should have a distinct image').toBe(sources.length);
  });

  test('TC-LGN-015 performance_glitch_user login latency is measured', async ({ page }) => {
    // 1. Measure the time taken to reach the inventory page
    const start = Date.now();
    await login(page, USERS.performanceGlitch);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products', { timeout: 30_000 });
    const elapsed = Date.now() - start;

    console.log(`performance_glitch_user login took ${elapsed} ms`);
    expect(elapsed, 'login latency exceeds the agreed budget').toBeLessThan(10_000);
  });

  test('TC-LGN-016 Credentials are never exposed in the URL', async ({ page }) => {
    // 1. Log in with valid credentials
    await login(page, USERS.standard);

    const url = page.url();
    expect(url).toContain('https://');
    expect(url).not.toContain(USERS.standard);
    expect(url).not.toContain(PASSWORD);
  });

  test('TC-LGN-017 Injection payloads in the login form are handled safely', async ({ page }) => {
    // 1. Submit a SQL injection payload
    await login(page, "' OR '1'='1", "' OR '1'='1");

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.noMatch);
    await expect(page).toHaveURL(BASE_URL);

    // 2. Submit an XSS payload and confirm no dialog is raised
    let dialogRaised = false;
    page.on('dialog', async dialog => {
      dialogRaised = true;
      await dialog.dismiss();
    });
    await login(page, '<script>alert(1)</script>');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    expect(dialogRaised, 'an XSS payload must not execute').toBe(false);
  });
});
