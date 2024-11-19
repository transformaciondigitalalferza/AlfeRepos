import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ProgressBar,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFilter } from "react-icons/fa";
import Sidebar from "./Sidebar";

const ObjOperacional = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [objetivosEstrategicos, setObjetivosEstrategicos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");
  const [formData, setFormData] = useState({
    idobjetivoestrategico: "",
    idfrecuencia: "1",
    descripcion: "",
    meta: "",
    fechainicio: new Date().toISOString().split("T")[0],
    fechafin: "",
    idarea: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const API_URL_OPERACIONAL = "http://192.168.2.47:8000/api/objetivooperacional";
  const API_URL_ESTRATEGICO = "http://192.168.2.47:8000/api/objetivoestrategico";
  const API_URL_AREA = "http://192.168.2.47:8000/api/areas";

  useEffect(() => {
    fetchObjetivos();
    fetchObjetivosEstrategicos();
    fetchAreas();
  }, []);

  const fetchObjetivos = async () => {
    try {
      const response = await axios.get(API_URL_OPERACIONAL);
      const objetivosConIdNumerico = response.data.map((objetivo) => ({
        ...objetivo,
        idobjetivoestrategico: Number(objetivo.idobjetivoestrategico),
        idfrecuencia: Number(objetivo.idfrecuencia),
        meta: Number(objetivo.meta),
        idarea: objetivo.idarea ? Number(objetivo.idarea) : null,
      }));
      setObjetivos(objetivosConIdNumerico);
    } catch (error) {
      console.error("Error al cargar los objetivos operacionales:", error);
      alert("Hubo un error al cargar los objetivos operacionales.");
    }
  };

  const fetchObjetivosEstrategicos = async () => {
    try {
      const response = await axios.get(API_URL_ESTRATEGICO);
      setObjetivosEstrategicos(response.data);
    } catch (error) {
      console.error("Error al cargar los objetivos estratégicos:", error);
      alert("Hubo un error al cargar los objetivos estratégicos.");
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(API_URL_AREA);
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data.data)
      ) {
        setAreas(response.data.data.data);
      } else {
        console.error("Formato de datos de áreas no reconocido.");
        alert("Formato de datos de áreas no reconocido.");
        setAreas([]);
      }
    } catch (error) {
      console.error("Error al cargar las áreas:", error);
      alert("Hubo un error al cargar las áreas.");
      setAreas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFilterChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const filteredObjetivos = useMemo(() => {
    return selectedArea === "all"
      ? objetivos
      : objetivos.filter((objetivo) => objetivo.idarea === Number(selectedArea));
  }, [objetivos, selectedArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metaValue = Number(formData.meta);
    if (isNaN(metaValue) || metaValue < 0 || metaValue > 100) {
      alert("Por favor, ingresa un valor válido para 'Meta' (0-100).");
      return;
    }
    const dataToSend = {
      ...formData,
      idobjetivoestrategico: Number(formData.idobjetivoestrategico),
      idfrecuencia: Number(formData.idfrecuencia),
      meta: metaValue,
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

  const handleEdit = (objetivo) => {
    setFormData({
      idobjetivoestrategico: objetivo.idobjetivoestrategico.toString(),
      idfrecuencia: objetivo.idfrecuencia.toString(),
      descripcion: objetivo.descripcion,
      meta: objetivo.meta.toString(),
      fechainicio: objetivo.fechainicio.split("T")[0],
      fechafin: objetivo.fechafin ? objetivo.fechafin.split("T")[0] : "",
      idarea: objetivo.idarea ? objetivo.idarea.toString() : "",
    });
    setEditId(objetivo.id);
    setIsEditing(true);
    setShowModal(true);
  };

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

  const resetForm = () => {
    setFormData({
      idobjetivoestrategico: "",
      idfrecuencia: "1",
      descripcion: "",
      meta: "",
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

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container mt-5 flex-grow-1">
        <h2 className="text-primary mb-4">Objetivos Estratégicos</h2>
        <Row className="align-items-center mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><FaFilter /></InputGroup.Text>
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
          <Col md={6} className="text-end">
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

        {Object.keys(groupedObjetivos).map((estrategicoId) => {
          const estrategico = objetivosEstrategicos.find(
            (estrategico) => estrategico.id === Number(estrategicoId)
          );
          const objetivosOperacionales = groupedObjetivos[estrategicoId];
          
          return (
            <div key={estrategicoId} className="mb-5">
              <h4 className="text-secondary mb-4">
                {estrategico ? estrategico.descripcion : "Objetivo Estratégico Desconocido"}
              </h4>
              <Row>
                {objetivosOperacionales.map((objetivo) => (
                  <Col md={6} lg={4} key={objetivo.id} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">
                          {areas.find((area) => area.id === objetivo.idarea)?.nombres || "Área No especificada"}
                        </Card.Subtitle>
                        <Card.Text>{objetivo.descripcion}</Card.Text>
                        <ProgressBar
                          now={objetivo.meta}
                          label={`${objetivo.meta}%`}
                          variant={
                            objetivo.meta >= 100
                              ? "success"
                              : objetivo.meta >= 75
                              ? "info"
                              : objetivo.meta >= 50
                              ? "warning"
                              : "danger"
                          }
                          striped
                          animated
                        />
                        <div className="mt-3 d-flex justify-content-between">
                          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(objetivo)}>
                            <FaEdit /> Editar
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(objetivo.id)}>
                            <FaTrash /> Eliminar
                          </Button>
                        </div>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        <small>Fecha Inicio: {objetivo.fechainicio.split("T")[0]}</small>
                        <br />
                        <small>Fecha Fin: {objetivo.fechafin ? objetivo.fechafin.split("T")[0] : "No especificada"}</small>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}

        {/* Modal */}
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
              <Form.Group className="mb-3">
                <Form.Label>Área</Form.Label>
                <Form.Select
                  name="idarea"
                  value={formData.idarea}
                  onChange={handleChange}
                  required={false}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombres}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
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
                  <option value="3">Trimestre</option>
                  <option value="4">Bimestre</option>
                  <option value="5">Cuatrimestre</option>
                  <option value="6">Semestre</option>
                </Form.Select>
              </Form.Group>
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
              <Form.Group className="mb-3">
                <Form.Label>Meta (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="meta"
                  value={formData.meta}
                  onChange={handleChange}
                  placeholder="Ingresa la meta (0-100)"
                  required
                  min="0"
                  max="100"
                />
              </Form.Group>
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
