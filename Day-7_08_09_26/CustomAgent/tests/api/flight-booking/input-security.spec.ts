import { test, expect } from '@playwright/test';
import { baseUrl, securityInputs } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const input of securityInputs) {
    test(`Protect flight inputs: ${input.slice(0, 16)}`, async ({ request }) => {
      const response = await request.get(`${baseUrl}?departure=${encodeURIComponent(input)}`);
      expect(response.status()).toBeLessThan(500);
      expect(await response.text()).not.toMatch(/stack trace|syntax error/i);
    });
  }
});