import { test, expect } from '@playwright/test';
import { baseUrl, validSearches } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const data of validSearches.slice(0, 2)) {
    test(`Protect concurrent search context: ${data.departureCity}`, async ({ browser }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a stable flight fixture');
      const context = await browser.newContext();
      const first = await context.newPage();
      const second = await context.newPage();
      await Promise.all([first.goto(baseUrl), second.goto(baseUrl)]);
      await expect(first).toHaveURL(/phptravels/);
      await expect(second).toHaveURL(/phptravels/);
      await context.close();
    });
  }
});