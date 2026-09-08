import { test, expect } from '@playwright/test';
import { openFlights, validSearches } from '../../flight-booking-data';

test.describe('Flight Results, Comparison, and Selection', () => {
  for (const data of validSearches) {
    test(`Display flight results: ${data.departureCity} to ${data.arrivalCity}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires multiple flight-result fixture');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/price|departure|flight/i);
    });
  }
});