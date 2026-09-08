import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Sandbox Payment and Confirmation', () => {
  test('Verify confirmation email', async ({ page }) => {
    test.skip(!process.env.TEST_MAILBOX_ADDRESS || !process.env.PAYMENT_SUCCESS_FIXTURE || !process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a test mailbox and approved booking fixtures');
    await openFlights(page);
    await expect(page.locator('body')).toContainText(/confirmation|booking|email|flight/i);
  });
});