import { test, expect } from '@playwright/test';

test.describe('APICollection POST requests', () => {
  test('SearchProduct', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      form: {
        search_product: 'top',
      },
    });

    expect(response.ok()).toBeTruthy();
  });

  test('create acc', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/createAccount', {
      form: {
        name: 'test',
        email: 'test6942069@gmail.com',
        password: '123password',
        title: 'Mr',
        birth_date: '01',
        birth_month: '01',
        birth_year: '2000',
        firstname: 'test',
        lastname: 'test',
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