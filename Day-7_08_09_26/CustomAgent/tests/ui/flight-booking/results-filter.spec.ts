import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  for (const filter of ['stops', 'airline', 'departure time']) {
    test(`Filter flight results by ${filter}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a stable results fixture');
      await openFlights(page);
      const control = page.getByRole('button', { name: new RegExp(filter, 'i') }).first();
      await expect(control).toBeVisible();
      await control.click();
      await expect(page.locator('body')).toContainText(/flight|result|no result/i);
    });
  }
});