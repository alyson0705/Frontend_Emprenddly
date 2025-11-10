import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import LogoEmpren from "../../assets/Logo_Empren.png";
import "./Diario.css";

function ReporteDiario() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Mostrar/Ocultar el calendario
  const toggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  // Función simulada (sin backend)
  const fetchData = async (fecha) => {
    try {
      if (!canvasRef.current) return;

      // Generar datos aleatorios simulados según la fecha
      const randomVentas = Math.floor(Math.random() * 200000) + 50000;
      const randomGastos = Math.floor(Math.random() * 100000) + 20000;
      const randomGanancia = randomVentas - randomGastos;

      const data = {
        labels: ["Ventas", "Gastos", "Ganancia Neta"],
        datasets: [
          {
            label: `Reporte Diario - ${fecha}`,
            data: [randomVentas, randomGastos, randomGanancia],
            backgroundColor: ["#36A2EB", "#FF6384", "#4CAF50"],
          },
        ],
      };

      // Destruir gráfico anterior si existe
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Crear nueva gráfica
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                usePointStyle: true,
                boxWidth: 20,
                padding: 15,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${value.toLocaleString()}`,
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error cargando datos diarios:", error);
    }
  };

  // Botón "Actualizar"
  const handleActualizar = () => {
    if (fechaSeleccionada) {
      fetchData(fechaSeleccionada);
    }
  };

  // Al cargar el componente, mostrar el día actual
  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaSeleccionada(hoy);
    fetchData(hoy);

    // Limpiar gráfico al desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      {/* Barra superior */}
      <header className="barra-superior">
        <img src={LogoEmpren} alt="Logo" className="logoem" />
      </header>

      {/* Menú lateral */}
      <label>
        <input className="lineas-check" type="checkbox" />
        <div className="Lineas">
          <span className="top_line common"></span>
          <span className="middle_line common"></span>
          <span className="bottom_line common"></span>
        </div>

        <div className="Menu">
          <h1 className="menu_titulo">Menu</h1>
          <ul>
            <li>
              <a href="http://localhost:5173/usuarios">
                <i className="fas fa-user"></i>Usuarios
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/registroinventario">
                <i className="fas fa-clipboard-list"></i>Inventario
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-cart-plus"></i>Registro De Ventas
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/reporteventas">
                <i className="fas fa-chart-line"></i>Reporte De Ventas
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/registrogastos">
                <i className="fas fa-wallet"></i>Registro De Gastos
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/reportegastos">
                <i className="fas fa-file-invoice-dollar"></i>Reporte De Gastos
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/menureporte">
                <i className="fas fa-dollar-sign"></i>Reporte De Ganancias
              </a>
            </li>
            <li>
              <a href="http://localhost:5173/ajustes">
                <i className="fas fa-cogs"></i>Ajustes
              </a>
            </li>
          </ul>
        </div>
      </label>

      {/* Título */}
      <div>
        <h1 className="Titulo">Reporte de Ganancias (Diario)</h1>
        <hr />
      </div>

      {/* Botón calendario */}
      <div className="dia-container" id="btn-dia" onClick={toggleCalendario}>
        <span className="dia-texto">Día</span>
        <i className="fa-solid fa-calendar-day fa-3x "></i>
      </div>

      {/* Calendario */}
      {mostrarCalendario && (
        <div className="calendario-container" id="calendario-diario">
          <input
            type="date"
            id="fecha-dia"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />
          <button id="btn-refresh-dia" title="Actualizar" onClick={handleActualizar}>
            Actualizar
          </button>
        </div>
      )}

      {/* Gráfico */}
      <div className="chart-card">
        <canvas id="chartDiario" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default ReporteDiario;
