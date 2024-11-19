// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./Sidebar"; // Asegúrate de ajustar la ruta correctamente

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [procedimientos, setProcedimientos] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los términos de búsqueda
  const [searchProcedimientos, setSearchProcedimientos] = useState('');
  const [searchFormatos, setSearchFormatos] = useState('');

  // Obtener el userId de localStorage
  const userId = localStorage.getItem("userId");

  // URLs de las APIs
  const userApiUrl = `http://192.168.2.47:8000/api/userdata/${userId}`;
  const procedimientosApiUrl = 'http://192.168.2.47:8000/api/procedimientos';
  const formatosApiUrl = 'http://192.168.2.47:8000/api/formatos';

  // Función para manejar la visualización de archivos
  const handleView = (filePath) => {
    const adjustedPath = `storage/${filePath}`;
    window.open(`http://192.168.2.47:8000/${adjustedPath}`, "_blank");
  };

  useEffect(() => {
    if (!userId) {
      setError("No se encontró el userId en localStorage.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Realizar solicitudes simultáneas
        const [userResponse, procedimientosResponse, formatosResponse] = await Promise.all([
          axios.get(userApiUrl),
          axios.get(procedimientosApiUrl),
          axios.get(formatosApiUrl),
        ]);

        setUserData(userResponse.data);

        // Filtrar procedimientos donde idcargo === cargo_id del usuario
        const filteredProcedimientos = procedimientosResponse.data.filter(
          (procedimiento) => Number(procedimiento.idcargo) === Number(userResponse.data.cargo_id)
        );
        setProcedimientos(filteredProcedimientos);

        // Filtrar formatos donde idcargo === cargo_id del usuario
        const filteredFormatos = formatosResponse.data.filter(
          (formato) => Number(formato.idcargo) === Number(userResponse.data.cargo_id)
        );
        setFormatos(filteredFormatos);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Hubo un error al obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userApiUrl, procedimientosApiUrl, formatosApiUrl]);

  // Funciones para manejar los cambios en los campos de búsqueda
  const handleSearchProcedimientos = (e) => {
    setSearchProcedimientos(e.target.value);
  };

  const handleSearchFormatos = (e) => {
    setSearchFormatos(e.target.value);
  };

  // Filtrar los procedimientos y formatos basados en los términos de búsqueda
  const filteredProcedimientos = procedimientos.filter((procedimiento) =>
    procedimiento.nombre.toLowerCase().includes(searchProcedimientos.toLowerCase())
  );

  const filteredFormatos = formatos.filter((formato) =>
    formato.nombre.toLowerCase().includes(searchFormatos.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div>Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 container mt-5">
          <div className="alert alert-warning" role="alert">
            No se encontraron datos del usuario.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <div className="flex-grow-1 p-4">
        <div className="container">
          {/* Información del Usuario */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3>Bienvenido {userData.name}</h3>
            </div>
            <div className="card-body">
              <p><strong>Cargo:</strong> {userData.nombrecargo}</p>
              <p><strong>Área:</strong> {userData.area_nombre}</p>
              <p><strong>Subárea:</strong> {userData.nombresubarea}</p>
            </div>
          </div>

          {/* Tarjeta para Procedimientos y Formatos en la Misma Fila */}
          <div className="row">
            {/* Procedimientos Disponibles */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <h4>Procedimientos Disponibles</h4>
                </div>
                <div className="card-body">
                  {/* Campo de Búsqueda para Procedimientos */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar Procedimientos..."
                      value={searchProcedimientos}
                      onChange={handleSearchProcedimientos}
                    />
                  </div>

                  {/* Tabla de Procedimientos */}
                  {filteredProcedimientos.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProcedimientos.map((procedimiento) => (
                            <tr key={procedimiento.id}>
                              <td>{procedimiento.nombre}</td>
                              <td>
                                <button
                                  onClick={() => handleView(procedimiento.archivo)}
                                  className="btn btn-primary btn-sm"
                                >
                                  Ver
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info" role="alert">
                      No hay procedimientos disponibles para tu cargo.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formatos Disponibles */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-info text-white">
                  <h4>Formatos Disponibles</h4>
                </div>
                <div className="card-body">
                  {/* Campo de Búsqueda para Formatos */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar Formatos..."
                      value={searchFormatos}
                      onChange={handleSearchFormatos}
                    />
                  </div>

                  {/* Tabla de Formatos */}
                  {filteredFormatos.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFormatos.map((formato) => (
                            <tr key={formato.id}>
                              <td>{formato.nombre}</td>
                              <td>
                                <button
                                  onClick={() => handleView(formato.archivo)}
                                  className="btn btn-primary btn-sm"
                                >
                                  Ver
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info" role="alert">
                      No hay formatos disponibles para tu cargo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
