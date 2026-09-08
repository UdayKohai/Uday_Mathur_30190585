import type { Page } from '@playwright/test';

export type FlightSearchData = {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin?: string;
};

export type PassengerData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phone: string;
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const baseUrl = process.env.PHPTRAVELS_BASE_URL ?? 'https://phptravels.net/';
export const validSearches: FlightSearchData[] = [
  { departureCity: process.env.FLIGHT_DEPARTURE_CITY ?? 'London', arrivalCity: process.env.FLIGHT_ARRIVAL_CITY ?? 'Paris', departureDate: addDays(14), returnDate: addDays(21), passengers: 1, cabin: 'Economy' },
  { departureCity: 'Dubai', arrivalCity: 'New York', departureDate: addDays(21), returnDate: addDays(28), passengers: 4, cabin: 'Economy' },
  { departureCity: 'New York', arrivalCity: 'Los Angeles', departureDate: addDays(30), passengers: 2, cabin: 'Economy' }
];
export const validPassengers: PassengerData[] = [
  { firstName: 'Amina', lastName: 'Carter', dateOfBirth: '1990-04-15', nationality: 'United Kingdom', email: 'phptravels.flight.001@example.test', phone: '+447700900001' },
  { firstName: 'Mateo', lastName: 'Silva', dateOfBirth: '1985-11-22', nationality: 'Spain', email: 'phptravels.flight.002@example.test', phone: '+34600000002' },
  { firstName: 'Zoe', lastName: "O'Connor", dateOfBirth: '1988-07-09', nationality: 'Ireland', email: 'phptravels.flight.004@example.test', phone: '+353850000004' }
];
export const invalidPassengers: Array<number | string> = [0, -1, 1.5, 'abc', 999999999999];
export const invalidEmails = ['', 'plainaddress', 'traveler@@example.test', 'traveler@', '@example.test', 'traveler name@example.test', 'traveler@example..test'];
export const validEmails = ['phptravels.flight.001@example.test', 'qa+flight.002@example.test', 'traveler.name@example.co.uk'];
export const specialNames = ["O'Connor", 'Jean-Luc', 'José', 'Müller', '李', 'Αλέξανδρος'];
export const invalidNames = ['12345', '   ', '<script>alert(1)</script>', "' OR '1'='1", 'A'.repeat(256)];
export const supportedLocales = [{ language: 'en-US', currency: 'USD' }, { language: 'en-GB', currency: 'GBP' }, { language: 'fr-FR', currency: 'EUR' }, { language: 'ja-JP', currency: 'JPY' }];
export const viewports = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile-portrait', width: 390, height: 844 }, { name: 'mobile-landscape', width: 844, height: 390 }];
export const paymentFixtures = ['sandbox.success', 'sandbox.decline', 'sandbox.expired', 'sandbox.malformed', 'sandbox.cancelled', 'sandbox.timeout', 'sandbox.pending'];
export const securityInputs = ["<script>alert('x')</script>", '"><img src=x onerror=alert(1)>', "' OR '1'='1", '../../../../etc/passwd', 'javascript:alert(1)'];

export async function openFlights(page: Page) {
  await page.goto(baseUrl);
  const flights = page.getByRole('link', { name: /flight/i }).first().or(page.getByRole('button', { name: /flight/i }).first());
  if (await flights.count()) await flights.click();
}

export async function fillFlightSearch(page: Page, data: FlightSearchData = validSearches[0]) {
  const inputs = page.locator('input');
  if (await inputs.count() > 0) await inputs.nth(0).fill(data.departureCity);
  if (await inputs.count() > 1) await inputs.nth(1).fill(data.arrivalCity);
  const dates = page.locator('input[type="date"]');
  if (await dates.count() > 0) await dates.nth(0).fill(data.departureDate);
  if (data.returnDate && await dates.count() > 1) await dates.nth(1).fill(data.returnDate);
}
