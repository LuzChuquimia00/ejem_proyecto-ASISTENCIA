// api/justificar.spec.ts

import { test, expect } from '@playwright/test';
import { createJustification, consultas } from '../utils/pocketbase';

test('El backend registra y recupera una ausencia justificada', async () => {
    // 1. Obtiene un estudiante que ya fue marcado como 'absent' por el globalSetup.
    const absentStudentResponse = await consultas.get('/api/collections/attendance_management/records?filter=(state="absent")');
    const absentStudent = absentStudentResponse.data.items[0];

    // 2. Crea una justificación 'A.J' para el estudiante ausente.
    const justifiedAbsence = await createJustification(absentStudent.student, '1°C', 'A.J');
    
    // 3. Valida la justificación creada.
    expect(justifiedAbsence.type).toBe('A.J');

    // 4. Filtra y valida que el registro existe para este estudiante.
    const response = await consultas.get(`/api/collections/management_of_justifications/records?filter=(student~'${absentStudent.student}')`);
    const data = response.data;

    // Se espera exactamente un registro, el que acabamos de crear.
    expect(data.items.length).toBe(1);
    expect(data.items[0].student).toContain(absentStudent.student);
    expect(data.items[0].type).toBe('A.J');

    // 5. Limpia los datos creados por este test para evitar interferencias futuras.
    const justificationId = justifiedAbsence.id;
    await consultas.delete(`/api/collections/management_of_justifications/records/${justificationId}`);
});