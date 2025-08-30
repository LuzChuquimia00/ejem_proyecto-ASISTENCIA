import { test, expect } from '@playwright/test';

test('Validar que la colección "Asistencias" muestre el titulo y un contador numérico', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByText('Asistencias', { exact: true }).click();
    await expect(page.getByRole('main')).toContainText('Asistencias');
<<<<<<< HEAD
    await expect(page.locator('#porcentaje_asistencia')).toContainText('0 / 12');
=======
    await page.getByText('/ 7').click();
    await expect(page.locator('#porcentaje_asistencia')).toContainText('0 / 0');
>>>>>>> 3114df608951ebdf72c09fb13c63f819ef8b716c
});