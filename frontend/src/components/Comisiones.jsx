import React, { useState, useEffect } from "react";
import "./styles/comisiones.css";
import Sidebar from "./Sidebar";
import * as XLSX from "xlsx"; // Biblioteca para exportar a Excel
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Para el icono
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'; // Icono de Excel

const Comisiones = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [comisionesData, setComisionesData] = useState([]);
  const [comisionesLoading, setComisionesLoading] = useState(false);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/proyectos");
        if (!response.ok) {
          throw new Error("Error al obtener los proyectos");
        }
        const data = await response.json();
        setProyectos(data.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  const handleFetchComisiones = async () => {
    if (!selectedProjectId) return;

    setComisionesLoading(true);
    setComisionesData([]);

    try {
      const response = await fetch(
        `http://localhost:8000/api/comisiones?Numero=${selectedProjectId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos de comisiones");
      }
      const data = await response.json();
      setComisionesData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setComisionesLoading(false);
    }
  };

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const exportToExcel = () => {
    const exportData = comisionesData.map((row) => ({
      Usuario: row.username_creador,
      "Com. por Dormitorios": row.total_suma,
      "Com. Porcentaje Pagado": row.comporc,
      "Com. por Descuento Realizado": row.comdesc,
      Total: Number(row.total_suma) + Number(row.comporc) + Number(row.comdesc)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comisiones");
    XLSX.writeFile(workbook, "comisiones.xlsx");
  };

  if (loading) {
    return (
      <div className="comisiones-wrapper">
        <Sidebar />
        <div className="comisiones-container">
          <div className="loader"></div>
          <p>Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comisiones-wrapper">
      <Sidebar />
      <div className="comisiones-container">
        <h2>Selecciona un Proyecto</h2>
        <div className="dropdown-container">
          <select className="proyectos-dropdown" onChange={handleProjectSelect}>
            <option value="">-- Selecciona un proyecto --</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.nombreproyecto}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleFetchComisiones}
          className="fetch-button"
          disabled={!selectedProjectId}
        >
          Obtener Comisiones
        </button>

        {comisionesLoading && <p>Cargando datos de comisiones...</p>}

        {comisionesData.length > 0 && (
          <div className="table-container">
            <table className="comisiones-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Com. por Dormitorios</th>
                  <th>Com. Porcentaje Pagado</th>
                  <th>Com. por Descuento Realizado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {comisionesData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.username_creador}</td>
                    <td>{row.total_suma}</td>
                    <td>{row.comporc}</td>
                    <td>{row.comdesc}</td>
                    <td>
                      {Number(row.total_suma) + Number(row.comporc) + Number(row.comdesc)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Icono de exportación a Excel en la esquina inferior derecha */}
            <div className="export-icon" onClick={exportToExcel}>
              <FontAwesomeIcon icon={faFileExcel} size="2x" />
            </div>
          </div>
        )}

        {error && <p className="error-message">Error: {error}</p>}
      </div>
    </div>
  );
};

export default Comisiones;
