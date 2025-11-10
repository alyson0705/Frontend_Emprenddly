import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import LogoEmpren from "../../assets/Logo_Empren.png";
import "./Anual1.css";

function ReporteAnual() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [datosChart, setDatosChart] = useState(null);

  const toggleCalendario = () => setMostrarCalendario(!mostrarCalendario);

  // 🔹 Simular datos de reporte anual (sin backend)
  const actualizarReporte = async () => {
    const anio = document.getElementById("anio").value;
    if (!anio) return;

    // Generar valores aleatorios para cada mes
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const ventas = meses.map(() => Math.floor(Math.random() * 200000) + 80000);
    const gastos = meses.map(() => Math.floor(Math.random() * 100000) + 20000);
    const ganancias = ventas.map((v, i) => v - gastos[i]);

    // Estructura esperada por Chart.js
    const data = {
      labels: meses,
      datasets: [
        {
          label: `Ventas ${anio}`,
          data: ventas,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54,162,235,0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: `Gastos ${anio}`,
          data: gastos,
          borderColor: "#FF6384",
          backgroundColor: "rgba(255,99,132,0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: `Ganancia Neta ${anio}`,
          data: ganancias,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76,175,80,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };

    setDatosChart(data);
  };

  // 🔹 Dibujar gráfico cuando cambien los datos
  useEffect(() => {
    if (!datosChart) return;

    const ctx = document.getElementById("chartAnual");
    const existingChart = Chart.getChart("chartAnual");
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
      type: "line",
      data: datosChart,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Reporte Anual de Ganancias",
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
  }, [datosChart]);

  return (
    <div className="anual">
      {/* Barra superior */}
      <header className="barra-superioranual">
        <img className="logo-2anu" src={LogoEmpren} alt="Logo Emprendimiento" />
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
          <h1 className="menu_titulo"> Menu </h1>
          <ul>
            <li><a href="http://localhost:5173/usuarios"><i className="fas fa-user"></i>Usuarios</a></li>
            <li><a href="http://localhost:5173/registroinventario"><i className="fas fa-clipboard-list"></i>Inventario</a></li>
            <li><a href="#"><i className="fas fa-cart-plus"></i>Registro De Ventas</a></li>
            <li><a href="http://localhost:5173/reporteventas"><i className="fas fa-chart-line"></i>Reporte De Ventas</a></li>
            <li><a href="http://localhost:5173/registrogastos"><i className="fas fa-wallet"></i>Registro De Gastos</a></li>
            <li><a href="http://localhost:5173/reportegastos"><i className="fas fa-file-invoice-dollar"></i>Reporte De Gastos</a></li>
            <li><a href="http://localhost:5173/menureporte"><i className="fas fa-dollar-sign"></i>Reporte De Ganancias</a></li>
            <li><a href="http://localhost:5173/ajustes"><i className="fas fa-cogs"></i>Ajustes</a></li>
          </ul>
        </div>
      </label>

      {/* Título */}
      <div>
        <h1 className="TituloAnual">Reporte de Ganancias (Anual)</h1>
        <hr className="hranual" />
      </div>

      {/* Botón calendario */}
      <div className="dia-container" id="btn-anual" onClick={toggleCalendario}>
        <span className="dia-texto">Año</span>
        <i className="fa-solid fa-calendar-days fa-4x"></i>
      </div>

      {/* Selector de año */}
      {mostrarCalendario && (
        <div className="calendario-containeranual" id="calendario-anual">
          <input
            className="año"
            type="number"
            id="anio"
            placeholder="Ingrese el año"
            min="2000"
            max="2100"
          />
          <button
            className="actuanual"
            id="btn-refresh-anual"
            title="Actualizar"
            onClick={actualizarReporte}
          >
            Actualizar
          </button>
        </div>
      )}

      {/* Gráfico */}
      <div className="chart-card anual">
        <canvas id="chartAnual"></canvas>
      </div>
    </div>
  );
}

export default ReporteAnual;
