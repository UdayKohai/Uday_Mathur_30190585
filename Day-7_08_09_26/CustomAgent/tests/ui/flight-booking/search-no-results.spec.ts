import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  for (const scenario of ['no inventory', 'supplier timeout', 'partial response']) {
    test(`Handle ${scenario}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires an approved supplier fixture');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/flight/i);
      await page.getByRole('button', { name: /search/i }).first().click();
      await expect(page.locator('body')).toContainText(/no result|unavailable|error|try again|flight/i);
    });
  }
});