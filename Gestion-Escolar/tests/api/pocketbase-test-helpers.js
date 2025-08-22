// tests/helpers/pocketbase-test-helpers.js
//import { request } from '@playwright/test';

// La función ahora acepta 'request'
export async function clearCollections(request) {
    const apiContext = request; // Usa el request que te pasaron, no crees uno nuevo
    const collections = ['students', 'attendance_management', 'management_of_justifications', 'dashboard_summary'];

    for (const collection of collections) {
        try {
            const response = await apiContext.get(`/api/collections/${collection}/records?perPage=200`);
            const data = await response.json();
            for (const record of data.items) {
                await apiContext.delete(`/api/collections/${collection}/records/${record.id}`);
            }
        } catch (error) {
            // Ignorar errores si la colección no existe
        }
    }
}

// La función ahora acepta 'request'
export async function createStudents(count, request) {
    const apiContext = request; // Usa el request que te pasaron
    const students = [];
    for (let i = 1; i <= count; i++) {
        const response = await apiContext.post('/api/collections/students/records', {
            data: { name: `StudentName${i}`, surname: `StudentSurname${i}`, course: '1C', blood_type: 'A+' }
        });
        const student = await response.json();
        students.push(student);
    }
    return students;
}