import { test, expect } from '@playwright/test';
import { baseUrl } from '../../flight-booking-data';

test.describe('Flight Booking Security, Integration, and Reliability', () => {
  test('Verify HTTPS and session cookie security', async ({ request }) => {
    const response = await request.get(baseUrl);
    expect(new URL(response.url()).protocol).toBe('https:');
    const setCookie = response.headers()['set-cookie'] ?? '';
    if (setCookie) expect(setCookie).toMatch(/secure/i);
  });
});