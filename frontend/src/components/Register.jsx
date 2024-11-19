import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import Logo from "../assets/logo.png";

function CreateUser() {
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [idcargo, setIdcargo] = useState("");
  const [idarea, setIdarea] = useState("");
  const [subarea, setSubarea] = useState("");
  const [estado, setEstado] = useState(true);
  const [rol, setRol] = useState("");

  const [errors, setErrors] = useState({});

  // Estados para las listas de cargos, áreas, roles y subáreas
  const [cargos, setCargos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [filteredSubareas, setFilteredSubareas] = useState([]);

  // Estados para la carga y errores
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetching de datos
  useEffect(() => {
    const fetchData = async (url, setter, path = "") => {
      try {
        const response = await axios.get(url);
        const data = path
          .split(".")
          .reduce(
            (acc, part) => (part ? (acc ? acc[part] : null) : acc),
            response.data
          );
        console.log(`Datos obtenidos de ${url}: `, data);
        setter(data);
      } catch (error) {
        console.error(`Error al obtener datos de ${url}:`, error);
        setFetchError(
          "No se pudieron cargar algunos datos. Por favor, inténtalo de nuevo más tarde."
        );
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchData("http://192.168.2.47:8000/api/cargos", setCargos),
        fetchData("http://192.168.2.47:8000/api/areas", setAreas, "data.data"),
        fetchData("http://192.168.2.47:8000/api/roles", setRoles),
        fetchData("http://192.168.2.47:8000/api/subareas", setSubareas),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // Filtrar subáreas según el área seleccionada
  useEffect(() => {
    if (idarea) {
      const filtered = subareas.filter(
        (sub) => String(sub.idarea) === String(idarea)
      );
      console.log(`Subáreas filtradas para idarea=${idarea}:`, filtered);
      setFilteredSubareas(filtered);
    } else {
      setFilteredSubareas([]);
    }
    setSubarea("");
  }, [idarea, subareas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "No Autorizado",
          text: "No estás autenticado. Por favor, inicia sesión.",
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const rolValue = rol ? parseInt(rol, 10) : null;

      const payload = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        idcargo: idcargo || null,
        idarea: idarea || null,
        subarea: subarea || null,
        estado,
        rol: rolValue,
      };

      console.log("Enviando payload:", payload);

      await axios.post("http://192.168.2.47:8000/api/register", payload, config);

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario creado exitosamente.",
      });

      // Limpiar campos
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setIdcargo("");
      setIdarea("");
      setSubarea("");
      setEstado(true);
      setRol("");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
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
        error.response.data.message
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al crear el usuario. Inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <Container
          fluid
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <span className="ms-2">Cargando datos...</span>
        </Container>
      </div>
    );
  }

  // Mostrar error si falla la carga de datos
  if (fetchError) {
    return (
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="p-4">
          <Alert variant="danger" className="text-center">
            {fetchError}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <Container fluid className="p-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                {/* Logo y Título */}
                <div className="text-center mb-4">
                  <img src={Logo} alt="Logo" style={{ width: "150px" }} />
                </div>
                <h2 className="text-center mb-4">Crear Nuevo Usuario</h2>

                {/* Formulario de Creación de Usuario */}
                <Form onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa el nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name && errors.name[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Correo Electrónico */}
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingresa el correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email && errors.email[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa la contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password && errors.password[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Confirmar Contraseña */}
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicPasswordConfirmation"
                  >
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirma la contraseña"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      isInvalid={!!errors.password_confirmation}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password_confirmation &&
                        errors.password_confirmation[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Cargo */}
                  <Form.Group className="mb-3" controlId="formBasicIdcargo">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                      as="select"
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
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.idcargo && errors.idcargo[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Área */}
                  <Form.Group className="mb-3" controlId="formBasicIdarea">
                    <Form.Label>Área</Form.Label>
                    <Form.Control
                      as="select"
                      value={idarea}
                      onChange={(e) => setIdarea(e.target.value)}
                      isInvalid={!!errors.idarea}
                      required
                    >
                      <option value="">Selecciona un área</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombres}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.idarea && errors.idarea[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Subárea */}
                  <Form.Group className="mb-3" controlId="formBasicSubarea">
                    <Form.Label>Subárea</Form.Label>
                    <Form.Control
                      as="select"
                      value={subarea}
                      onChange={(e) => setSubarea(e.target.value)}
                      isInvalid={!!errors.subarea}
                      disabled={filteredSubareas.length === 0}
                      required
                    >
                      <option value="">Selecciona una subárea</option>
                      {filteredSubareas.map((subareaItem) => (
                        <option key={subareaItem.id} value={subareaItem.id}>
                          {subareaItem.nombresubarea}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.subarea && errors.subarea[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Rol */}
                  <Form.Group className="mb-3" controlId="formBasicRol">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      as="select"
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                      isInvalid={!!errors.rol}
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.nombre}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.rol && errors.rol[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Estado */}
                  <Form.Group className="mb-3" controlId="formBasicEstado">
                    <Form.Check
                      type="checkbox"
                      label="Activo"
                      checked={estado}
                      onChange={(e) => setEstado(e.target.checked)}
                    />
                  </Form.Group>

                  {/* Botón de Envío */}
                  <Button variant="primary" type="submit" className="w-100">
                    Crear Usuario
                  </Button>
                </Form>

                {/* Enlace para volver al Dashboard */}
                <div className="mt-3 text-center">
                  <Button
                    variant="link"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Volver al Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateUser;
