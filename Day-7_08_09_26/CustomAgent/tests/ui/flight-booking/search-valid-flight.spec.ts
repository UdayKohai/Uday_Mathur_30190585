import { test, expect } from '@playwright/test';
import { fillFlightSearch, openFlights, validSearches } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  for (const data of validSearches) {
    test(`Search with valid flight criteria: ${data.departureCity} to ${data.arrivalCity}`, async ({ page }) => {
      await openFlights(page);
      await fillFlightSearch(page, data);
      await expect(page.locator('input').first()).toHaveValue(data.departureCity);
      await expect(page.locator('input').nth(1)).toHaveValue(data.arrivalCity);
      const submit = page.getByRole('button', { name: /search/i }).first();
      await expect(submit).toBeVisible();
      await submit.click();
      await expect(page.locator('body')).toContainText(/flight|result|no result/i);
    });
  }
});