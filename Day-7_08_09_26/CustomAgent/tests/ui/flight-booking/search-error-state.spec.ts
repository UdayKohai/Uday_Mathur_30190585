import { test, expect } from '@playwright/test';
import { fillFlightSearch, openFlights, validSearches } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  for (const data of validSearches) {
    test(`Preserve safe input after validation failure: ${data.departureCity}`, async ({ page }) => {
      await openFlights(page);
      await fillFlightSearch(page, data);
      const inputs = page.locator('input');
      if (await inputs.count() < 3) test.skip(true, 'Flight form fields are not exposed by the demo');
      await inputs.nth(2).fill('not-a-passenger-count');
      await page.getByRole('button', { name: /search/i }).first().click();
      await expect(inputs.first()).toHaveValue(data.departureCity);
      await expect(inputs.nth(1)).toHaveValue(data.arrivalCity);
    });
  }
});