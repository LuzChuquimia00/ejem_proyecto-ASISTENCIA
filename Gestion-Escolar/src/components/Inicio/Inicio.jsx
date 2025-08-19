import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import './Inicio.css';

// Configuración de PocketBase.
const pb = new PocketBase('http://127.0.0.1:8090');

const Inicio = () => {
  // 1. Usamos estados separados. Es un poco más claro que un solo objeto.
  const [presentes, setPresentes] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [justificaciones, setJustificaciones] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect se encarga de buscar los datos y suscribirse a los cambios.
  useEffect(() => {
    
    // 2. encapsulamos la lógica de búsqueda en su propia función.
    //    Esto nos permite llamarla al inicio y también cuando haya una actualización.
    const fetchDashboardData = async () => {
      try {
        // 3. Lógica de fecha mejorada para mayor precisión.
        //    PocketBase guarda todo en UTC. Para obtener todos los registros de un día
        //    local, definimos el inicio y el fin de ese día y lo convertimos a UTC (toISOString).
        const hoy = new Date();
        const inicioDelDia = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
        const finDelDia = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();

        // 4. Peticiones en paralelo (eficiente) y con filtros en la base de datos (más eficiente aún).
        const [studentRecords, presentRecords, absentRecords, justificationRecords] = await Promise.all([
          // Total de alumnos
          pb.collection('students').getFullList(),
          
          // Presentes del día
          pb.collection('attendance_management').getFullList({
            filter: `created >= "${inicioDelDia}" && created <= "${finDelDia}" && state = "present"`,
          }),

          // Ausentes del día
          pb.collection('attendance_management').getFullList({
            filter: `created >= "${inicioDelDia}" && created <= "${finDelDia}" && state = "absent"`,
          }),

          // Justificaciones del día
          pb.collection('management_of_justifications').getFullList({
            filter: `created >= "${inicioDelDia}" && created <= "${finDelDia}"`,
          }),
        ]);

        // Actualizamos el estado con los datos obtenidos
        setTotalAlumnos(studentRecords.length);
        setPresentes(presentRecords.length);
        setAusentes(absentRecords.length);
        setJustificaciones(justificationRecords.length);

      } catch (err) {
        setError('Error al conectar con la base de datos. Asegúrate de que PocketBase esté corriendo.');
        console.error("Error fetching data from PocketBase:", err);
      } finally {
        // Solo quitamos el "cargando" la primera vez.
        if (loading) setLoading(false);
      }
    };

    // Primera carga de datos
    fetchDashboardData();

    // 5. ¡La magia del tiempo real!
    //    Nos suscribimos a cambios en las colecciones. Si algo se crea, actualiza o borra,
    //    volvemos a ejecutar fetchDashboardData() para refrescar el panel.
    pb.collection('attendance_management').subscribe('*', fetchDashboardData);
    pb.collection('management_of_justifications').subscribe('*', fetchDashboardData);

    // 6. Limpieza al desmontar el componente.
    //    Esto es crucial para evitar "fugas de memoria" y errores.
    return () => {
      pb.collection('attendance_management').unsubscribe();
      pb.collection('management_of_justifications').unsubscribe();
    };
  }, [loading]); // El 'loading' en el array de dependencias es para controlar el estado inicial.

  if (loading) {
    return <div className="loading-container">Calculando resumen del día...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  
  // Tu JSX no necesita cambios, solo adaptar los nombres de las variables de estado.
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <div className="header-title">
            <h1>Panel de Inicio</h1>
            <p className="current-date">{today}</p>
          </div>
        </div>
        <div className="user-profile">
          <span>LU</span>
        </div>
      </header>
      <main className="dashboard-content">
        <p className="subtitle">Resumen general del estado de las asistencias en tiempo real.</p>
        <div className="summary-cards-grid">
          <div className="card">
            <div className="card-icon" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>👥</div>
            <p className="card-label">Asistencia del Día</p>
            <p className="card-value">{presentes} / {totalAlumnos}</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)' }}>❓</div>
            <p className="card-label">Ausentes del Día</p>
            <p className="card-value">{ausentes}</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ backgroundColor: 'rgba(241, 196, 15, 0.1)' }}>📄</div>
            <p className="card-label">Justificaciones Recibidas</p>
            <p className="card-value">{justificaciones}</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ backgroundColor: 'rgba(108, 122, 137, 0.1)' }}>🛡️</div>
            <p className="card-label">Alertas de Seguridad</p>
            <p className="card-value">0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;