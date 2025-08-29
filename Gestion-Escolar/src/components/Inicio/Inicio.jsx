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
      
        const summaryData = await pb.collection('dashboard_summary').getFirstListItem('');

        if (!ignore) {
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
          <span className="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="var(--color-text-primary)">
              <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
            </svg>
          </span>
          <div className="header-title">
            <h1>Gestion de Inicio</h1>
            <p className="current-date">{today}</p>
          </div>
        </div>
        <div className="user-profile">
          <span>No</span>
        </div>
      </header>
      <main className="dashboard-content">
        <p className="subtitle">Resumen general del estado de las asistencias en tiempo real.</p>
        <div className="summary-cards-grid">
          <div className="card assistencias-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"> {/* fill se hereda del CSS */}
                <path d="M0-240v-53q0-38.57 41.5-62.78Q83-380 150.38-380q12.16 0 23.39.5t22.23 2.15q-8 17.35-12 35.17-4 17.81-4 37.18v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-19.86-3.5-37.43T765-377.27q11-1.73 22.17-2.23 11.17-.5 22.83-.5 67.5 0 108.75 23.77T960-293v53H780Zm-480-60h360v-6q0-37-50.5-60.5T480-390q-79 0-129.5 23.5T300-305v5ZM149.57-410q-28.57 0-49.07-20.56Q80-451.13 80-480q0-29 20.56-49.5Q121.13-550 150-550q29 0 49.5 20.5t20.5 49.93q0 28.57-20.5 49.07T149.57-410Zm660 0q-28.57 0-49.07-20.56Q740-451.13 740-480q0-29 20.56-49.5Q781.13-550 810-550q29 0 49.5 20.5t20.5 49.93q0 28.57-20.5 49.07T809.57-410ZM480-480q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm.35-60Q506-540 523-557.35t17-43Q540-626 522.85-643t-42.5-17q-25.35 0-42.85 17.15t-17.5 42.5q0 25.35 17.35 42.85t43 17.5ZM480-300Zm0-300Z"/>
              </svg>
            </div>
            <p className="card-label">Asistencias</p>
            <p className="card-value" id='porcentaje_asistencia'>{presentes} / {totalAlumnos}</p>
          </div>
          <div className="card ausentes-card"> 
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"> {/* fill se hereda del CSS */}
                <path d="m696-454-42-42 83-84-83-83 42-42 84 83 83-83 42 42-83 83 83 84-42 42-83-83-84 83Zm-336-27q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40-160v-94q0-35 17.5-63.5T108-360q75-33 133.5-46.5T360-420q60 0 118 13.5T611-360q33 15 51 43t18 63v94H40Zm60-60h520v-34q0-16-9-30.5T587-306q-71-33-120-43.5T360-360q-58 0-107.5 10.5T132-306q-15 7-23.5 21.5T100-254v34Zm260-321q39 0 64.5-25.5T450-631q0-39-25.5-64.5T360-721q-39 0-64.5 25.5T270-631q0 39 25.5 64.5T360-541Zm0-90Zm0 411Z"/>
              </svg>
            </div>
            <p className="card-label">Ausentes</p>
            <p className="card-value" id='ausentes'>{ausentes}</p>
          </div>
          <div className="card justificaciones-card"> 
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"> {/* fill se hereda del CSS */}
                <path d="M702-494 575-622l42-42 85 85 170-170 42 43-212 212Zm-342 13q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40-160v-94q0-35 17.5-63.5T108-360q75-33 133.34-46.5t118.5-13.5Q420-420 478-406.5T611-360q33 15 51 43t18 63v94H40Zm60-60h520v-34q0-16-9-30.5T587-306q-71-33-120-43.5T360-360q-58 0-107.5 10.5T132-306q-15 7-23.5 21.5T100-254v34Zm260-321q39 0 64.5-25.5T450-631q0-39-25.5-64.5T360-721q-39 0-64.5 25.5T270-631q0 39 25.5 64.5T360-541Zm0 251Zm0-341Z"/>
              </svg>
            </div>
            <p className="card-label">Justificaciones</p>
            <p className="card-value" id='justificaciones'>{justificaciones}</p>
          </div>
          <div className="card sin-justificar-card"> 
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"> {/* fill se hereda del CSS */}
                <path d="M799.82-530q-12.82 0-21.32-8.68-8.5-8.67-8.5-21.5 0-12.82 8.68-21.32 8.67-8.5 21.5-8.5 12.82 0 21.32 8.68 8.5 8.67 8.5 21.5 0 12.82-8.68 21.32-8.67 8.5-21.5 8.5ZM770-650v-180h60v180h-60ZM360-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40-160v-94q0-35 17.5-63.5T108-360q75-33 133.34-46.5t118.5-13.5Q420-420 478-406.5T611-360q33 15 51 43t18 63v94H40Zm60-60h520v-34q0-16-9-30.5T587-306q-71-33-120-43.5T360-360q-58 0-107.5 10.5T132-306q-15 7-23.5 21.5T100-254v34Zm260-321q39 0 64.5-25.5T450-631q0-39-25.5-64.5T360-721q-39 0-64.5 25.5T270-631q0 39 25.5 64.5T360-541Zm0-90Zm0 411Z"/>
              </svg>
            </div>
            <p className="card-label">Ausentes sin justificar</p>
            <p className="card-value" id='Sin_justificaciones'>{sinJustificaciones}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;