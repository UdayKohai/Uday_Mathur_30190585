import { test, expect } from '@playwright/test';
import { baseUrl } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  test('Open the Flights service', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/PHPTRAVELS/i);
    const flights = page.getByRole('link', { name: /flight/i }).first().or(page.getByRole('button', { name: /flight/i }).first());
    await expect(flights).toBeVisible();
    await flights.click();
    await expect(page.locator('body')).toContainText(/flight/i);
  });
});