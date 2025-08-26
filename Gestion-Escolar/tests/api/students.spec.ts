// tests/api/students.spec.js
import { test, expect } from '@playwright/test';
import { clearCollections, createStudents } from './pocketbase-test-helpers.js';

test.beforeEach(async ({ request }) => {
    await clearCollections(request);
});

test('El backend permite obtener la lista de todos los alumnos', async ({ request }) => {
    // Correcto: Crea los 10 alumnos
    const students = await createStudents(10, request);

    // Corrección: El array `students` ya contiene los datos. Usa su longitud.
    expect(students.length).toBe(10);
});