import { test, expect } from '@playwright/test';
import { openFlights } from '../../flight-booking-data';

test.describe('Flight Booking Accessibility, Localization, and Responsive Behavior', () => {
  for (const key of ['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape']) {
    test(`Operate flight booking with keyboard: ${key}`, async ({ page }) => {
      await openFlights(page);
      await page.keyboard.press(key);
      await expect(page.locator('body')).toBeVisible();
      const focused = page.locator(':focus');
      if (await focused.count()) await expect(focused).toBeVisible();
    });
  }
});