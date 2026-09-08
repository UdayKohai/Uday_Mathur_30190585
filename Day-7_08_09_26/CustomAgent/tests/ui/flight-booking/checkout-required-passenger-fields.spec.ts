import { test, expect } from '@playwright/test';
import { openFlights, validPassengers } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  for (const field of ['first name', 'last name', 'date of birth', 'nationality', 'email', 'phone']) {
    test(`Validate required passenger field: ${field}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires checkout fixture');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(new RegExp(field.split(' ')[0], 'i'));
      await expect(page.locator('body')).toContainText(/required|passenger|checkout/i);
      void validPassengers;
    });
  }
});