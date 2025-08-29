import { test, expect } from '@playwright/test';
import { createStudents } from '../utils/pocketbase';

test('El backend rechaza datos invalidos y mantiene la integridad de la base de datos', async ({ request }) => {
    // 1. Obtén el conteo inicial de estudiantes.
    const initialStudentsResponse = await request.get('/api/collections/students/records');
    const initialStudentsData = await initialStudentsResponse.json();
    const initialStudentsCount = initialStudentsData.items.length;

    // 2. Intenta crear un estudiante con un tipo de sangre no válido.
    const invalidStudentResponse = await request.post('/api/collections/students/records', {
        data: { name: 'Invalid', surname: 'User', course: '1°C', blood_type: 'Z+' }
    });
    
    // Verifica que la petición falle (status 400 = Bad Request).
    expect(invalidStudentResponse.status()).toBe(400);

    // 3. Verifica que el conteo de estudiantes no ha cambiado.
    const studentsAfterResponse = await request.get('/api/collections/students/records');
    const studentsAfterData = await studentsAfterResponse.json();
    expect(studentsAfterData.items.length).toBe(initialStudentsCount);
});