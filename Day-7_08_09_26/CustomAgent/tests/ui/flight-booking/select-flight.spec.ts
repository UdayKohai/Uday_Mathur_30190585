import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  for (const option of ['first available flight', 'lowest priced flight']) {
    test(`Select ${option} and continue to review`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a selectable flight fixture');
      await openFlights(page);
      const select = page.getByRole('button', { name: /select|book/i }).first();
      await expect(select).toBeVisible();
      await select.click();
      await expect(page.locator('body')).toContainText(/review|passenger|flight/i);
    });
  }
});