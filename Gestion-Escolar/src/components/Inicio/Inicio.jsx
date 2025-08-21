import React, { useState, useEffect } from 'react';
import './Inicio.css';
import { pb } from '../../server/pocketbase';

const Inicio = () => {
  const [presentes, setPresentes] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [justificaciones, setJustificaciones] = useState(0);
  const [sinJustificaciones, setSinJustificaciones] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchDashboardData = async () => {
      if (ignore) return;
      try {
        // --- LÓGICA DE FECHA CORREGIDA PARA POCKETBASE ---
        // 1. Obtenemos la fecha de "hoy" en tu zona horaria (Argentina).
        const hoy = new Date();

        // 2. Creamos el objeto para el inicio del día (00:00:00 de Argentina)
        const inicio = new Date(hoy);
        inicio.setHours(0, 0, 0, 0);
        // Lo convertimos al formato UTC que PocketBase entiende.
        const inicioDelDia = inicio.toISOString().replace('T', ' ').substring(0, 19);

        // 3. Creamos el objeto para el fin del día (23:59:59 de Argentina)
        const fin = new Date(hoy);
        fin.setHours(23, 59, 59, 999);
        // Lo convertimos también al formato UTC.
        const finDelDia = fin.toISOString().replace('T', ' ').substring(0, 19);
        // --- FIN DE LA LÓGICA DE FECHA ---

        const filterHoy = `created >= "${inicioDelDia}" && created <= "${finDelDia}"`;

        // Ahora usamos el mismo filtro de fecha para todas las consultas del día
        const studentRecords = await pb.collection('students').getFullList();

        const presentRecords = await pb.collection('attendance_management').getFullList({
          filter: `${filterHoy} && state = "present"`
        });

        // ✅ CORREGIDO: Usamos el filtro dinámico en lugar de la fecha fija
        const absentRecords = await pb.collection('attendance_management').getFullList({
          filter: `${filterHoy} && state = "absent"`
        });

        const justificationRecords = await pb.collection('management_of_justifications').getFullList({
          filter: filterHoy
        });

        if (!ignore) {
          setTotalAlumnos(studentRecords.length);
          setPresentes(presentRecords.length);
          setAusentes(absentRecords.length);
          setJustificaciones(justificationRecords.reduce((acc, record) => acc += record.type == "A.J" ? 1 : 0, 0));
          setSinJustificaciones(justificationRecords.reduce((acc, record) => acc += record.type == "S.J" ? 1 : 0, 0));
        }
      } catch (err) {
        if (!err.isAbort && !ignore) {
          setError('Error al conectar con la base de datos.');
          console.error("Error fetching data from PocketBase:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    pb.collection('students').subscribe('*', fetchDashboardData);
    pb.collection('attendance_management').subscribe('*', fetchDashboardData);
    pb.collection('management_of_justifications').subscribe('*', fetchDashboardData);

    return () => {
      ignore = true;
      pb.collection('students').unsubscribe();
      pb.collection('attendance_management').unsubscribe();
      pb.collection('management_of_justifications').unsubscribe();
    };
  }, []);

  // El resto de tu componente (if loading, if error, y el return con el JSX) no necesita cambios.
  if (loading) {
    return <div className="loading-container">Calculando resumen del día...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="dashboard-container">
      {/* Tu JSX no necesita cambios */}
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
            <p className="card-label">Ausentes sin justificar</p>
            <p className="card-value">{sinJustificaciones}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;