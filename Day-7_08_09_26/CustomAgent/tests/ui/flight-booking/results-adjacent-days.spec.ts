import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  for (const direction of ['next day', 'previous day']) {
    test(`Search different day: ${direction}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires adjacent-day results fixture');
      await openFlights(page);
      const control = page.getByRole('button', { name: new RegExp(direction, 'i') }).first();
      await expect(control).toBeVisible();
      await control.click();
      await expect(page.locator('body')).toContainText(/flight|date|result/i);
    });
  }
});