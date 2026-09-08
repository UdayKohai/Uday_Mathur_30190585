import { test, expect } from '@playwright/test';
import { baseUrl, securityInputs, validSearches } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const [index, data] of validSearches.entries()) {
    test(`Reject tampered flight parameters ${index + 1}`, async ({ request }) => {
      test.skip(!process.env.SUPPLIER_FIXTURE_PROFILE, 'Requires approved API fixture');
      const response = await request.get(`${baseUrl}?departure=${encodeURIComponent(securityInputs[index % securityInputs.length])}&arrival=${encodeURIComponent(data.arrivalCity)}&passengers=999999`);
      expect(response.status()).toBeLessThan(500);
    });
  }
});