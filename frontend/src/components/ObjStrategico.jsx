import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Table } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Sidebar
import { FaEdit, FaTrash } from "react-icons/fa"; // Iconos para editar y eliminar

const ObjStrategico = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [formData, setFormData] = useState({
    descripcion: "",
    fechainicio: new Date().toISOString().split("T")[0], // Fecha actual
    fechafin: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Controlar si estamos editando
  const [editId, setEditId] = useState(null); // Guardar ID del objetivo a editar

  const API_URL = "http://192.168.2.47:8000/api/objetivoestrategico";

  useEffect(() => {
    fetchObjetivos();
  }, []);

  const fetchObjetivos = async () => {
    try {
      const response = await axios.get(API_URL);
      setObjetivos(response.data);
    } catch (error) {
      console.error("Error al cargar los objetivos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      tipoobjetivo: 1, // Siempre asignar tipo de objetivo como 1
      fechaactualizacion: new Date().toISOString(), // Fecha y hora actual
    };

    try {
      if (isEditing) {
        // Editar objetivo
        await axios.put(`${API_URL}/${editId}`, dataToSend);
        fetchObjetivos(); // Recargar objetivos
        setIsEditing(false);
        setEditId(null);
      } else {
        // Crear nuevo objetivo
        await axios.post(API_URL, dataToSend);
        fetchObjetivos(); // Recargar objetivos
      }

      setFormData({
        descripcion: "",
        fechainicio: new Date().toISOString().split("T")[0],
        fechafin: "",
      });
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el objetivo:", error);
    }
  };

  const handleEdit = (objetivo) => {
    setFormData({
      descripcion: objetivo.descripcion,
      fechainicio: objetivo.fechainicio,
      fechafin: objetivo.fechafin,
    });
    setEditId(objetivo.id); // Guardar ID del objetivo a editar
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este objetivo?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchObjetivos(); // Recargar objetivos
      } catch (error) {
        console.error("Error al eliminar el objetivo:", error);
      }
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Gestión de Objetivos Estratégicos</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Agregar Objetivo
          </Button>
        </div>

        {/* Tabla de Objetivos */}
        <div className="table-responsive">
          <Table bordered hover className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Descripción</th>
                <th scope="col">Fecha de Inicio</th>
                <th scope="col">Fecha de Fin</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {objetivos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay objetivos estratégicos registrados.
                  </td>
                </tr>
              ) : (
                objetivos.map((objetivo) => (
                  <tr key={objetivo.id}>
                    <td>{objetivo.descripcion}</td>
                    <td>{objetivo.fechainicio}</td>
                    <td>{objetivo.fechafin}</td>
                    <td className="d-flex justify-content-around">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(objetivo)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(objetivo.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Modal para Agregar/Editar Objetivo */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Editar Objetivo" : "Agregar Nuevo Objetivo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
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
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="fechafin"
                  value={formData.fechafin}
                  onChange={handleChange}
                  required
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

export default ObjStrategico;
