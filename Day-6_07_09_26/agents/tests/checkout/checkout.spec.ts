// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  CHECKOUT_DATA,
  ERRORS,
  addToCartLocator,
  fillCheckoutInformation,
  loginAsStandardUser,
  parsePrice,
} from '../support/saucedemo';

const cartLink = '[data-test="shopping-cart-link"]';
const cartBadge = '[data-test="shopping-cart-badge"]';

async function startCheckout(page: import('@playwright/test').Page, productIds: string[]) {
  await loginAsStandardUser(page);
  for (const id of productIds) {
    await addToCartLocator(page, id).click();
  }
  await page.locator(cartLink).click();
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
}

test.describe('Checkout Information', () => {
  test('TC-CHK-001 Checkout with valid information', async ({ page }) => {
    // 1. Add a product, open the cart and click Checkout
    await startCheckout(page, ['sauce-labs-backpack']);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();

    // 2. Submit valid information
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });

  test('TC-CHK-002 First Name is mandatory', async ({ page }) => {
    // 1. Click Continue with all fields empty
    await startCheckout(page, ['sauce-labs-backpack']);
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.firstNameRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-CHK-003 Last Name is mandatory', async ({ page }) => {
    // 1. Enter the first name only and click Continue
    await startCheckout(page, ['sauce-labs-backpack']);
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.lastNameRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-CHK-004 Postal Code is mandatory', async ({ page }) => {
    // 1. Enter both names and click Continue without a postal code
    await startCheckout(page, ['sauce-labs-backpack']);
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(ERRORS.postalCodeRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-CHK-005 Cancel from the information page returns to the cart', async ({ page }) => {
    // 1. Click Cancel on the checkout information page
    await startCheckout(page, ['sauce-labs-backpack']);
    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-CHK-006 Boundary values in the checkout fields', async ({ page }) => {
    // 1. Submit the minimum boundary data
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.min);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // 2. Return and submit the maximum boundary data
    await page.locator('[data-test="cancel"]').click();
    await page.locator(cartLink).click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, CHECKOUT_DATA.max);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });

  // Known application defect: whitespace-only values pass the required-field check and the
  // form advances to the overview page instead of showing a validation error.
  test.fixme('TC-CHK-007 Whitespace-only values are rejected', async ({ page }) => {
    // 1. Submit whitespace-only values in every field
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.whitespace);

    // Expected: required-field validation should reject whitespace-only input.
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-CHK-008 Special and Unicode characters are accepted', async ({ page }) => {
    // 1. Submit accented, hyphenated and apostrophe characters
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.special);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });

  test('TC-CHK-009 Injection payloads are safely encoded', async ({ page }) => {
    // 1. Submit script and SQL payloads in the name fields
    let dialogRaised = false;
    page.on('dialog', async dialog => {
      dialogRaised = true;
      await dialog.dismiss();
    });

    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.injection);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('script#injected')).toHaveCount(0);
    expect(dialogRaised, 'an injected script must not execute').toBe(false);
  });
});

test.describe('Checkout Overview', () => {
  test('TC-OVW-001 Overview lists all cart items', async ({ page }) => {
    // 1. Checkout with two products
    await startCheckout(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(['$29.99', '$9.99']);
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });

  test('TC-OVW-002 Item total equals the sum of the item prices', async ({ page }) => {
    // 1. Reach the overview with two products
    await startCheckout(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    const lineTotal = (await page.locator('[data-test="inventory-item-price"]').allTextContents())
      .map(parsePrice)
      .reduce((sum, price) => sum + price, 0);
    const itemTotal = parsePrice(await page.locator('[data-test="subtotal-label"]').innerText());

    expect(itemTotal).toBeCloseTo(lineTotal, 2);
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
  });

  test('TC-OVW-003 Tax is 8 percent of the item total', async ({ page }) => {
    // 1. Reach the overview with a single product
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    const itemTotal = parsePrice(await page.locator('[data-test="subtotal-label"]').innerText());
    const tax = parsePrice(await page.locator('[data-test="tax-label"]').innerText());

    expect(itemTotal).toBe(29.99);
    expect(tax).toBeCloseTo(Number((itemTotal * 0.08).toFixed(2)), 2);
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');
  });

  test('TC-OVW-004 Total equals item total plus tax', async ({ page }) => {
    // 1. Reach the overview with a single product
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    const itemTotal = parsePrice(await page.locator('[data-test="subtotal-label"]').innerText());
    const tax = parsePrice(await page.locator('[data-test="tax-label"]').innerText());
    const total = parsePrice(await page.locator('[data-test="total-label"]').innerText());

    expect(total).toBeCloseTo(itemTotal + tax, 2);
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');
  });

  test('TC-OVW-005 Payment and shipping information are displayed', async ({ page }) => {
    // 1. Reach the overview page
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);

    await expect(page.locator('[data-test="payment-info-label"]')).toHaveText('Payment Information:');
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-label"]')).toHaveText('Shipping Information:');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
  });

  test('TC-OVW-006 Cancel from the overview returns to the inventory', async ({ page }) => {
    // 1. Reach the overview page and click Cancel
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator(cartBadge)).toHaveText('1');
  });
});

test.describe('Order Completion', () => {
  test('TC-ORD-001 Complete an order end to end', async ({ page }) => {
    // 1. Add a product, open the cart and click Checkout
    await startCheckout(page, ['sauce-labs-backpack']);

    // 2. Submit valid information and finish the order
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('TC-ORD-002 Cart is emptied after order completion', async ({ page }) => {
    // 1. Complete an order with two items
    await startCheckout(page, ['sauce-labs-backpack', 'sauce-labs-onesie']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await page.locator('[data-test="finish"]').click();

    await expect(page.locator(cartBadge)).toHaveCount(0);

    // 2. Open the cart page
    await page.locator(cartLink).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('TC-ORD-003 Back Home returns to the inventory page', async ({ page }) => {
    // 1. Complete an order and click Back Home
    await startCheckout(page, ['sauce-labs-backpack']);
    await fillCheckoutInformation(page, CHECKOUT_DATA.valid);
    await page.locator('[data-test="finish"]').click();
    await page.locator('[data-test="back-to-products"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);
  });
});
