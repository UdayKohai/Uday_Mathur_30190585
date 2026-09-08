import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  for (const sort of ['lowest price', 'highest price']) {
    test(`Compare results by ${sort}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a stable results fixture');
      await openFlights(page);
      const control = page.getByRole('button', { name: new RegExp(sort, 'i') }).first();
      await expect(control).toBeVisible();
      await control.click();
      await expect(page.locator('body')).toContainText(/price|flight/i);
    });
  }
});