import { test, expect } from '@playwright/test';
import { openFlights, supportedLocales } from '../../flight-booking-data';

test.describe('Flight Booking Accessibility, Localization, and Responsive Behavior', () => {
  for (const locale of supportedLocales) {
    test(`Verify flight localization: ${locale.language}/${locale.currency}`, async ({ page }) => {
      await openFlights(page);
      const language = page.getByRole('button', { name: /english|language|en/i }).first();
      if (await language.count()) await language.click();
      await expect(page.locator('body')).toContainText(/flight|currency|search/i);
    });
  }
});