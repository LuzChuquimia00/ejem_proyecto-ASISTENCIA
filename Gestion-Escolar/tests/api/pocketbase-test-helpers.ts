import { APIRequestContext } from '@playwright/test';


// Define el tipo para los registros de estudiantes
interface Student {
    id: string;
    name: string;
    surname: string;
    course: string;
    blood_type: string;
}


// Define el tipo para los registros de asistencia
interface Attendance {
    id: string;
    student: string;
    state: string;
    course: string[];
}


// Define el tipo para los registros de justificación
interface Justification {
    id: string;
    student: string;
    course: string[];
    type: string;
    reason: string;
}


// Función para limpiar todas las colecciones antes de cada test.
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
            // Ignora errores si la colección no existe
        }
    }
}


// Función para crear un número específico de estudiantes.
export async function createStudents(count: number, request: APIRequestContext): Promise<Student[]> {
    const students: Student[] = [];
    for (let i = 1; i <= count; i++) {
        const response = await request.post('/api/collections/students/records', {
            data: { name: `StudentName${i}`, surname: `StudentSurname${i}`, course: '1°C', blood_type: 'A+' }
        });
        const student: Student = await response.json();
        students.push(student);
    }
    return students;
}


// Función para crear un registro de asistencia.
export async function createAttendance(request: APIRequestContext, studentId: string, course: string, state: string): Promise<Attendance> {
    const response = await request.post('/api/collections/attendance_management/records', {
        data: {
            student: studentId,
            course: [course],
            state: state
        }
    });
    return await response.json();
}


// Función para crear un registro de justificación.
export async function createJustification(request: APIRequestContext, studentId: string, course: string, type: string): Promise<Justification> {
    const response = await request.post('/api/collections/management_of_justifications/records', {
        data: {
            student: studentId,
            course: [course],
            type: type,
            reason: 'Justificación de prueba'
        }
    });
    return await response.json();
}
