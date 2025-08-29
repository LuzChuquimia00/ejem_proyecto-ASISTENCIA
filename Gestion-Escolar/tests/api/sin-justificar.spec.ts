import { test, expect } from '@playwright/test';
import { createStudents, createJustification, consultas } from '../utils/pocketbase';

test('El backend registra y recupera una ausencia sin justificar', async () => {
    // 1. Crea un estudiante y una justificación 'S.J'.
    const student = (await createStudents(1))[0];
    const unjustifiedAbsence = await createJustification(student.id, '1°C', 'S.J');
    
    // 2. Valida la justificación creada.
    expect(unjustifiedAbsence.type).toBe('S.J');

    // 3. Filtra y valida que el registro existe para este estudiante.
    const response = await consultas.get(`/api/collections/management_of_justifications/records?filter=(student~'${student.id}')`);
    const data = response.data;

    // Se espera exactamente un registro.
    expect(data.items.length).toBe(1);
    expect(data.items[0].student).toContain(student.id);
    expect(data.items[0].type).toBe('S.J');
});