import { test, expect } from '@playwright/test';

test('Validar que la colección "Ausentes" muestre el titulo y un contador numérico', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByText('Ausentes', { exact: true }).click();
    await expect(page.getByRole('main')).toContainText('Ausentes');
    await page.locator('#ausentes').click();
<<<<<<< HEAD
    await expect(page.locator('#ausentes')).toContainText('12');
=======
    await expect(page.locator('#ausentes')).toContainText('2');
>>>>>>> 3114df608951ebdf72c09fb13c63f819ef8b716c
});