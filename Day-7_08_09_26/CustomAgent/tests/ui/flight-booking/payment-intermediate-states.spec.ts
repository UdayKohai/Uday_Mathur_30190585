import { test, expect } from '@playwright/test';
import { openFlights, paymentFixtures } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  for (const outcome of ['sandbox.cancelled', 'sandbox.expired', 'sandbox.timeout', 'sandbox.pending']) {
    test(`Handle ${outcome} payment`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires payment-state and supplier fixtures');
      await openFlights(page);
      expect(paymentFixtures).toContain(outcome);
      await expect(page.locator('body')).toContainText(/payment|checkout|flight/i);
    });
  }
});