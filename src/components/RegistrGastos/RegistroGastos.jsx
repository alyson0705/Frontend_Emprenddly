import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./registro.css";
import LogoEmpren from "../../assets/Logo_Empren.png";

function RegistroGastos() {
  const [valor, setValor] = useState("");
  const [tipoGasto, setTipoGasto] = useState("");
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/registrogastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor,
          tipo_gasto: tipoGasto,
          fecha
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Gasto registrado con éxito");
        setValor("");
        setTipoGasto("");
        setFecha(new Date().toISOString().split("T")[0]);
      } else {
        alert("⚠️ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error en frontend:", error);
      alert("❌ Error de conexión con el servidor");
    }
  };

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
            <li><a href="http://localhost:5173/usuarios">Usuarios</a></li>
            <li><a href="http://localhost:5173/registroinventario">Inventario</a></li>
            <li><a href="#">Registro De Ventas</a></li>
            <li><a href="http://localhost:5173/reporteventas">Reporte De Ventas</a></li>
            <li><a href="http://localhost:5173/reportegastos">Reporte De Gastos</a></li>
            <li><a href="http://localhost:5173/menureporte">Reporte De Ganancias</a></li>
            <li><a href="http://localhost:5173/ajustes">Ajustes</a></li>
          </ul>
        </div>
      </label>

      {/* Contenido principal */}
      <main className="container">
        <h1 className="Titulo">Registro de Gastos</h1>
        <hr />

        <form onSubmit={handleSubmit}>
          <label>Fecha del gasto:</label>
          <input
            type="date"
            required
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <hr />

          <label>Ingrese valor del gasto:</label>
          <input
            type="number"
            min="101"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <hr />

          <div className="container2">
            <label>
              <input
                type="radio"
                name="tipo_gasto"
                value="produccion"
                checked={tipoGasto === "produccion"}
                onChange={(e) => setTipoGasto(e.target.value)}
                required
              />
              Costos de producción
            </label>

            <hr />

            <label>
              <input
                type="radio"
                name="tipo_gasto"
                value="logisticos"
                checked={tipoGasto === "logisticos"}
                onChange={(e) => setTipoGasto(e.target.value)}
              />
              Costos logísticos
            </label>
          </div>

          <button type="submit">Registrar Gasto</button>
        </form>

        <Link to="/">Regresar</Link>
      </main>
    </div>
  );
}

export default RegistroGastos;
