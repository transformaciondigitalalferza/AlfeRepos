import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Table,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFilter } from "react-icons/fa";
import Sidebar from "./Sidebar";

const API_BASE_URL = "http://192.168.2.47:8000/api";

const ObjOperacional = () => {
  // Estados para datos
  const [objetivos, setObjetivos] = useState([]);
  const [objetivosEstrategicos, setObjetivosEstrategicos] = useState([]);
  const [areas, setAreas] = useState([]);

  // Estados para filtros y formularios
  const [selectedArea, setSelectedArea] = useState("all");
  const [formData, setFormData] = useState({
    idobjetivoestrategico: "",
    idfrecuencia: "1",
    descripcion: "",
    fechainicio: new Date().toISOString().split("T")[0],
    fechafin: "",
    idarea: "",
  });

  // Estados para el manejo del modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Estados para manejo de carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URLs de la API
  const API_URL_OPERACIONAL = `${API_BASE_URL}/objetivooperacional`;
  const API_URL_ESTRATEGICO = `${API_BASE_URL}/objetivoestrategico`;
  const API_URL_AREA = `${API_BASE_URL}/areas`;

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchDatos();
  }, []);

  // Función para cargar todos los datos necesarios
  const fetchDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [objetivosRes, estrategicosRes, areasRes] = await Promise.all([
        axios.get(API_URL_OPERACIONAL),
        axios.get(API_URL_ESTRATEGICO),
        axios.get(API_URL_AREA),
      ]);

      const objetivosConIdNumerico = objetivosRes.data.map((objetivo) => ({
        ...objetivo,
        idobjetivoestrategico: Number(objetivo.idobjetivoestrategico),
        idfrecuencia: Number(objetivo.idfrecuencia),
        idarea: objetivo.idarea ? Number(objetivo.idarea) : null,
      }));
      setObjetivos(objetivosConIdNumerico);
      setObjetivosEstrategicos(estrategicosRes.data);
      
      if (
        areasRes.data &&
        areasRes.data.success &&
        areasRes.data.data &&
        Array.isArray(areasRes.data.data.data)
      ) {
        setAreas(areasRes.data.data.data);
      } else {
        throw new Error("Formato de datos de áreas no reconocido.");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError("Hubo un error al cargar los datos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo del filtro por área
  const handleFilterChange = (e) => {
    setSelectedArea(e.target.value);
  };

  // Filtrar objetivos según el área seleccionada
  const filteredObjetivos = useMemo(() => {
    return selectedArea === "all"
      ? objetivos
      : objetivos.filter((objetivo) => objetivo.idarea === Number(selectedArea));
  }, [objetivos, selectedArea]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      idobjetivoestrategico: Number(formData.idobjetivoestrategico),
      idfrecuencia: Number(formData.idfrecuencia),
      fechaactualizacion: new Date().toISOString(),
      fechafin: formData.fechafin.trim() !== "" ? formData.fechafin : null,
      idarea: formData.idarea !== "" ? Number(formData.idarea) : null,
    };
    try {
      if (isEditing) {
        await axios.put(`${API_URL_OPERACIONAL}/${editId}`, dataToSend);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(API_URL_OPERACIONAL, dataToSend);
      }
      fetchObjetivos();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(
        "Error al guardar el objetivo operacional:",
        error.response ? error.response.data : error.message
      );
      alert("Hubo un error al guardar el objetivo operacional.");
    }
  };

  // Manejo de la edición de un objetivo
  const handleEdit = (objetivo) => {
    setFormData({
      idobjetivoestrategico: objetivo.idobjetivoestrategico.toString(),
      idfrecuencia: objetivo.idfrecuencia.toString(),
      descripcion: objetivo.descripcion,
      fechainicio: objetivo.fechainicio.split("T")[0],
      fechafin: objetivo.fechafin ? objetivo.fechafin.split("T")[0] : "",
      idarea: objetivo.idarea ? objetivo.idarea.toString() : "",
    });
    setEditId(objetivo.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Manejo de la eliminación de un objetivo
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este objetivo?")) {
      try {
        await axios.delete(`${API_URL_OPERACIONAL}/${id}`);
        fetchObjetivos();
      } catch (error) {
        console.error("Error al eliminar el objetivo operacional:", error);
        alert("Hubo un error al eliminar el objetivo operacional.");
      }
    }
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setFormData({
      idobjetivoestrategico: "",
      idfrecuencia: "1",
      descripcion: "",
      fechainicio: new Date().toISOString().split("T")[0],
      fechafin: "",
      idarea: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Agrupar objetivos operacionales por su objetivo estratégico
  const groupedObjetivos = useMemo(() => {
    const grouped = {};
    filteredObjetivos.forEach((objetivo) => {
      if (!grouped[objetivo.idobjetivoestrategico]) {
        grouped[objetivo.idobjetivoestrategico] = [];
      }
      grouped[objetivo.idobjetivoestrategico].push(objetivo);
    });
    return grouped;
  }, [filteredObjetivos]);

  // Función para obtener la descripción de la frecuencia
  const getFrecuencia = (id) => {
    const frecuenciaMap = {
      1: "Mensual",
      2: "Anual",
      3: "Trimestral",
      4: "Bimestral",
      5: "Cuatrimestral",
      6: "Semestral",
    };
    return frecuenciaMap[id] || "Desconocida";
  };

  // Función para obtener el nombre del área
  const getAreaName = (id) => {
    const area = areas.find((a) => a.id === id);
    return area ? area.nombres : "No especificada";
  };

  // Función para obtener la descripción del objetivo estratégico
  const getEstrategicoDescripcion = (id) => {
    const estrategico = objetivosEstrategicos.find((e) => e.id === Number(id));
    return estrategico ? estrategico.descripcion : "Objetivo Estratégico Desconocido";
  };

  // Función para cargar nuevamente los objetivos después de una operación
  const fetchObjetivos = async () => {
    try {
      const response = await axios.get(API_URL_OPERACIONAL);
      const objetivosConIdNumerico = response.data.map((objetivo) => ({
        ...objetivo,
        idobjetivoestrategico: Number(objetivo.idobjetivoestrategico),
        idfrecuencia: Number(objetivo.idfrecuencia),
        idarea: objetivo.idarea ? Number(objetivo.idarea) : null,
      }));
      setObjetivos(objetivosConIdNumerico);
    } catch (error) {
      console.error("Error al cargar los objetivos operacionales:", error);
      alert("Hubo un error al cargar los objetivos operacionales.");
    }
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="container mt-4 flex-grow-1">
        <h2 className="text-primary mb-4">Objetivos Operacionales</h2>

        {/* Indicador de carga */}
        {loading && (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* Filtros y botón de agregar */}
        {!loading && !error && (
          <>
            <Row className="align-items-center mb-4">
              <Col md={6} sm={12} className="mb-2 mb-md-0">
                <InputGroup>
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select value={selectedArea} onChange={handleFilterChange}>
                    <option value="all">Filtrar por Área: Todos</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombres}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={6} sm={12} className="text-md-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <FaPlus className="me-2" /> Agregar Objetivo
                </Button>
              </Col>
            </Row>

            {/* Tabla de Objetivos Operacionales */}
            {filteredObjetivos.length === 0 ? (
              <div className="text-center">
                <p>No hay objetivos operacionales para mostrar.</p>
              </div>
            ) : (
              Object.keys(groupedObjetivos).map((estrategicoId) => {
                const objetivosOperacionales = groupedObjetivos[estrategicoId];

                return (
                  <div key={estrategicoId} className="mb-5">
                    <h4 className="text-secondary mb-3">
                      {getEstrategicoDescripcion(estrategicoId)}
                    </h4>
                    <Table striped bordered hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Descripción</th>
                          <th>Área</th>
                          <th>Frecuencia</th>
                          <th>Fecha Inicio</th>
                          <th>Fecha Fin</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {objetivosOperacionales.map((objetivo, index) => (
                          <tr key={objetivo.id}>
                            <td>{index + 1}</td>
                            <td>{objetivo.descripcion}</td>
                            <td>{getAreaName(objetivo.idarea)}</td>
                            <td>{getFrecuencia(objetivo.idfrecuencia)}</td>
                            <td>{objetivo.fechainicio.split("T")[0]}</td>
                            <td>
                              {objetivo.fechafin
                                ? objetivo.fechafin.split("T")[0]
                                : "No especificada"}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2 mb-1"
                                onClick={() => handleEdit(objetivo)}
                              >
                                <FaEdit className="me-1" />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mb-1"
                                onClick={() => handleDelete(objetivo.id)}
                              >
                                <FaTrash className="me-1" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Modal para agregar/editar objetivo */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing
                ? "Editar Objetivo Operacional"
                : "Agregar Nuevo Objetivo Operacional"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Objetivo Estratégico */}
              <Form.Group className="mb-3">
                <Form.Label>Objetivo Estratégico</Form.Label>
                <Form.Select
                  name="idobjetivoestrategico"
                  value={formData.idobjetivoestrategico}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un objetivo estratégico</option>
                  {objetivosEstrategicos.map((estrategico) => (
                    <option key={estrategico.id} value={estrategico.id}>
                      {estrategico.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Área */}
              <Form.Group className="mb-3">
                <Form.Label>Área</Form.Label>
                <Form.Select
                  name="idarea"
                  value={formData.idarea}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombres}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Frecuencia */}
              <Form.Group className="mb-3">
                <Form.Label>Frecuencia</Form.Label>
                <Form.Select
                  name="idfrecuencia"
                  value={formData.idfrecuencia}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Mensual</option>
                  <option value="2">Anual</option>
                  <option value="3">Trimestral</option>
                  <option value="4">Bimestral</option>
                  <option value="5">Cuatrimestral</option>
                  <option value="6">Semestral</option>
                </Form.Select>
              </Form.Group>

              {/* Descripción */}
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ingresa una descripción"
                  required
                />
              </Form.Group>

              {/* Fecha de Inicio */}
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fechainicio"
                  value={formData.fechainicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Fecha de Fin */}
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Fin (Opcional)</Form.Label>
                <Form.Control
                  type="date"
                  name="fechafin"
                  value={formData.fechafin}
                  onChange={handleChange}
                  placeholder="Ingresa la fecha de fin"
                />
              </Form.Group>

              {/* Botón de Envío */}
              <Button variant="primary" type="submit" className="w-100">
                {isEditing ? "Actualizar Objetivo" : "Guardar Objetivo"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ObjOperacional;
