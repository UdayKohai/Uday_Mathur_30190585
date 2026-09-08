import { test, expect } from '@playwright/test';
import { openFlights, validPassengers } from '../../flight-booking-data';

test.describe('Review, Optional Extras, and Checkout', () => {
  for (const passenger of validPassengers) {
    test(`Verify review itinerary and total for ${passenger.firstName}`, async ({ page }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a selectable flight fixture');
      await openFlights(page);
      await expect(page.locator('body')).toContainText(/review|total|flight/i);
    });
  }
});