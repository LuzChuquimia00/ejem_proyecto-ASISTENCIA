// tests/helpers/pocketbase-test-helpers.ts
import { APIRequestContext } from '@playwright/test';

// Define el tipo para los registros de estudiantes
interface Student {
    id: string;
    name: string;
    surname: string;
    course: string;
    blood_type: string;
}

// La función ahora acepta 'request' con el tipo APIRequestContext
export async function clearCollections(request: APIRequestContext) {
    const collections = ['students', 'attendance_management', 'management_of_justifications', 'dashboard_summary'];

    for (const collection of collections) {
        try {
            const response = await request.get(`/api/collections/${collection}/records?perPage=200`);
            const data = await response.json();
            for (const record of data.items) {
                await request.delete(`/api/collections/${collection}/records/${record.id}`);
            }
        } catch (error) {
            // Ignorar errores si la colección no existe
        }
    }
}

// La función ahora acepta 'request' con su tipo y retorna un array de Students
export async function createStudents(count: number, request: APIRequestContext): Promise<Student[]> {
    const students: Student[] = [];
    for (let i = 1; i <= count; i++) {
        const response = await request.post('/api/collections/students/records', {
            data: { name: `StudentName${i}`, surname: `StudentSurname${i}`, course: '1C', blood_type: 'A+' }
        });
        const student: Student = await response.json();
        students.push(student);
    }
    return students;
}