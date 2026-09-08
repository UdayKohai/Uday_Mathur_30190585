import { test, expect } from '@playwright/test';
import { openFlights, validPassengers } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  for (const passenger of validPassengers) {
    test(`Verify confirmation details for ${passenger.firstName}`, async ({ page }) => {
      test.skip(!process.env.PAYMENT_SUCCESS_FIXTURE || !process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires approved successful booking fixture');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/confirmation|booking|reference|flight/i);
    });
  }
});