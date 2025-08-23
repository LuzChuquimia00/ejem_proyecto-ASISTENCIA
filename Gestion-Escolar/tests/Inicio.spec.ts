import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading')).toContainText('Gestion de Inicio');
});