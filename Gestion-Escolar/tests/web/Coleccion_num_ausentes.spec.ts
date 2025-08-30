import { test, expect } from '@playwright/test';

test('Validar que la colección "Ausentes" muestre el titulo y un contador numérico', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByText('Ausentes', { exact: true }).click();
    await expect(page.getByRole('main')).toContainText('Ausentes');
    await page.locator('#ausentes').click();
    await expect(page.locator('#ausentes')).toContainText('2');
});