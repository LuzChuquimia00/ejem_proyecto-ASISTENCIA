import React, { useState, useEffect } from 'react';
import './Inicio.css';
import { pb } from '../../server/pocketbase';

const Inicio = () => {
  // Los estados se mantienen igual para mostrar los datos
  const [presentes, setPresentes] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [justificaciones, setJustificaciones] = useState(0);
  const [sinJustificaciones, setSinJustificaciones] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    // --- LÓGICA DE OBTENCIÓN DE DATOS SIMPLIFICADA ---
    const fetchDashboardData = async () => {
      if (ignore) return;
      try {
        // ✅ ¡AHORA SOLO HACEMOS UNA LLAMADA!
        // Consultamos la vista 'dashboard_summary' que ya tiene todos los cálculos hechos.
        // Usamos getFirstListItem porque la vista siempre devuelve un único resultado.
        const summaryData = await pb.collection('dashboard_summary').getFirstListItem('');

        if (!ignore) {
          // Asignamos los datos directamente desde el resultado del backend
          setTotalAlumnos(summaryData.total_students);
          setPresentes(summaryData.present_count);
          setAusentes(summaryData.absent_count);
          setJustificaciones(summaryData.justified_count);
          setSinJustificaciones(summaryData.unjustified_count);
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

    // Las suscripciones siguen funcionando igual para mantener los datos en tiempo real.
    // Cuando algo cambia, se vuelve a ejecutar la única y eficiente llamada a la API.
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

  // El resto del componente (la parte visual) no necesita ningún cambio.
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