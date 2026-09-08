// spec: specs/api-video-games-controller-v2-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const baseUrl = 'https://videogamedb.uk';
const testData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../testdata/get.json'), 'utf-8'),
);

test.describe('api-video-games-controller-v-2', () => {
  testData.forEach((testCase: any) => {
    test(testCase.name, async ({ request }) => {
      // 1. Send the GET request defined by the test data.
      const response = await request.get(`${baseUrl}${testCase.path}`, {
        headers: testCase.headers,
      });

      expect(response.status()).toBe(testCase.expectedStatus);
      const responseBody = await response.text();
      if (testCase.expectedBodyPattern) {
        expect(responseBody).toMatch(new RegExp(testCase.expectedBodyPattern));
      } else {
        expect(responseBody).toBe(testCase.expectedBody);
      }
    });
  });
});
