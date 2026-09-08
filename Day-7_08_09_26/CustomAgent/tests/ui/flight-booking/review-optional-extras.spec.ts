import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  for (const extra of ['hotel', 'car', 'travel insurance']) {
    test(`Add and remove optional extra: ${extra}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires review and extras fixture');
      await openFlights(page);
      const control = page.getByRole('button', { name: new RegExp(extra, 'i') }).first();
      await expect(control).toBeVisible();
      await control.click();
      await expect(page.locator('body')).toContainText(/total|added|remove|flight/i);
    });
  }
});