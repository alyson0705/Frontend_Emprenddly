import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import LogoEmpren from "../../assets/Logo_Empren.png";
import "./Anual1.css";

function ReporteAnual() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [datosChart, setDatosChart] = useState(null);

  const [mostrarGananciaNeta, setMostrarGananciaNeta] = useState(false);
  const [totalGananciasAnuales, setTotalGananciasAnuales] = useState(0);
  const [totalGastosAnuales, setTotalGastosAnuales] = useState(0);
  const [gananciaNetaAnual, setGananciaNetaAnual] = useState(0);

  const toggleCalendario = () => setMostrarCalendario(!mostrarCalendario);

  const actualizarReporte = async () => {
    const anio = document.getElementById("anio").value;
    if (!anio) return;

    try {
      // =============================
      // 📊 VENTAS ANUALES
      // =============================
      const resVentas = await fetch(
        `http://localhost:4000/api/ventas_anuales?year=${anio}`
      );
      const ventasData = await resVentas.json();

      ventasData.datasets[0].backgroundColor = [
        "#4BC0C0", "#FF6384", "#FFCE56", "#9966FF",
        "#FF9F40", "#36A2EB", "#8E44AD", "#2ECC71",
        "#da61ff", "#3498DB", "#F1C40F", "#D35400"
      ];

      setDatosChart(ventasData);

      const sumaVentas = Object.values(ventasData.tablaMetodos)
        .reduce((acc, mes) => acc + Number(mes.total), 0);

      // =============================
      // 💸 GASTOS (TOTAL)
      // =============================
      const resGastos = await fetch(
        "http://localhost:4000/reportegastos/categorias"
      );
      const gastosData = await resGastos.json();

      const sumaGastos = gastosData.reduce(
        (acc, g) => acc + Number(g.total),
        0
      );

      // =============================
      // 💰 CÁLCULOS FINALES
      // =============================
      setTotalGananciasAnuales(sumaVentas);
      setTotalGastosAnuales(sumaGastos);
      setGananciaNetaAnual(sumaVentas - sumaGastos);

      setMostrarGananciaNeta(false);

    } catch (error) {
      console.error("❌ Error al generar reporte anual:", error);
    }
  };

  useEffect(() => {
    if (!datosChart) return;

    const ctx = document.getElementById("chartAnual");
    const oldChart = Chart.getChart("chartAnual");
    if (oldChart) oldChart.destroy();

    new Chart(ctx, {
      type: "pie",
      data: datosChart,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "right" },
          title: {
            display: true,
            text: "Reporte Anual de Ganancias",
          },
        },
      },
    });
  }, [datosChart]);

  return (
   

    <div className="anual">
      <header className="barra-superioranual">
        <img className="logo-2anu" src={LogoEmpren} alt="Logo" />
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

      <h1 className="TituloAnual">Reporte de Ganancias (Anual)</h1>
      <hr className="hranual" />

      <div className="dia-container" onClick={toggleCalendario}>
        <span className="dia-texto">Año</span>
        <i className="fa-solid fa-calendar-days fa-4x"></i>
      </div>

      {mostrarCalendario && (
        <div className="calendario-containeranual">
          <input type="number" id="anio" placeholder="Ingrese el año" />
          <button onClick={actualizarReporte}>Actualizar</button>
        </div>
      )}

      <div className="chart-card anual">
        <canvas id="chartAnual"></canvas>
      </div>

      {totalGananciasAnuales > 0 && !mostrarGananciaNeta && (
        <div className="Boton_gannacia_neta">
          <button onClick={() => setMostrarGananciaNeta(true)}>
            Ganancias Netas
          </button>
        </div>
      )}

      {mostrarGananciaNeta && (
        <div className="resumen-financiero">
          <h3>Resumen Financiero - Anual</h3>

          <table className="tabla-resumen">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ingresos Totales (Ventas)</td>
                <td className="positivo">
                  ${totalGananciasAnuales.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Gastos Totales</td>
                <td className="negativo">
                  -${totalGastosAnuales.toLocaleString()}
                </td>
              </tr>
              <tr className="fila-neta">
                <td><strong>GANANCIA NETA</strong></td>
                <td><strong>${gananciaNetaAnual.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReporteAnual;
