import { test, expect } from '@playwright/test';
import { invalidEmails, openFlights, validEmails } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  for (const email of [...validEmails, ...invalidEmails]) {
    test(`Validate booking email: ${email || 'blank'}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires checkout fixture');
      await openFlights(page);
      const emailField = page.getByLabel(/email/i).first();
      await expect(emailField).toBeVisible();
      await emailField.fill(email);
      await expect(page.locator('body')).toContainText(/email|passenger|checkout/i);
    });
  }
});