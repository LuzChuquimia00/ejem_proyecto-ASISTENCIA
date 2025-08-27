// tests/api/store-and-deliver-justifications.spec.ts
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents, createJustification } from './pocketbase-test-helpers.js';

test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});

// Criterio: "Almacenar y Entregar Justificaciones"
test('El backend almacena y entrega una lista de todas las justificaciones', async ({ request }) => {
    const student = (await createStudents(1, request))[0];
    await createJustification(request, student.id, '1°C', 'A.J');
    await createJustification(request, student.id, '1°C', 'S.J');

    const response = await request.get('/api/collections/management_of_justifications/records');
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.items.length).toBe(2);
});