// web/coleccion_num_justificaciones.spec.ts

import { test, expect } from '@playwright/test';

test('Validar que la colección "justificaciones" muestre el titulo y un contador numérico', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // 1. Valida que el título y el contador numérico de "Justificaciones" existen.
    await expect(page.getByText('Justificaciones')).toBeVisible();
    await expect(page.locator('#justificaciones')).toContainText('0');

    // 2. Hacer clic en el contenedor para navegar a la siguiente página.
    await page.getByText('Justificaciones').click();
    
    // 3. Valida que la nueva página muestre el título correcto.
    await expect(page.getByRole('main')).toContainText('Justificaciones');
<<<<<<< HEAD
=======
    await page.locator('#justificaciones').click();
    await expect(page.locator('#justificaciones')).toContainText('0');
>>>>>>> 31738e1ffa12120e9bb65310b142b62314b55c63
});