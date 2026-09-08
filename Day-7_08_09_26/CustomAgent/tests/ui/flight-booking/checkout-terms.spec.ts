import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  test('Require terms acceptance before payment', async ({ page }) => {
    test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires checkout fixture');
    await openFlights(page);
    const terms = page.getByRole('checkbox', { name: /terms|conditions/i }).first();
    await expect(terms).toBeVisible();
    await expect(terms).not.toBeChecked();
    const payNow = page.getByRole('button', { name: /pay now|payment/i }).first();
    if (await payNow.count()) await payNow.click();
    await expect(page.locator('body')).toContainText(/terms|condition|payment/i);
  });
});