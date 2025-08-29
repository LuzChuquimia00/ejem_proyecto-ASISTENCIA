// tests/api/differentiate-absences.spec.ts

import { test, expect } from '@playwright/test';
import { createStudents, createJustification } from '../utils/pocketbase';

// No es necesario un 'beforeEach' porque globalSetup ya prepara la DB
// y este test crea sus propios datos de justificación específicos.
// test.beforeEach(async ({ request }) => {
//     await clearCollections(request);
// });

// Criterio: "Diferenciar Ausencias en los Datos"
test('El backend permite guardar y diferenciar ausencias justificadas', async () => {
    // 1. Creamos un estudiante de prueba específico para este test.
    // La función createStudents ahora está en utils/pocketbase.ts y no requiere el objeto 'request'.
    const student = (await createStudents(1))[0];

    // 2. Creamos y validamos una ausencia justificada.
    // La función createJustification no requiere el objeto 'request' y sus parámetros fueron reordenados.
    const justifiedAbsence = await createJustification(student.id, '1°C', 'A.J');
    expect(justifiedAbsence.type).toBe('A.J');

    // 3. Creamos y validamos una ausencia no justificada.
    const unjustifiedAbsence = await createJustification(student.id, '1°C', 'S.J');
    expect(unjustifiedAbsence.type).toBe('S.J');
});
