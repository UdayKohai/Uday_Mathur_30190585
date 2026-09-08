import { test, expect } from '@playwright/test';
import { baseUrl } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const change of ['price', 'availability']) {
    test(`Handle stale supplier ${change}`, async ({ request }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires a supplier mutation fixture');
      const response = await request.get(`${baseUrl}?supplierChange=${change}`);
      expect(response.status()).toBeLessThan(500);
      expect(await response.text()).toMatch(/price|available|change|flight/i);
    });
  }
});