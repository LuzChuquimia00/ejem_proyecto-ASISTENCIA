// api/justificacion-errores.spec.ts

import { test, expect } from '@playwright/test';
import { consultas } from '../utils/pocketbase';

test('El backend rechaza una justificación sin tipo de justificación', async () => {
    // 1. Obtiene un ID de estudiante válido del globalSetup.
    const absentStudentResponse = await consultas.get('/api/collections/attendance_management/records?filter=(state="absent")');
    const absentStudent = absentStudentResponse.data.items[0];

    // 2. Intenta crear una justificación con el campo 'type' vacío.
    const invalidJustificationResponse = await consultas.post('/api/collections/management_of_justifications/records', {
        student: [absentStudent.student],
        course: '1°C',
        type: '' // Tipo de justificación vacío
    });

    // 3. Valida que el backend responde con un error 400 (Bad Request).
    expect(invalidJustificationResponse.status).toBe(400);
});