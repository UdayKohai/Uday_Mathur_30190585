import { test } from '@playwright/test';

test.describe('api-video-games-controller-v-2', () => {
  test('seed', async ({ page }) => {
    await page.goto('https://videogamedb.uk/swagger-ui/index.html#/api-video-games-controller-v-2');
  });
});
