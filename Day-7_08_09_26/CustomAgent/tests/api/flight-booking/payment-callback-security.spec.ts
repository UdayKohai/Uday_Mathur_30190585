import { test, expect } from '@playwright/test';
import { baseUrl } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  for (const callback of ['replayed', 'altered', 'missing', 'delayed']) {
    test(`Validate ${callback} payment callback`, async ({ request }) => {
      test.skip(!process.env.PAYMENT_CALLBACK_ENDPOINT, 'Requires an approved payment callback fixture');
      const response = await request.post(process.env.PAYMENT_CALLBACK_ENDPOINT ?? `${baseUrl}payment/callback`, { data: { scenario: callback } });
      expect([400, 401, 403, 409, 422]).toContain(response.status());
    });
  }
});