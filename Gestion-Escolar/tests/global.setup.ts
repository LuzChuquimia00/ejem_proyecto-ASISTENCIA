// globalSetup.ts

import { FullConfig } from '@playwright/test';
// Asegúrate de que todas las funciones necesarias estén importadas
import { clearCollections, createStudents, createAttendance } from './utils/pocketbase';

/**
 * Función que se ejecuta una vez antes de todos los tests.
 * PRIMERO limpia la base de datos y LUEGO sube los datos de prueba.
 * @param config La configuración de Playwright.
 */
async function globalSetup(config: FullConfig) {
    console.log('Ejecutando globalSetup: Preparando la base de datos para los tests...');

    // -----------------------------------------------------------------
    // PASO 1: LIMPIAR PRIMERO (La parte más importante)
    // -----------------------------------------------------------------
    // Esto garantiza que cada ejecución comience desde un estado limpio,
    // sin importar si la ejecución anterior falló o fue interrumpida.
    const collectionsToClear = ['students', 'attendance_management', 'management_of_justifications'];
    console.log('Limpiando colecciones antes de sembrar nuevos datos...');
    await clearCollections(collectionsToClear);
    console.log('Colecciones limpiadas exitosamente.');


    // -----------------------------------------------------------------
    // PASO 2: SEMBRAR LOS DATOS DE PRUEBA
    // -----------------------------------------------------------------
    console.log('Sembrando datos de prueba...');

    // Crear 10 estudiantes de prueba
    const students = await createStudents(10);
    console.log(`Se crearon ${students.length} estudiantes de prueba.`);

    // Crear registros de asistencia (5 presentes y 5 ausentes)
    for (let i = 0; i < 5; i++) {
        await createAttendance(students[i].id, '1°C', 'present');
        await createAttendance(students[i + 5].id, '1°C', 'absent');
    }
    console.log('Se crearon registros de asistencia.');

    console.log('GlobalSetup completado. La base de datos está lista.');
}

export default globalSetup;