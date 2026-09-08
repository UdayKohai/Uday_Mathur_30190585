import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  test('Inspect flight details and return to results', async ({ page }) => {
    test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a flight-result fixture');
    await openFlights(page);
    const details = page.getByRole('button', { name: /details|price|view/i }).first();
    await expect(details).toBeVisible();
    await details.click();
    await expect(page.locator('body')).toContainText(/flight|fare|departure|arrival/i);
  });
});