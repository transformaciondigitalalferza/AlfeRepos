import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Table,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFileAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    idobjoperacional: "",
    idusers: "",
    idestado: "",
    descripcion: "",
    evidencia: null,
    fechainicio: new Date().toISOString().split("T")[0],
    fechafin: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [objetivosOperacionales, setObjetivosOperacionales] = useState([]);

  const API_URL = "http://192.168.2.47:8000/api/tareas";
  const OBJETIVO_OPERACIONAL_API =
    "http://192.168.2.47:8000/api/objetivooperacional";
  const USERS_API = "http://192.168.2.47:8000/api/users";

  useEffect(() => {
    fetchTareas(currentPage);
    fetchObjetivosOperacionales();
    fetchUsers();
  }, [currentPage]);

  const fetchTareas = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}`);
      setTareas(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const fetchObjetivosOperacionales = async () => {
    try {
      const response = await axios.get(OBJETIVO_OPERACIONAL_API);
      setObjetivosOperacionales(response.data.data || response.data);
    } catch (error) {
      console.error("Error al obtener objetivos operacionales:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API);
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      evidencia: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("idobjoperacional", formData.idobjoperacional);
      formDataToSend.append("idusers", formData.idusers);
      formDataToSend.append("idestado", formData.idestado);
      formDataToSend.append("descripcion", formData.descripcion.trim());
      formDataToSend.append("fechainicio", formData.fechainicio);
      formDataToSend.append("fechafin", formData.fechafin);
      if (formData.evidencia) {
        formDataToSend.append("evidencia", formData.evidencia);
      }

      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(API_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchTareas(currentPage);
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      alert("Hubo un error al guardar la tarea. Verifica los datos.");
    }
  };

  const handleEdit = (tarea) => {
    setFormData({
      idobjoperacional: tarea.idobjoperacional.toString(),
      idusers: tarea.idusers.toString(),
      idestado: tarea.idestado.toString(),
      descripcion: tarea.descripcion,
      evidencia: null,
      fechainicio: tarea.fechainicio,
      fechafin: tarea.fechafin ? tarea.fechafin : "",
    });
    setEditId(tarea.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTareas(currentPage);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        alert("Hubo un error al eliminar la tarea.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idobjoperacional: "",
      idusers: "",
      idestado: "",
      descripcion: "",
      evidencia: null,
      fechainicio: new Date().toISOString().split("T")[0],
      fechafin: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const getEstadoColor = (idestado) => {
    switch (idestado) {
      case "1":
        return "secondary";
      case "2":
        return "warning";
      case "3":
        return "success";
      default:
        return "dark";
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mt-5 flex-grow-1">
        <h2 className="text-primary mb-4">Gestión de Tareas</h2>
        <Row className="align-items-center mb-4">
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <FaPlus className="me-2" /> Agregar Tarea
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Objetivo Operacional</th>
              <th>Descripción</th>
              <th>Usuario</th>
              <th>Evidencia</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => (
              <tr key={tarea.id}>
                <td>{tarea.objetivooperacional?.descripcion || "N/A"}</td>
                <td>{tarea.descripcion}</td>
                <td>{tarea.user?.name || "N/A"}</td>
                <td>
                  {tarea.evidencia ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Ver Evidencia</Tooltip>}
                    >
                      <Button
                        variant="link"
                        onClick={() =>
                          window.open(
                            `http://192.168.2.47:8000/storage/${tarea.evidencia}`,
                            "_blank"
                          )
                        }
                      >
                        <FaFileAlt size={20} color="#0d6efd" />
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    "Sin evidencia"
                  )}
                </td>
                <td>{tarea.fechainicio}</td>
                <td>{tarea.fechafin || "N/A"}</td>
                <td>
                  <Badge bg={getEstadoColor(tarea.idestado)}>
                    {tarea.estado?.descripcion || "N/A"}
                  </Badge>
                </td>
                <td className="d-flex justify-content-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Editar Tarea</Tooltip>}
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(tarea)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Eliminar Tarea</Tooltip>}
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(tarea.id)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Siguiente
          </Button>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Editar Tarea" : "Agregar Nueva Tarea"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Objetivo Operacional</Form.Label>
                <Form.Control
                  as="select"
                  name="idobjoperacional"
                  value={formData.idobjoperacional}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un Objetivo Operacional</option>
                  {objetivosOperacionales.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.descripcion}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  as="select"
                  name="idusers"
                  value={formData.idusers}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un Usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="idestado"
                  value={formData.idestado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un Estado</option>
                  <option value="1">Pendiente</option>
                  <option value="2">En Progreso</option>
                  <option value="3">Completado</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la tarea"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Evidencia</Form.Label>
                <Form.Control
                  type="file"
                  name="evidencia"
                  onChange={handleFileChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fechainicio"
                  value={formData.fechainicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="fechafin"
                  value={formData.fechafin}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Guardar Cambios
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Tareas;
