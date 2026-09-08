import { test, expect } from '@playwright/test';

test.describe('APICollection DELETE requests', () => {
  test('DeleteAcc', async ({ request }) => {
    const response = await request.delete('https://automationexercise.com/api/deleteAccount', {
      form: {
        email: 'test6942069@gmail.com',
        password: '123password',
      },
    });

    expect(response.ok()).toBeTruthy();
  });
});