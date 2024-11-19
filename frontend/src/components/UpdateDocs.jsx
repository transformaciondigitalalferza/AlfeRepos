import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  ListGroup,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import { FaFileUpload, FaEye, FaSearch, FaEdit, FaTrash } from "react-icons/fa"; // Reimportado FaTrash

function UpdateDocs() {
  // Estados para la carga y errores
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingProcedimientos, setLoadingProcedimientos] = useState(true);
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState(null);

  // Estados para archivos y procedimientos
  const [filteredFilesList, setFilteredFilesList] = useState([]);
  const [procedimientosList, setProcedimientosList] = useState([]);
  const [filteredProcedimientosList, setFilteredProcedimientosList] = useState(
    []
  );
  const [searchTermProcedimientos, setSearchTermProcedimientos] = useState("");

  // Estados para subida de archivos
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [procedimientoFile, setProcedimientoFile] = useState(null);
  const [procedimientoFileName, setProcedimientoFileName] = useState("");
  const [selectedCargoId, setSelectedCargoId] = useState("");
  const [selectedRolId, setSelectedRolId] = useState("");

  const [cargosList, setCargosList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  // Estados para modales de actualización
  const [showUpdateModalProcedimiento, setShowUpdateModalProcedimiento] =
    useState(false);
  const [procedimientoToUpdate, setProcedimientoToUpdate] = useState(null);
  const [updatedNombreProcedimiento, setUpdatedNombreProcedimiento] =
    useState("");
  const [updatedIdCargoProcedimiento, setUpdatedIdCargoProcedimiento] =
    useState("");
  const [updatedIdRolProcedimiento, setUpdatedIdRolProcedimiento] =
    useState("");
  const [updatedArchivoProcedimiento, setUpdatedArchivoProcedimiento] =
    useState(null);

  const [showUpdateModalPolitica, setShowUpdateModalPolitica] = useState(false);
  const [politicaToUpdate, setPoliticaToUpdate] = useState(null);
  const [updatedNombrePolitica, setUpdatedNombrePolitica] = useState("");
  const [updatedIdCargoPolitica, setUpdatedIdCargoPolitica] = useState("");
  const [updatedArchivoPolitica, setUpdatedArchivoPolitica] = useState(null);

  // Fetching de datos optimizado
  useEffect(() => {
    const fetchProcedimientos = async () => {
      try {
        const [procedimientosResponse, cargosResponse, rolesResponse] =
          await Promise.all([
            axios.get("http://192.168.2.47:8000/api/procedimientos"),
            axios.get("http://192.168.2.47:8000/api/cargos"),
            axios.get("http://192.168.2.47:8000/api/roles"),
          ]);

        const cargosMap = {};
        cargosResponse.data.forEach((cargo) => {
          cargosMap[cargo.id] = cargo.nombrecargo;
        });

        const rolesMap = {};
        rolesResponse.data.forEach((rol) => {
          rolesMap[rol.id] = rol.nombre;
        });

        const procedimientosWithNames = procedimientosResponse.data.map(
          (procedimiento) => ({
            ...procedimiento,
            cargoName: cargosMap[procedimiento.idcargo] || "Desconocido",
            roleName: rolesMap[procedimiento.idrol] || "Desconocido",
          })
        );

        setProcedimientosList(procedimientosWithNames);
        setFilteredProcedimientosList(procedimientosWithNames);
      } catch (error) {
        console.error("Error al obtener la lista de procedimientos:", error);
        setError("No se pudo cargar la lista de procedimientos.");
      } finally {
        setLoadingProcedimientos(false);
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://192.168.2.47:8000/api/politicas");
        const policies = response.data;
        console.log("Políticas recibidas:", policies); // Verificar datos

        const policiesWithCargoName = await Promise.all(
          policies.map(async (policy) => {
            try {
              const cargoResponse = await axios.get(
                `http://192.168.2.47:8000/api/cargos/${policy.idcargo}`
              );
              const cargoName = cargoResponse.data.nombrecargo;
              return { ...policy, cargoName };
            } catch (error) {
              console.error(
                `Error al obtener el nombre del cargo para la política ${policy.id}:`,
                error
              );
              return { ...policy, cargoName: "Desconocido" };
            }
          })
        );

        setFilteredFilesList(policiesWithCargoName);
      } catch (error) {
        console.error("Error al obtener la lista de archivos:", error);
        setError("No se pudo cargar la lista de archivos de políticas.");
      } finally {
        setLoadingFiles(false);
      }
    };

    const fetchCargos = async () => {
      try {
        const response = await axios.get("http://192.168.2.47:8000/api/cargos");
        setCargosList(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de cargos:", error);
        setError("No se pudo cargar la lista de cargos.");
      } finally {
        setLoadingCargos(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://192.168.2.47:8000/api/roles");
        const filteredRoles = response.data.filter(
          (rol) => rol.id === 2 || rol.id === 3
        );
        setRolesList(filteredRoles);
      } catch (error) {
        console.error("Error al obtener la lista de roles:", error);
        setError("No se pudo cargar la lista de roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchProcedimientos();
    fetchFiles();
    fetchCargos();
    fetchRoles();
  }, []);

  // Manejo de subida de archivos de procedimientos
  const handleProcedimientoFileChange = (event) => {
    setProcedimientoFile(event.target.files[0]);
    setProcedimientoFileName(event.target.files[0].name);
  };

  const handleProcedimientoUpload = async () => {
    if (!procedimientoFile) {
      alert("Por favor, selecciona un archivo para subir.");
      return;
    }

    if (!selectedCargoId) {
      alert("Por favor, selecciona un cargo.");
      return;
    }

    if (!selectedRolId) {
      alert("Por favor, selecciona un rol.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", procedimientoFile);
    formData.append("nombre", procedimientoFileName);
    formData.append("idcargo", selectedCargoId);
    formData.append("idrol", selectedRolId);

    try {
      const response = await axios.post(
        "http://192.168.2.47:8000/api/procedimientos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Obtener nombres de cargo y rol desde el mapa existente
      const cargoName =
        cargosList.find((cargo) => cargo.id === response.data.idcargo)
          ?.nombrecargo || "Desconocido";
      const roleName =
        rolesList.find((rol) => rol.id === response.data.idrol)?.nombre ||
        "Desconocido";

      const newProcedimiento = {
        ...response.data,
        cargoName,
        roleName,
      };

      setProcedimientosList((prevProcedimientos) => [
        ...prevProcedimientos,
        newProcedimiento,
      ]);
      setFilteredProcedimientosList((prevProcedimientos) => [
        ...prevProcedimientos,
        newProcedimiento,
      ]);
      setProcedimientoFile(null);
      setProcedimientoFileName("");
      setSelectedCargoId("");
      setSelectedRolId("");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setError(
        "No se pudo subir el archivo de procedimiento. Inténtalo de nuevo."
      );
    }
  };

  // Manejo de visualización de archivos
  const handleView = (filePath) => {
    const adjustedPath = `storage/${filePath}`;
    window.open(`http://192.168.2.47:8000/${adjustedPath}`, "_blank");
  };

  // *** Función de Búsqueda Actualizada ***
  const handleSearchProcedimientos = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTermProcedimientos(searchTerm);
    const filtered = procedimientosList.filter(
      (procedimiento) =>
        procedimiento.nombre.toLowerCase().includes(searchTerm) ||
        procedimiento.cargoName.toLowerCase().includes(searchTerm)
    );
    setFilteredProcedimientosList(filtered);
  };

  // Manejo de eliminación de procedimientos
  const handleDeleteProcedimiento = async (procedimientoId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este procedimiento?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://192.168.2.47:8000/api/procedimientos/${procedimientoId}`
      );
      setProcedimientosList((prevProcedimientos) =>
        prevProcedimientos.filter((proc) => proc.id !== procedimientoId)
      );
      setFilteredProcedimientosList((prevProcedimientos) =>
        prevProcedimientos.filter((proc) => proc.id !== procedimientoId)
      );
    } catch (error) {
      console.error("Error al eliminar el procedimiento:", error);
      setError("No se pudo eliminar el procedimiento. Inténtalo de nuevo.");
    }
  };

  const openUpdateModalProcedimiento = (procedimiento) => {
    setProcedimientoToUpdate(procedimiento);
    setUpdatedNombreProcedimiento(procedimiento.nombre);
    setUpdatedIdCargoProcedimiento(procedimiento.idcargo);
    setUpdatedIdRolProcedimiento(procedimiento.idrol);
    setUpdatedArchivoProcedimiento(null);
    setShowUpdateModalProcedimiento(true);
  };

  const closeUpdateModalProcedimiento = () => {
    setShowUpdateModalProcedimiento(false);
    setProcedimientoToUpdate(null);
    setUpdatedNombreProcedimiento("");
    setUpdatedIdCargoProcedimiento("");
    setUpdatedIdRolProcedimiento("");
    setUpdatedArchivoProcedimiento(null);
  };

  const handleUpdateProcedimiento = async () => {
    if (!procedimientoToUpdate) return;

    try {
      await axios.delete(
        `http://192.168.2.47:8000/api/procedimientos/${procedimientoToUpdate.id}`
      );
      setProcedimientosList((prevProcedimientos) =>
        prevProcedimientos.filter(
          (proc) => proc.id !== procedimientoToUpdate.id
        )
      );
      setFilteredProcedimientosList((prevProcedimientos) =>
        prevProcedimientos.filter(
          (proc) => proc.id !== procedimientoToUpdate.id
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar el procedimiento para actualizar:",
        error
      );
      setError(
        "No se pudo eliminar el procedimiento para actualizar. Inténtalo de nuevo."
      );
      return;
    }

    const formData = new FormData();
    formData.append("nombre", updatedNombreProcedimiento);
    formData.append("idcargo", updatedIdCargoProcedimiento);
    formData.append("idrol", updatedIdRolProcedimiento);
    if (updatedArchivoProcedimiento) {
      formData.append("archivo", updatedArchivoProcedimiento);
    }

    try {
      const response = await axios.post(
        "http://192.168.2.47:8000/api/procedimientos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const cargoName =
        cargosList.find((cargo) => cargo.id === response.data.idcargo)
          ?.nombrecargo || "Desconocido";
      const roleName =
        rolesList.find((rol) => rol.id === response.data.idrol)?.nombre ||
        "Desconocido";

      const updatedProcedimiento = {
        ...response.data,
        cargoName,
        roleName,
      };

      setProcedimientosList((prevProcedimientos) => [
        ...prevProcedimientos,
        updatedProcedimiento,
      ]);
      setFilteredProcedimientosList((prevProcedimientos) => [
        ...prevProcedimientos,
        updatedProcedimiento,
      ]);
      closeUpdateModalProcedimiento();
    } catch (error) {
      console.error("Error al crear el nuevo procedimiento:", error);
      setError("No se pudo crear el nuevo procedimiento. Inténtalo de nuevo.");
    }
  };

  // Manejo de actualización de políticas
  const openUpdateModalPolitica = (politica) => {
    setPoliticaToUpdate(politica);
    setUpdatedNombrePolitica(politica.nombre);
    setUpdatedIdCargoPolitica(politica.idcargo);
    setUpdatedArchivoPolitica(null);
    setShowUpdateModalPolitica(true);
  };

  const closeUpdateModalPolitica = () => {
    setShowUpdateModalPolitica(false);
    setPoliticaToUpdate(null);
    setUpdatedNombrePolitica("");
    setUpdatedIdCargoPolitica("");
    setUpdatedArchivoPolitica(null);
  };

  const handleUpdatePolitica = async () => {
    if (!politicaToUpdate) return;

    try {
      await axios.delete(
        `http://192.168.2.47:8000/api/politicas/${politicaToUpdate.id}`
      );
      setFilteredFilesList((prevFiles) =>
        prevFiles.filter((file) => file.id !== politicaToUpdate.id)
      );
    } catch (error) {
      console.error("Error al eliminar la política para actualizar:", error);
      setError(
        "No se pudo eliminar la política para actualizar. Inténtalo de nuevo."
      );
      return;
    }

    const formData = new FormData();
    formData.append("nombre", updatedNombrePolitica);
    formData.append("idcargo", updatedIdCargoPolitica);
    if (updatedArchivoPolitica) {
      formData.append("archivo", updatedArchivoPolitica);
    }

    try {
      const response = await axios.post(
        "http://192.168.2.47:8000/api/politicas",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const cargoName =
        cargosList.find((cargo) => cargo.id === response.data.idcargo)
          ?.nombrecargo || "Desconocido";

      const updatedPolitica = {
        ...response.data,
        cargoName,
      };

      setFilteredFilesList((prevFiles) => [...prevFiles, updatedPolitica]);
      closeUpdateModalPolitica();
    } catch (error) {
      console.error("Error al crear la nueva política:", error);
      setError("No se pudo crear la nueva política. Inténtalo de nuevo.");
    }
  };

  // Mostrar spinner mientras se cargan los datos
  if (loadingFiles || loadingProcedimientos || loadingCargos || loadingRoles) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <span className="ms-2">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />

      {/* Contenido Principal */}
      <div className="content flex-grow-1 p-4">
        <Container fluid>
          <Row className="justify-content-center">
            {/* Sección de Políticas */}
            <Col xs={12} md={10} lg={8} className="mb-5">
              <Card className="shadow-lg">
                <Card.Body>
                  <h2 className="text-center mb-4">Políticas</h2>
                  {error && <Alert variant="danger">{error}</Alert>}

                  {/* Lista de Políticas Subidas */}
                  <h5 className="mt-4">Políticas Subidas</h5>
                  <ListGroup className="mt-3">
                    {filteredFilesList.map((file) => (
                      <ListGroup.Item
                        key={file.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{file.nombre}</strong>
                          <div className="text-muted">
                            Cargo: {file.cargoName}
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleView(file.archivo)}
                            className="me-2"
                            aria-label="Ver Política"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-warning"
                            onClick={() => openUpdateModalPolitica(file)}
                            className="me-2"
                            aria-label="Actualizar Política"
                          >
                            <FaEdit />
                          </Button>

                        </div>
                      </ListGroup.Item>
                    ))}
                    {filteredFilesList.length === 0 && (
                      <ListGroup.Item>
                        No se encontraron políticas con ese nombre.
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Sección de Procedimientos */}
            <Col xs={12} md={10} lg={8}>
              <Card className="shadow-lg">
                <Card.Body>
                  <h2 className="text-center mb-4">Procedimientos</h2>
                  {error && <Alert variant="danger">{error}</Alert>}

                  {/* Botón para subir procedimientos */}
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                    className="mb-3"
                  >
                    <FaFileUpload className="me-2" />
                    Subir Procedimiento
                  </Button>

                  {/* Encabezado y Barra de Búsqueda */}
                  <h5 className="mt-4">Procedimientos Subidos</h5>
                  <Form.Group controlId="searchProcedimientos">
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o cargo"
                        value={searchTermProcedimientos}
                        onChange={handleSearchProcedimientos}
                      />
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Lista de Procedimientos Subidos */}
                  <ListGroup className="mt-3">
                    {filteredProcedimientosList.map((procedimiento) => (
                      <ListGroup.Item
                        key={procedimiento.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{procedimiento.nombre}</strong>
                          <div className="text-muted">
                            Cargo: {procedimiento.cargoName}
                          </div>
                          <div className="text-muted">
                            Rol: {procedimiento.roleName}
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleView(procedimiento.archivo)}
                            className="me-2"
                            aria-label="Ver Procedimiento"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-warning"
                            onClick={() =>
                              openUpdateModalProcedimiento(procedimiento)
                            }
                            className="me-2"
                            aria-label="Actualizar Procedimiento"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() =>
                              handleDeleteProcedimiento(procedimiento.id)
                            }
                            aria-label="Eliminar Procedimiento"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                    {filteredProcedimientosList.length === 0 && (
                      <ListGroup.Item>
                        No se encontraron procedimientos con ese nombre o cargo.
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal para Subir Procedimiento */}
        <Modal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Procedimiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFileProcedimiento">
                <Form.Label>Archivo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleProcedimientoFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
              </Form.Group>

              <Form.Group controlId="selectCargo" className="mt-3">
                <Form.Label>Selecciona un Cargo</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCargoId}
                  onChange={(e) => setSelectedCargoId(e.target.value)}
                >
                  <option value="">Seleccione un cargo</option>
                  {cargosList.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombrecargo}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="selectRol" className="mt-3">
                <Form.Label>Selecciona un Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedRolId}
                  onChange={(e) => setSelectedRolId(e.target.value)}
                >
                  <option value="">Seleccione un rol</option>
                  {rolesList.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleProcedimientoUpload();
                setShowUploadModal(false);
              }}
              disabled={
                !procedimientoFile || !selectedCargoId || !selectedRolId
              }
            >
              Subir Archivo
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Actualizar Procedimiento */}
        <Modal
          show={showUpdateModalProcedimiento}
          onHide={closeUpdateModalProcedimiento}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Actualizar Procedimiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="updateNombreProcedimiento">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedNombreProcedimiento}
                  onChange={(e) =>
                    setUpdatedNombreProcedimiento(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId="updateSelectCargo" className="mt-3">
                <Form.Label>Selecciona un Cargo</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedIdCargoProcedimiento}
                  onChange={(e) =>
                    setUpdatedIdCargoProcedimiento(e.target.value)
                  }
                >
                  <option value="">Seleccione un cargo</option>
                  {cargosList.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombrecargo}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="updateSelectRol" className="mt-3">
                <Form.Label>Selecciona un Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedIdRolProcedimiento}
                  onChange={(e) => setUpdatedIdRolProcedimiento(e.target.value)}
                >
                  <option value="">Seleccione un rol</option>
                  {rolesList.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="updateFileProcedimiento" className="mt-3">
                <Form.Label>Archivo (opcional)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setUpdatedArchivoProcedimiento(e.target.files[0])
                  }
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeUpdateModalProcedimiento}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdateProcedimiento}>
              Actualizar Procedimiento
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Actualizar Política */}
        <Modal
          show={showUpdateModalPolitica}
          onHide={closeUpdateModalPolitica}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Actualizar Política</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="updateNombrePolitica">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedNombrePolitica}
                  onChange={(e) => setUpdatedNombrePolitica(e.target.value)}
                />
              </Form.Group>

              <Form.Group
                controlId="updateSelectCargoPolitica"
                className="mt-3"
              >
                <Form.Label>Selecciona un Cargo</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedIdCargoPolitica}
                  onChange={(e) => setUpdatedIdCargoPolitica(e.target.value)}
                >
                  <option value="">Seleccione un cargo</option>
                  {cargosList.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombrecargo}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="updateFilePolitica" className="mt-3">
                <Form.Label>Archivo (opcional)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setUpdatedArchivoPolitica(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeUpdateModalPolitica}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdatePolitica}>
              Actualizar Política
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default UpdateDocs;
