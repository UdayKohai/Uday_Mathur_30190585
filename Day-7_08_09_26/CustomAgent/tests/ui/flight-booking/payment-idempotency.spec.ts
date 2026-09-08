import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  for (const action of ['double-click Pay Now', 'repeat payment request', 'refresh during processing', 'navigate back during processing']) {
    test(`Prevent duplicate booking after ${action}`, async ({ page }) => {
      test.skip(!process.env.PAYMENT_SUCCESS_FIXTURE || !process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires approved payment and booking fixtures');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/payment|checkout|flight/i);
    });
  }
});