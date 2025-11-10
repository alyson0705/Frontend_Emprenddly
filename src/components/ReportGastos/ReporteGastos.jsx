import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoEmpren from "../../assets/Logo_Empren.png";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./gastos.css";

function ReporteGastos() {
  const [mostrarGrafica, setMostrarGrafica] = useState(false);
  const [datos, setDatos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [tipoGasto, setTipoGasto] = useState("");

  // 🔹 Función simulada sin backend
  const handleGenerarReporte = async () => {
    try {
      console.log("📅 Fecha seleccionada:", fecha);
      console.log("💸 Tipo de gasto:", tipoGasto);

      // Datos de ejemplo (simulando respuesta del backend)
      const dataFicticia = [
        { categoria: "Materia prima", total: 450000 },
        { categoria: "Transporte", total: 200000 },
        { categoria: "Publicidad", total: 120000 },
        { categoria: "Mantenimiento", total: 80000 },
        { categoria: "Energía", total: 50000 },
      ];

      // Simular que se filtran por tipo de gasto
      const datosFiltrados =
        tipoGasto === "Producción"
          ? dataFicticia.filter((item) =>
              ["Materia prima", "Energía", "Mantenimiento"].includes(
                item.categoria
              )
            )
          : tipoGasto === "Logistica"
          ? dataFicticia.filter((item) => item.categoria === "Transporte")
          : dataFicticia;

      const datosTransformados = datosFiltrados.map((item) => ({
        nombre: item.categoria,
        monto: item.total,
      }));

      console.log("✅ Datos simulados:", datosTransformados);

      setDatos(datosTransformados);
      setMostrarGrafica(true);
    } catch (error) {
      console.error("❌ Error generando reporte:", error);
    }
  };

  return (
    <div>
      {/* 🔹 Barra superior */}
      <header className="barra-superior">
        <img src={LogoEmpren} alt="Logo" className="logoem" />
      </header>

      {/* 🔹 Menú lateral */}
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

      {/* 🔹 Contenido principal */}
      <main className="container">
        <h1 className="Titulo">Reporte de Gastos</h1>
        <hr />

        <div className="formulario">
          <label htmlFor="fecha">Seleccione la fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <div className="container2">
            <label>
              <input
                type="radio"
                name="tipo_gasto"
                value="Producción"
                checked={tipoGasto === "Producción"}
                onChange={(e) => setTipoGasto(e.target.value)}
              />
              Costos de producción
            </label>
            <label>
              <input
                type="radio"
                name="tipo_gasto"
                value="Logistica"
                checked={tipoGasto === "Logistica"}
                onChange={(e) => setTipoGasto(e.target.value)}
              />
              Costos logísticos
            </label>
          </div>

          <button type="button" onClick={handleGenerarReporte}>
            Generar Reporte
          </button>
        </div>

        {/* 🔹 Gráfica */}
        {mostrarGrafica && (
          <div className="grafico-container">
            <h2>Gráfica de Gastos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monto" fill="#6C557A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <Link to="/">Regresar</Link>
      </main>
    </div>
  );
}

export default ReporteGastos;
