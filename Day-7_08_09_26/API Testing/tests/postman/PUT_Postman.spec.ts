import { test, expect } from '@playwright/test';

test.describe('APICollection PUT requests', () => {
  test('updateacc', async ({ request }) => {
    const response = await request.put('https://automationexercise.com/api/updateAccount', {
      form: {
        name: 'test',
        email: 'test6942069@gmail.com',
        password: '123password',
        title: 'Mr',
        birth_date: '01',
        birth_month: '01',
        birth_year: '2007',
        firstname: 'testnew',
        lastname: 'testnew',
        company: 'capgemini',
        address1: 'ABC',
        address2: 'DEF',
        zipcode: '303030',
        state: 'Rajasthan',
        city: 'Alwar',
        mobile_number: '1234567890',
        country: 'India',
      },
    });

    expect(response.ok()).toBeTruthy();
  });
});