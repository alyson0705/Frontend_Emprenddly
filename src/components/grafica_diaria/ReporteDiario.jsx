import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import LogoEmpren from "../../assets/Logo_Empren.png";
import "./Diario.css";

function ReporteDiario() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const [totalGanancias, setTotalGanancias] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);

  const [mostrarGananciaNeta, setMostrarGananciaNeta] = useState(false);

  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const toggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  // Función para cargar datos reales del backend
  const fetchData = async (fecha) => {
    try {
      // 1️⃣ GANANCIAS DEL DÍA
      const resGan = await fetch(`http://localhost:4000/api/ganancias/diario/${fecha}`);
      const dataGan = await resGan.json();
      const totalGan = dataGan?.datasets?.[0]?.data?.[0] || 0;
      setTotalGanancias(totalGan);

      // 2️⃣ GASTOS DEL DÍA
      const resGas = await fetch(`http://localhost:4000/reportegastos/totalporfecha/${fecha}`);
      const dataGas = await resGas.json();
      const totalGas = dataGas?.totalGastos || 0;
      setTotalGastos(totalGas);

      // 3️⃣ GANANCIA NETA
      setGananciaNeta(totalGan - totalGas);

      // 4️⃣ GRÁFICA
      if (canvasRef.current) {
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(canvasRef.current, {
          type: "bar",
          data: {
            ...dataGan,
            datasets: dataGan.datasets.map((ds) => ({
              ...ds,
              backgroundColor: "#c893e9ff",
              borderWidth: 2,
            })),
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
          },
        });
      }

      // Mostrar botón de ganancia neta solo si existen gastos
      setMostrarGananciaNeta(false);
    } catch (error) {
      console.error("Error cargando datos diarios:", error);
    }
  };

  const handleActualizar = () => {
    if (fechaSeleccionada) {
      fetchData(fechaSeleccionada);
    }
  };

  // Cargar día actual al iniciar
  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaSeleccionada(hoy);
    fetchData(hoy);

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

 return (
  <div className="diario_modulo">
    {/* Barra superior */}
    <header className="barra-superior">
      <img src={LogoEmpren} alt="Logo" className="logoem" />
    </header>

    <div>
      <h1 className="Titulo">Reporte de Ganancias (Diario)</h1>
      <hr />
    </div>

    {/* Botón calendario */}
    <div className="dia-container" onClick={toggleCalendario}>
      <span className="dia-texto">Día</span>
      <i className="fa-solid fa-calendar-day fa-3x"></i>
    </div>

    {mostrarCalendario && (
      <div className="calendario-container">
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
        <button onClick={handleActualizar}>Actualizar</button>
      </div>
    )}

    {/* 📊 GRÁFICA (PRIMERO) */}
    <div className="chart-card">
      <canvas ref={canvasRef}></canvas>
    </div>

    {/* 🔘 BOTÓN GANANCIA NETA */}
    {totalGastos > 0 && !mostrarGananciaNeta && (
      <div className="Boton_gannacia_neta">
        <button onClick={() => setMostrarGananciaNeta(true)}>
          Ganancias Netas
        </button>
      </div>
    )}

    {/* 📋 TABLA RESUMEN FINANCIERO */}
    {mostrarGananciaNeta && (
      <div className="resumen-financiero">
        <h3>Resumen Financiero - Diario</h3>

        <table className="tabla-resumen">
          <thead>
            <tr>
              <th>Informacion</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ingresos Totales (Ventas)</td>
              <td className="positivo">
                ${totalGanancias.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td>Gastos Totales</td>
              <td className="negativo">
                -${totalGastos.toLocaleString()}
              </td>
            </tr>
            <tr className="fila-neta">
              <td><strong>GANANCIA NETA</strong></td>
              <td>
                <strong>${gananciaNeta.toLocaleString()}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
);

}

export default ReporteDiario;
