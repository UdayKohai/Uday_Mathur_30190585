import { test, expect } from '@playwright/test';

test.describe('APICollection GET requests', () => {
  test('BrandList', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/brandsList');

    expect(response.ok()).toBeTruthy();
  });
});