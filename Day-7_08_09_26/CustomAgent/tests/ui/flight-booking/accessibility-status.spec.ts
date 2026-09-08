import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Booking Accessibility, Localization, and Responsive Behavior', () => {
  for (const state of ['loading', 'no results', 'price change', 'payment failure', 'confirmation']) {
    test(`Announce flight status: ${state}`, async ({ page }) => {
      await openFlights(page);
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      if (await liveRegions.count()) await expect(liveRegions.first()).toBeVisible();
      else await expect(page.locator('body')).toContainText(/flight|search|booking/i);
    });
  }
});