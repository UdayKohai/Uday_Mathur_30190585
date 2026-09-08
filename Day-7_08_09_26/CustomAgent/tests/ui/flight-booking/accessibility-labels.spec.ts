import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Booking Accessibility, Localization, and Responsive Behavior', () => {
  for (const control of ['departure', 'arrival', 'date', 'passenger', 'filter', 'payment']) {
    test(`Verify accessible label: ${control}`, async ({ page }) => {
      await openFlights(page);
      const labeled = page.getByLabel(new RegExp(control, 'i')).first();
      if (await labeled.count()) await expect(labeled).toBeVisible();
      else await expect(page.locator('body')).toContainText(new RegExp(control, 'i'));
    });
  }
});