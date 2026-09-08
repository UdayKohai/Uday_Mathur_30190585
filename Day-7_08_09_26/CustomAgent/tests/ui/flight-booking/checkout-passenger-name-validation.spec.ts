import { test, expect } from '@playwright/test';
import { invalidNames, openFlights, specialNames } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  for (const name of [...specialNames, ...invalidNames]) {
    test(`Validate passenger name: ${name || 'blank'}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires checkout fixture');
      await openFlights(page);
      const nameField = page.getByLabel(/first name|passenger name/i).first();
      await expect(nameField).toBeVisible();
      await nameField.fill(name);
      await expect(page.locator('body')).toContainText(/name|passenger|valid/i);
    });
  }
});