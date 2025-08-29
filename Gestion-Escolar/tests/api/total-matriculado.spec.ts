import { test, expect } from '@playwright/test';
import { getDashboardSummary } from '../utils/pocketbase';

test('El backend puede obtener el total de estudiantes matriculados', async () => {
    // El globalSetup crea 10 estudiantes.
    const expectedTotalStudents = 10;
    
    const summaryData = await getDashboardSummary();
    const summaryRecord = summaryData.items[0];
    
    // Validamos el conteo total.
    expect(summaryRecord.total_students).toBe(expectedTotalStudents);
});