// tests/api/source-of-truth.spec.ts
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents } from './pocketbase-test-helpers.js';


test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});


// Criterio: "Ser la Fuente de Verdad"
test('El backend rechaza datos invalidos y mantiene la integridad de la base de datos', async ({ request }) => {
    // Intenta crear un estudiante con un tipo de sangre no valido
    const invalidStudentResponse = await request.post('/api/collections/students/records', {
        data: { name: 'Invalid', surname: 'User', course: '1°C', blood_type: 'Z+' }
    });
    // Verifica que la peticion falle (status 400 = Bad Request)
    expect(invalidStudentResponse.status()).toBe(400);


    // Verifica que el estudiante no fue creado en la base de datos
    const studentsResponse = await request.get('/api/collections/students/records');
    const studentsData = await studentsResponse.json();
    expect(studentsData.items.length).toBe(0);
});
