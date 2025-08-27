import { test, expect } from '@playwright/test';
import { clearCollections, createStudents } from './pocketbase-test-helpers.js';


test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});


// Criterio: "Proveer Datos Crudos"
test('El backend provee acceso a los datos crudos de las colecciones', async ({ request }) => {
    // Provee los datos crudos de estudiantes
    const studentsResponse = await request.get('/api/collections/students/records');
    const studentsData = await studentsResponse.json();
    expect(studentsResponse.status()).toBe(200);


    // Provee los datos crudos de asistencias
    const attendanceResponse = await request.get('/api/collections/attendance_management/records');
    const attendanceData = await attendanceResponse.json();
    expect(attendanceResponse.status()).toBe(200);


    // Provee los datos crudos de justificaciones
    const justificationsResponse = await request.get('/api/collections/management_of_justifications/records');
    const justificationsData = await justificationsResponse.json();
    expect(justificationsResponse.status()).toBe(200);
});
