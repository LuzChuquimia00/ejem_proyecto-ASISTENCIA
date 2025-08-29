import { test, expect } from '@playwright/test';
import { createStudents, createJustification, consultas } from '../utils/pocketbase';

test('El backend registra y recupera una ausencia justificada', async () => {
    // 1. Crea un estudiante y una justificación 'A.J'.
    const student = (await createStudents(1))[0];
    const justifiedAbsence = await createJustification(student.id, '1°C', 'A.J');
    
    // 2. Valida la justificación creada.
    expect(justifiedAbsence.type).toBe('A.J');

    // 3. Filtra y valida que el registro existe para este estudiante.
    // Usamos el operador de PocketBase `~` para buscar en el campo de relación 'student'.
    const response = await consultas.get(`/api/collections/management_of_justifications/records?filter=(student~'${student.id}')`);
    const data = response.data;

    // Se espera exactamente un registro, el que acabamos de crear.
    expect(data.items.length).toBe(1);
    expect(data.items[0].student).toContain(student.id);
    expect(data.items[0].type).toBe('A.J');
});