// web/coleccion_numerico_asistencias.spec.ts

import { test, expect } from '@playwright/test';

test('Validar que la colección "Asistencias" muestre el titulo y un contador numérico', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // 1. Validar el título del contador y su valor numérico.
    await expect(page.getByText('Asistencias', { exact: true })).toBeVisible();
    await expect(page.getByText('5 / 10')).toBeVisible();

    // 2. Hacer clic en el contenedor para navegar a la siguiente página.
    await page.getByText('Asistencias', { exact: true }).click();
    
    // 3. Validar que la nueva página muestre el título correcto.
    await expect(page.getByRole('main')).toContainText('Asistencias');

    // Aquí no se espera un elemento con el id '#porcentaje_asistencia',
    // sino que la página muestra el título y el contador de asistencias.
});