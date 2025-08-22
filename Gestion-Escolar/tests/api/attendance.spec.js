// tests/api/attendance.spec.js
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents } from './pocketbase-test-helpers.js';

test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});

test('El backend registra una nueva asistencia correctamente y se puede verificar', async ({ request }) => {
    // 1. Crea el estudiante y asegúrate de que el ID se obtenga correctamente
    const students = await createStudents(1, request);
    const student = students[0];

    // 2. Ahora crea la asistencia, usando el ID del estudiante
    const attendanceResponse = await request.post('/api/collections/attendance_management/records', {
        data: {
            student: student.id, // Asegúrate de que `student.id` es un string válido
            state: 'present',
            course: '1C'
        }
    });

    // El error 400 indica que PocketBase rechazó los datos.
    // Podría ser por un campo que falta (`course`) o que el `id` del estudiante no existe.
    // Tu `createStudents` crea el estudiante, por lo que el `id` es válido.
    // Asegúrate de que el campo `course` está en tu colección de `attendance_management`.
    expect(attendanceResponse.status()).toBe(200);

    const attendanceData = await attendanceResponse.json();
    expect(attendanceData.state).toBe('present');
});