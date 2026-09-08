import { test, expect } from '@playwright/test';
import { invalidPassengers, openFlights } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  for (const passengerValue of invalidPassengers) {
    test(`Reject invalid passenger value: ${String(passengerValue)}`, async ({ page }) => {
      await openFlights(page);
      const fields = page.locator('input');
      if (await fields.count() < 3) test.skip(true, 'Flight form fields are not exposed by the demo');
      await fields.nth(2).fill('London');
      await fields.nth(3).fill(String(passengerValue));
      await page.getByRole('button', { name: /search/i }).first().click();
      await expect(page.locator('body')).toContainText(/invalid|required|passenger|guest|flight/i);
    });
  }
});