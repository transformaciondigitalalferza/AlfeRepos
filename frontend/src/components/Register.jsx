import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.access_token);

      // Configurar el token para futuras solicitudes
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      setSuccessMessage("Registro exitoso. Redirigiendo al dashboard...");
      setTimeout(() => {
        navigate("/dashboard"); // Redirigir automáticamente después del registro
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ general: [error.response.data.message] });
      } else {
        setErrors({
          general: ["Error en el registro. Inténtalo de nuevo más tarde."],
        });
      }
    }
  };

  return (
    <Container>
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <div className="text-center mb-4">
                <img src={Logo} alt="Logo" style={{ width: "150px" }} />
              </div>
              <h2 className="text-center mb-4">Registrarse</h2>

              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
              {errors.general && (
                <Alert variant="danger">{errors.general[0]}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name && errors.name[0]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email && errors.email[0]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password && errors.password[0]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPasswordConfirmation"
                >
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    isInvalid={!!errors.password_confirmation}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password_confirmation &&
                      errors.password_confirmation[0]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Registrarse
                </Button>
              </Form>

              <div className="mt-3 text-center">
                ¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
