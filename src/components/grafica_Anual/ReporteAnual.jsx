import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto"; 
import LogoEmpren from "../../assets/Logo_Empren.png";
import "./Anual1.css";

function ReporteAnual() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [datosChart, setDatosChart] = useState(null);
  const [tablaMetodos, setTablaMetodos] = useState(null);

  const toggleCalendario = () => setMostrarCalendario(!mostrarCalendario);

  // =============================
  //   OBTENER REPORTE DEL BACKEND
  // =============================
  const actualizarReporte = async () => {
    const anio = document.getElementById("anio").value;
    if (!anio) return;

    try {
      const response = await fetch(`http://localhost:4000/api/ventas_anuales?year=${anio}`);
      const data = await response.json();

      // Aplicar colores al pie chart
      data.datasets[0].backgroundColor = [
        "#4BC0C0", "#FF6384", "#FFCE56", "#9966FF",
        "#FF9F40", "#36A2EB", "#8E44AD", "#2ECC71",
        "#da61ffff", "#3498DB", "#F1C40F", "#D35400"
      ];

      // Guardar tabla
      setTablaMetodos(data.tablaMetodos);

      // Guardar datos para gráfica
      setDatosChart(data);

    } catch (error) {
      console.error("Error al obtener reporte anual:", error);
    }
  };

  // =============================
  //   DIBUJAR GRÁFICA PIE
  // =============================
  useEffect(() => {
    if (!datosChart) return;

    // Asegurar que existe solo un dataset
    if (datosChart.datasets.length > 1) {
      datosChart.datasets = [datosChart.datasets[0]];
    }

    const ctx = document.getElementById("chartAnual");
    const oldChart = Chart.getChart("chartAnual");
    if (oldChart) oldChart.destroy();

    new Chart(ctx, {
      type: "pie",
      data: datosChart,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              pointStyle: "circle"
            }
          }
        }
      }
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
          <input className="año"
            type="number"
            id="anio"
            placeholder="Ingrese el año"
            min="2000"
            max="2100"
          />
          <button className="actuanual" id="btn-refresh-anual" title="Actualizar" onClick={actualizarReporte}>
            Actualizar
          </button>
        </div>
      )}

      {/* Gráfico */}
      <div className="chart-card anual">
        <canvas id="chartAnual"></canvas>
      </div>


      {tablaMetodos && (
       <table className="tabla-metodos">
  <thead>
    <tr>
      <th>Mes</th>
      <th>Ganancia Total</th>
    </tr>
  </thead>

  <tbody>
    {Object.entries(tablaMetodos).map(([mes, valores]) => {
      const total = Number(valores.total) || 0; // asegurar entero

      return (
        <tr key={mes}>
          <td>{mes}</td>
          <td><b>{Math.round(total).toLocaleString()}</b></td>
        </tr>
      );
    })}
  </tbody>
</table>

      )}
    </div>
  );
}

export default ReporteAnual;
