import { test, expect } from '@playwright/test';

test('Confirmar que dedicada con el título Ausentes sin justificar', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByText('Ausentes sin justificar').click();
    await expect(page.getByRole('main')).toContainText('Ausentes sin justificar');
});
