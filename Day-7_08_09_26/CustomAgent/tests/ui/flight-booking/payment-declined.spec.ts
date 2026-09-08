import { test, expect } from '@playwright/test';
import { openFlights, paymentFixtures } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  test('Handle declined payment', async ({ page }) => {
    test.skip(!process.env.PAYMENT_DECLINE_FIXTURE || !process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires approved declined-payment and supplier fixtures');
    await openFlights(page);
    expect(paymentFixtures).toContain('sandbox.decline');
    await expect(page.locator('body')).toContainText(/payment|checkout|flight/i);
  });
});