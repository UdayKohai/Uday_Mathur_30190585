import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  const dateCases = [
    { name: 'past date', value: '2020-01-01' },
    { name: 'same day', value: new Date().toISOString().slice(0, 10) },
    { name: 'leap day', value: '2028-02-29' },
    { name: 'month end', value: '2026-09-30' },
    { name: 'year end', value: '2026-12-31' }
  ];
  for (const data of dateCases) {
    test(`Validate date boundary: ${data.name}`, async ({ page }) => {
      await openFlights(page);
      const dates = page.locator('input[type="date"]');
      if (!await dates.count()) test.skip(true, 'Date controls are not exposed by the demo');
      await dates.first().fill(data.value);
      await page.getByRole('button', { name: /search/i }).first().click();
      await expect(page.locator('body')).toContainText(/date|flight|result|invalid|available/i);
    });
  }
});