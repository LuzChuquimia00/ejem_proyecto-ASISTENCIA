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
<<<<<<< HEAD

    // Aquí no se espera un elemento con el id '#porcentaje_asistencia',
    // sino que la página muestra el título y el contador de asistencias.
=======
<<<<<<< HEAD
    await expect(page.locator('#porcentaje_asistencia')).toContainText('0 / 12');
=======
    await page.getByText('/ 7').click();
    await expect(page.locator('#porcentaje_asistencia')).toContainText('0 / 0');
>>>>>>> 3114df608951ebdf72c09fb13c63f819ef8b716c
>>>>>>> 31738e1ffa12120e9bb65310b142b62314b55c63
});