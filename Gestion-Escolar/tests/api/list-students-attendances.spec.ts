// --- ¡La corrección es aquí! ---
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents, createAttendance } from './pocketbase-test-helpers.js';


test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});


// Criterio: "Permitir Listar Alumnos y Asistencias"
test('El backend permite obtener la lista de todos los alumnos', async ({ request }) => {
    const students = await createStudents(10, request);
    expect(students.length).toBe(10);
});


test('El backend permite obtener la lista de todas las asistencias', async ({ request }) => {
    // Tendrías que crear una función para crear asistencias en tu helper
     const student = (await createStudents(1, request))[0];
     // Ahora esta línea funcionará porque la función ha sido importada
     await createAttendance(request, student.id, '1°C', 'present');


     const attendanceResponse = await request.get('/api/collections/attendance_management/records');
     const attendanceData = await attendanceResponse.json();
     expect(attendanceData.items.length).toBe(1);
});
