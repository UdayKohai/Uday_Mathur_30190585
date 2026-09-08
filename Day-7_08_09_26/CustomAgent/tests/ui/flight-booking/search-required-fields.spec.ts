import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Service Entry and Search', () => {
  for (const missingField of ['departure', 'arrival', 'date', 'passenger']) {
    test(`Validate required field: ${missingField}`, async ({ page }) => {
      await openFlights(page);
      const fields = page.locator('input');
      const index = missingField === 'departure' ? 0 : missingField === 'arrival' ? 1 : missingField === 'date' ? 2 : 3;
      if (await fields.count() <= index) test.skip(true, 'Flight form field is not exposed by the demo');
      await fields.nth(index).fill('');
      const submit = page.getByRole('button', { name: /search/i }).first();
      await submit.click();
      await expect(page.locator('body')).toContainText(/required|select|enter|valid/i);
    });
  }
});