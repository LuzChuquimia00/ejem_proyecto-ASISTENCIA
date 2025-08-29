// tests/api/unjustified-absences.spec.ts
import { test, expect } from '@playwright/test';
import { createStudents, createJustification } from '../utils/pocketbase';

// No es necesario un 'beforeEach' porque globalSetup ya prepara la base de datos.

// Criterio: "Registrar y Obtener Ausencia Sin Justificar"
test('El backend registra y recupera una ausencia sin justificar', async ({ request }) => {
    // 1. Crear un estudiante para este test.
    // Usamos la función refactorizada que no necesita 'request'.
    const student = (await createStudents(1))[0];

    // 2. Registrar una justificación de tipo "Ausencia Sin Justificar" (S.J).
    // Usamos la función refactorizada que no necesita 'request'.
    const unjustifiedAbsence = await createJustification(student.id, '1°C', 'S.J');

    // 3. Validar que la justificación se creó con el tipo correcto.
    expect(unjustifiedAbsence.type).toBe('S.J');

    // 4. Obtener todos los registros de justificaciones.
    // Usamos el objeto 'request' de Playwright para una prueba de API directa.
    const response = await request.get('/api/collections/management_of_justifications/records');
    const data = await response.json();

    // 5. Validar que hay un solo registro y que está vinculado al estudiante correcto.
    expect(data.items.length).toBe(1);
    expect(data.items[0].student).toBe(student.id);
    expect(data.items[0].type).toBe('S.J');
});
