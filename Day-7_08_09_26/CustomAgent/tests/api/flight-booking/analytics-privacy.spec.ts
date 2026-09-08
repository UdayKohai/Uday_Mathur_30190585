import { test, expect } from '@playwright/test';
import { baseUrl, paymentFixtures } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const event of ['search', 'selection', 'review', 'payment-success', 'payment-failure']) {
    test(`Verify private analytics payload for ${event}`, async ({ request }) => {
      const response = await request.get(`${baseUrl}?analyticsEvent=${event}`);
      const body = await response.text();
      expect(body).not.toMatch(/password|cvv|api[_-]?key|authorization/i);
      expect(paymentFixtures).toContain('sandbox.success');
    });
  }
});