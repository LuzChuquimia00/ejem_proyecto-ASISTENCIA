// tests/api/differentiate-absences.spec.ts
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents, createJustification } from './pocketbase-test-helpers.js';

test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});

// Criterio: "Diferenciar Ausencias en los Datos"
test('El backend permite guardar y diferenciar ausencias justificadas', async ({ request }) => {
    const student = (await createStudents(1, request))[0];
    const justifiedAbsence = await createJustification(request, student.id, '1°C', 'A.J');
    expect(justifiedAbsence.type).toBe('A.J');

    const unjustifiedAbsence = await createJustification(request, student.id, '1°C', 'S.J');
    expect(unjustifiedAbsence.type).toBe('S.J');
});