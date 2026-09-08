// spec: specs/saucedemo-test-plan.md
// Shared constants and helpers for the Sauce Demo suites.

import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://www.saucedemo.com/';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export const PASSWORD = 'secret_sauce';

export const PRODUCTS = [
  { name: 'Sauce Labs Backpack', price: 29.99, id: 'sauce-labs-backpack' },
  { name: 'Sauce Labs Bike Light', price: 9.99, id: 'sauce-labs-bike-light' },
  { name: 'Sauce Labs Bolt T-Shirt', price: 15.99, id: 'sauce-labs-bolt-t-shirt' },
  { name: 'Sauce Labs Fleece Jacket', price: 49.99, id: 'sauce-labs-fleece-jacket' },
  { name: 'Sauce Labs Onesie', price: 7.99, id: 'sauce-labs-onesie' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99, id: 'test.allthethings()-t-shirt-(red)' },
] as const;

export const ERRORS = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  noMatch: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  inventoryGuard: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;

export const CHECKOUT_DATA = {
  valid: { firstName: 'John', lastName: 'Doe', postalCode: '12345' },
  min: { firstName: 'A', lastName: 'B', postalCode: '1' },
  max: { firstName: 'A'.repeat(50), lastName: 'B'.repeat(50), postalCode: '1234567890' },
  whitespace: { firstName: '   ', lastName: '   ', postalCode: '   ' },
  special: { firstName: "Jöhn-Ö'Neil", lastName: "D'Souza", postalCode: 'AB1 2CD' },
  injection: { firstName: '<script>alert(1)</script>', lastName: "'; DROP TABLE users;--", postalCode: '12345' },
} as const;

export function addToCartLocator(page: Page, productId: string) {
  return page.locator(`[data-test="add-to-cart-${productId}"]`);
}

export function removeLocator(page: Page, productId: string) {
  return page.locator(`[data-test="remove-${productId}"]`);
}

// The detail page uses unsuffixed data-test ids, unlike the inventory grid.
export function detailAddToCartLocator(page: Page) {
  return page.locator('[data-test="add-to-cart"]');
}

export function detailRemoveLocator(page: Page) {
  return page.locator('[data-test="remove"]');
}

export async function login(page: Page, username: string, password: string = PASSWORD) {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

export async function loginAsStandardUser(page: Page) {
  await login(page, USERS.standard);
  await expect(page).toHaveURL(/inventory\.html/);
}

export async function fillCheckoutInformation(
  page: Page,
  data: { firstName: string; lastName: string; postalCode: string },
) {
  await page.locator('[data-test="firstName"]').fill(data.firstName);
  await page.locator('[data-test="lastName"]').fill(data.lastName);
  await page.locator('[data-test="postalCode"]').fill(data.postalCode);
  await page.locator('[data-test="continue"]').click();
}

export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
