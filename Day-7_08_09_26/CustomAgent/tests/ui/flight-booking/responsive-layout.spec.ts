import { test, expect } from '@playwright/test';
import { openFlights, viewports } from '../../flight-booking-data';

test.describe('Flight Booking Accessibility, Localization, and Responsive Behavior', () => {
  for (const viewport of viewports) {
    test(`Verify responsive flight layout: ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openFlights(page);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).toContainText(/flight|search/i);
    });
  }
});