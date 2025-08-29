// tests/api/total-present.spec.ts
import { test, expect } from '@playwright/test';
import { createStudents, createAttendance } from '../utils/pocketbase';

// No es necesario un 'beforeEach' porque globalSetup ya prepara la base de datos.

// Criterio: "Conteo de Asistencias Presentes"
test('El backend puede obtener el total de estudiantes presentes', async ({ request }) => {
    // 1. Prepara los datos:
    // Creamos 3 estudiantes en total para tener un escenario claro.
    const totalStudents = 3;
    const students = await createStudents(totalStudents);

    // 2. Definimos cuántos estarán presentes.
    const presentCount = 2;
    for (let i = 0; i < presentCount; i++) {
        await createAttendance(students[i].id, '1°C', 'present');
    }

    // 3. Obtenemos el resumen del dashboard.
    const summaryResponse = await request.get('/api/collections/dashboard_summary/records');
    const summaryData = await summaryResponse.json();

    // 4. Validamos los datos.
    // Verificamos que se devuelva un array con un registro de resumen.
    expect(summaryData.items).toBeInstanceOf(Array);
    expect(summaryData.items.length).toBeGreaterThan(0);

    // Accedemos al registro de resumen.
    const summaryRecord = summaryData.items[0];

    // Validamos que el contador de 'present' sea igual a la cantidad que creamos.
    expect(summaryRecord.present).toBe(presentCount);
});
