const { test, expect } = require('@playwright/test');

test('home loads and shows title', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  const title = await page.textContent('h1') || '';
  expect(title.length).toBeGreaterThan(0);
});
