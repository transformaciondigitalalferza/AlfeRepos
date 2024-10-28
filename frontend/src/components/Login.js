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
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.access_token);

      // Configurar el encabezado Authorization para futuras solicitudes
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      navigate("/dashboard"); // Redirigir al dashboard
    } catch (error) {
      console.error(error);
      setError("Credenciales incorrectas o error en el servidor.");
    } finally {
      setLoading(false);
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
              <h2 className="text-center mb-4">Iniciar Sesión</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
