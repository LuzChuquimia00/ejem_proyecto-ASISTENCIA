// tests/api/total-absences.spec.ts

import { test, expect } from '@playwright/test';
import { getDashboardSummary } from '../utils/pocketbase';

// No es necesario un 'beforeEach' porque globalSetup ya prepara la DB.
// test.beforeEach(async ({ request }) => {
//     // 🧹 Limpia la base de datos.
// });

// Criterio: "Conteo de Ausencias Totales"
test('El backend puede obtener el total de ausentes', async () => {
    // 1. Asume que los datos ya fueron creados por globalSetup.
    // En nuestro caso, creamos 10 estudiantes (5 presentes, 5 ausentes).
    const totalStudents = 10;
    const presentCount = 5;

    // 2. Obtenemos el resumen del dashboard directamente.
    // Ya no necesitas 'request' ni 'json()' porque la función devuelve los datos.
    const summaryData = await getDashboardSummary();

    // 3. Validamos los datos.
    expect(summaryData.items).toBeInstanceOf(Array);
    expect(summaryData.items.length).toBeGreaterThan(0);

    const summaryRecord = summaryData.items[0];

    // El total de ausencias esperado es el número total de estudiantes
    // menos los que están presentes.
    const expectedAbsences = totalStudents - presentCount;

    // Validamos que el contador 'absent' coincida con el cálculo.
    expect(summaryRecord.absent).toBe(expectedAbsences);
});
