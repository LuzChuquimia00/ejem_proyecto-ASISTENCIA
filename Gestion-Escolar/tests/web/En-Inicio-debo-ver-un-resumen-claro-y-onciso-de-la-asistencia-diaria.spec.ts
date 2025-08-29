import { test, expect } from '@playwright/test';

test('Verificar que el título principal de la página sea Gestion De Inicio y que el subtítulo Resumen general del estado de las asistencias en tiempo real se muestre correctamente', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('heading', { name: 'Gestion de Inicio' }).click();
    await expect(page.getByRole('heading')).toContainText('Gestion de Inicio');
    await page.getByText('Resumen general del estado de').click();
    await expect(page.getByRole('main')).toContainText('Resumen general del estado de las asistencias en tiempo real.');
});