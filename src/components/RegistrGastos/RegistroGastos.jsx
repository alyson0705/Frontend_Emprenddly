import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./registro.css"; 
import LogoEmpren from "../../assets/Logo_Empren.png";


function RegistroGastos() {
  const [valor, setValor] = useState("");
  const [tipoGasto, setTipoGasto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/registrogastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor, tipo_gasto: tipoGasto }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Gasto registrado con éxito");
        setValor("");
        setTipoGasto("");
      } else {
        alert("⚠️ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error en frontend:", error);
    }
  };
  return (
    <div>
      {/* Barra superior */}
      <header className="barra-superior">
        <img src={LogoEmpren} alt="Logo" className="logoem"/>
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
            <li><a href="http://localhost:5173/menureporte"><i className="fas fa-dollar-sign"></i>Reporte De Ganancias</a></li>
            <li><a href="http://localhost:5173/ajustes"><i className="fas fa-cogs"></i>Ajustes</a></li>
          </ul>
        </div>
      </label>


      {/* Contenido principal */}
      <main className="container">
        <h1 className="Titulo">Registro de Gastos</h1>
        <hr />

        <form onSubmit={handleSubmit}>
          <label htmlFor="valor">Ingrese valor del gasto:</label>
          <input
            type="number"
            id="valor"
            name="valor"
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
            <hr />
          </div>

          <button type="submit">Registrar Gasto</button>
        </form>

        <Link to="/">Regresar</Link>
      </main>
    </div>
  );
}

export default RegistroGastos;
