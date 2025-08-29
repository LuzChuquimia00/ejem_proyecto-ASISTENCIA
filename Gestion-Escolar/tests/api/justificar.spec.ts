// tests/api/justified-absences.spec.ts
import { test, expect } from '@playwright/test';
import { createStudents, createJustification } from '../utils/pocketbase';

// No es necesario un 'beforeEach' porque globalSetup ya prepara la base de datos.
// La lógica para crear datos de prueba específicos para un test se hace dentro del test mismo.

// Criterio: "Registrar y Obtener Ausencia Justificada"
test('El backend registra y recupera una ausencia justificada', async ({ request }) => {
    // 1. Crear un estudiante para este test.
    // Usamos la función refactorizada que no necesita 'request'.
    const student = (await createStudents(1))[0];

    // 2. Registrar una justificación de tipo "Ausencia Justificada" (A.J).
    // Usamos la función refactorizada que no necesita 'request'.
    const justifiedAbsence = await createJustification(student.id, '1°C', 'A.J');

    // 3. Validar que la justificación se creó con el tipo correcto.
    expect(justifiedAbsence.type).toBe('A.J');

    // 4. Obtenemos todos los registros de justificaciones.
    // Usamos el objeto 'request' de Playwright para una prueba de API directa.
    const response = await request.get('/api/collections/management_of_justifications/records');
    const data = await response.json();

    // 5. Validamos que hay exactamente un registro y que está vinculado al estudiante correcto.
    expect(data.items.length).toBe(1);
    expect(data.items[0].student).toBe(student.id);
    expect(data.items[0].type).toBe('A.J');
});
