import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa"; // Importamos los iconos

function Formats() {
  const [idcargo, setIdcargo] = useState("");
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFormato, setSelectedFormato] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener la lista de cargos al cargar el componente
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const cargosRes = await axios.get("http://192.168.2.47:8000/api/cargos");
        setCargos(cargosRes.data);
      } catch (error) {
        console.error("Error al obtener los cargos:", error);
        setFetchError(
          "No se pudieron cargar los cargos. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchCargos();
  }, []);

  // Obtener la lista de formatos al cargar el componente
  useEffect(() => {
    const fetchFormatos = async () => {
      try {
        const formatosRes = await axios.get(
          "http://192.168.2.47:8000/api/formatos"
        );

        // Para cada formato, obtenemos el nombre del cargo correspondiente
        const formatosConCargo = await Promise.all(
          formatosRes.data.map(async (formato) => {
            const cargoRes = await axios.get(
              `http://192.168.2.47:8000/api/cargos/${formato.idcargo}`
            );
            return {
              ...formato,
              nombrecargo: cargoRes.data.nombrecargo,
            };
          })
        );

        setFormatos(formatosConCargo);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los formatos:", error);
        setFetchError(
          "No se pudieron cargar los formatos. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchFormatos();
  }, []);

  // Función para manejar el envío del formulario de creación
  const handleNewSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      Swal.fire({
        icon: "warning",
        title: "Falta el archivo",
        text: "Por favor, selecciona un archivo para subir.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("idcargo", idcargo);
    formData.append("nombre", nombre);
    formData.append("archivo", archivo);

    try {
      const token = localStorage.getItem("token"); // Si usas autenticación

      const response = await axios.post(
        "http://192.168.2.47:8000/api/formatos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);

      // Obtener el nombre del cargo para el nuevo formato
      const cargoRes = await axios.get(
        `http://192.168.2.47:8000/api/cargos/${response.data.idcargo}`
      );
      const nuevoFormato = {
        ...response.data,
        nombrecargo: cargoRes.data.nombrecargo,
      };

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Archivo subido exitosamente.",
      });

      // Actualizar la lista de formatos
      setFormatos([...formatos, nuevoFormato]);

      // Limpiar campos y cerrar modal
      setIdcargo("");
      setNombre("");
      setArchivo(null);
      setErrors({});
      setShowNewModal(false);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).flat();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessages.join(" "),
        });
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.mensaje
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.mensaje,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al subir el archivo. Inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  // Función para manejar el inicio de la edición
  const handleEdit = (formato) => {
    setSelectedFormato(formato);
    setIdcargo(formato.idcargo.toString());
    setNombre(formato.nombre);
    setArchivo(null);
    setErrors({});
    setShowEditModal(true);
  };

  // Función para manejar la actualización del formato (DELETE + POST)
  const handleUpdate = async () => {
    if (!selectedFormato) return;

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará el formato existente y se creará uno nuevo con los cambios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token"); // Si usas autenticación

          // Paso 1: Eliminar el formato existente
          await axios.delete(
            `http://192.168.2.47:8000/api/formatos/${selectedFormato.id}`,
            {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          );

          // Paso 2: Crear un nuevo formato con los datos actualizados
          const formData = new FormData();
          formData.append("idcargo", idcargo);
          formData.append("nombre", nombre);
          if (archivo) {
            formData.append("archivo", archivo);
          }

          const response = await axios.post(
            "http://192.168.2.47:8000/api/formatos",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          );

          console.log("Respuesta del servidor:", response.data);

          // Obtener el nombre del cargo para el formato actualizado
          const cargoRes = await axios.get(
            `http://192.168.2.47:8000/api/cargos/${response.data.idcargo}`
          );
          const formatoActualizado = {
            ...response.data,
            nombrecargo: cargoRes.data.nombrecargo,
          };

          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Formato actualizado exitosamente.",
          });

          // Actualizar la lista de formatos
          const updatedFormatos = formatos.filter(
            (f) => f.id !== selectedFormato.id
          );
          setFormatos([...updatedFormatos, formatoActualizado]);

          // Limpiar campos y cerrar modal
          setIdcargo("");
          setNombre("");
          setArchivo(null);
          setSelectedFormato(null);
          setErrors({});
          setShowEditModal(false);
        } catch (error) {
          console.error("Error al actualizar el formato:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al actualizar el formato. Por favor, inténtalo de nuevo.",
          });
        }
      }
    });
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedFormato(null);
    setIdcargo("");
    setNombre("");
    setArchivo(null);
    setErrors({});
  };

  // Función para cerrar el modal de creación
  const handleCloseNewModal = () => {
    setShowNewModal(false);
    setIdcargo("");
    setNombre("");
    setArchivo(null);
    setErrors({});
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar formatos según el término de búsqueda
  const formatosFiltrados = formatos.filter((formato) => {
    const term = searchTerm.toLowerCase();
    return (
      formato.nombre.toLowerCase().includes(term) ||
      formato.nombrecargo.toLowerCase().includes(term)
    );
  });

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <span className="ms-2">Cargando datos...</span>
      </Container>
    );
  }

  // Mostrar error si falla la carga de datos
  if (fetchError) {
    return (
      <Container className="p-4">
        <Alert variant="danger" className="text-center">
          {fetchError}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container className="p-4">
        {/* Encabezado y Botón Nuevo */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <h2 className="mb-0">Formatos</h2>
          </Col>
          <Col
            xs={12}
            md={6}
            className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0"
          >
            <Button variant="primary" onClick={() => setShowNewModal(true)}>
              Nuevo
            </Button>
          </Col>
        </Row>

        {/* Campo de Búsqueda */}
        <Row className="mb-4">
          <Col>
            <InputGroup>
              <Form.Control
                placeholder="Buscar por nombre o cargo"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary" disabled>
                <FaSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        {/* Tabla de formatos */}
        <Row>
          <Col>
            {formatosFiltrados.length > 0 ? (
              <Table striped bordered hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formatosFiltrados.map((formato) => (
                    <tr key={formato.id}>
                      <td>{formato.nombre}</td>
                      <td>{formato.nombrecargo}</td>
                      <td className="text-center">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            window.open(
                              `http://192.168.2.47:8000/storage/${formato.archivo}`,
                              "_blank"
                            )
                          }
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(formato)}
                        >
                          <FaEdit />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No hay formatos disponibles.</Alert>
            )}
          </Col>
        </Row>

        {/* Modal para crear nuevo formato */}
        <Modal show={showNewModal} onHide={handleCloseNewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Formato</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleNewSubmit}>
              {/* Cargo */}
              <Form.Group className="mb-3" controlId="formBasicIdcargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Select
                  value={idcargo}
                  onChange={(e) => setIdcargo(e.target.value)}
                  isInvalid={!!errors.idcargo}
                  required
                >
                  <option value="">Selecciona un cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombrecargo}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.idcargo && errors.idcargo[0]}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Nombre */}
              <Form.Group className="mb-3" controlId="formBasicNombre">
                <Form.Label>Nombre del Archivo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre del archivo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  isInvalid={!!errors.nombre}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre && errors.nombre[0]}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Archivo */}
              <Form.Group className="mb-3" controlId="formBasicArchivo">
                <Form.Label>Archivo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    setArchivo(e.target.files[0]);
                    setNombre(e.target.files[0]?.name || "");
                  }}
                  isInvalid={!!errors.archivo}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.archivo && errors.archivo[0]}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Botón de Envío */}
              <Button variant="success" type="submit">
                Guardar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal para editar formato */}
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Formato</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Cargo */}
              <Form.Group className="mb-3" controlId="modalFormIdcargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Select
                  value={idcargo}
                  onChange={(e) => setIdcargo(e.target.value)}
                  isInvalid={!!errors.idcargo}
                  required
                >
                  <option value="">Selecciona un cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombrecargo}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.idcargo && errors.idcargo[0]}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Nombre */}
              <Form.Group className="mb-3" controlId="modalFormNombre">
                <Form.Label>Nombre del Archivo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre del archivo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  isInvalid={!!errors.nombre}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre && errors.nombre[0]}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Archivo */}
              <Form.Group className="mb-3" controlId="modalFormArchivo">
                <Form.Label>
                  Archivo (dejar en blanco para mantener el actual)
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    setArchivo(e.target.files[0]);
                    setNombre(e.target.files[0]?.name || nombre);
                  }}
                  isInvalid={!!errors.archivo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.archivo && errors.archivo[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Formats;
