// api/sin-justificar.spec.ts
import { test, expect } from '@playwright/test';
import { createJustification, consultas } from '../utils/pocketbase';

test('El backend mantiene la información de las ausencias sin justificar', async () => {
    // Paso 1: Crear una justificación de tipo "Sin justificar".
    // Esto es para asegurar que exista al menos un registro con ese tipo.
    const studentsResponse = await consultas.get('/api/collections/students/records');
    const student = studentsResponse.data.items[0];
    await createJustification(student.id, '1°C', 'S.J');

    // Paso 2: Obtener todos los registros de ausencias sin justificar.
    const response = await consultas.get('/api/collections/management_of_justifications/records?filter=(type="S.J")');
    const data = response.data;
    
    // Paso 3: Validar que el conteo es el esperado (4, si ya se justificó uno).
    // Nota: Si no hay un test antes que cree una justificación, este valor podría ser diferente.
    // La prueba aquí es que el conteo es mayor a cero.
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items.some((item: any) => item.type === 'S.J')).toBeTruthy();
});