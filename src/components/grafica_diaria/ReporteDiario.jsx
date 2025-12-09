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
  // Destruir gráfico previo si existe
  if (chartRef.current) chartRef.current.destroy();

  // Crear nueva gráfica con color personalizado
  chartRef.current = new Chart(canvasRef.current, {
    type: "bar",
    data: {
      ...dataGan,
      datasets: dataGan.datasets.map(ds => ({
        ...ds,
        backgroundColor: "#c893e9ff", // Color de las barras
        borderWidth: 2
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });
}


      // ✅ Mostrar botón solo si hay gastos
      if (totalGas > 0) {
        setMostrarGananciaNeta(false); // inicialmente oculto
      } else {
        setMostrarGananciaNeta(false); // no hay botón si no hay gastos
      }
    } catch (error) {
      console.error("Error cargando datos diarios:", error);
    }
  };

  const handleActualizar = () => {
    if (fechaSeleccionada) {
      fetchData(fechaSeleccionada);
    }
  };

  // Al cargar el componente: cargar día actual
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

      <div>
        <h1 className="Titulo">Reporte de Ganancias (Diario)</h1>
        <hr />
      </div>

      {/* Botón del calendario */}
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

      {/* BOTÓN GANANCIA NETA */}
      {totalGastos > 0 && !mostrarGananciaNeta && (
        <div className="Boton_gannacia_neta">
          <button onClick={() => setMostrarGananciaNeta(true)}>
          Ganancias Netas
          </button>
        </div>
      )}

      {/* GANANCIA NETA (solo si se presionó el botón) */}
      {mostrarGananciaNeta && (
        <div className="ganancia-neta-card">
          <h2>Ganancia Neta del Día</h2>
          <p><strong>Ganancias:</strong> ${totalGanancias}</p>
          <p><strong>Gastos:</strong> -${totalGastos}</p>
          <br />
          <h3><strong>Neto:</strong> ${gananciaNeta}</h3>
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
