// spec: specs/api-video-games-controller-v2-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const baseUrl = 'https://videogamedb.uk';
const testData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../testdata/put.json'), 'utf-8'),
);

test.describe('api-video-games-controller-v-2', () => {
  testData.forEach((testCase: any) => {
    test(testCase.name, async ({ request }) => {
      // 1. Send the PUT request defined by the test data.
      const response = await request.put(`${baseUrl}${testCase.path}`, {
        headers: testCase.headers,
        data: testCase.body,
      });

      expect(response.status()).toBe(testCase.expectedStatus);
      expect(await response.text()).toBe(testCase.expectedBody);
    });
  });
});
