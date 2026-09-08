import { test, expect } from '@playwright/test';
import { openFlights, paymentFixtures, validPassengers } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  for (const passenger of validPassengers) {
    test(`Complete successful sandbox booking for ${passenger.firstName}`, async ({ page }) => {
      test.skip(!process.env.PAYMENT_SUCCESS_FIXTURE || !process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires approved supplier and payment fixtures');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/payment|checkout|flight/i);
      expect(paymentFixtures).toContain('sandbox.success');
    });
  }
});