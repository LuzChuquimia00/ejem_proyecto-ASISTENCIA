// tests/api/students.spec.ts
import { test, expect } from '@playwright/test';
import { createStudents, createJustification, createAttendance } from '../utils/pocketbase';

// Criterio: "Proveer Datos Crudos"
test('El backend provee acceso a los datos crudos de las colecciones', async ({ request }) => {
    // 1. Prepara los datos necesarios para la prueba.
    const student = (await createStudents(1))[0];
    await createJustification(student.id, '1°C', 'A.J');
    await createAttendance(student.id, '1°C', 'present');

    // 2. Realiza las solicitudes a cada colección.
    const studentsResponse = await request.get('/api/collections/students/records');
    const attendanceResponse = await request.get('/api/collections/attendance_management/records');
    const justificationsResponse = await request.get('/api/collections/management_of_justifications/records');

    // 3. Valida que las respuestas sean exitosas y que contengan los datos esperados.
    expect(studentsResponse.status()).toBe(200);
    expect(await studentsResponse.json()).toHaveProperty('items');
    expect((await studentsResponse.json()).items.length).toBe(1);

    expect(attendanceResponse.status()).toBe(200);
    expect(await attendanceResponse.json()).toHaveProperty('items');
    expect((await attendanceResponse.json()).items.length).toBe(1);

    expect(justificationsResponse.status()).toBe(200);
    expect(await justificationsResponse.json()).toHaveProperty('items');
    expect((await justificationsResponse.json()).items.length).toBe(1);
});
