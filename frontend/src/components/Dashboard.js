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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Importamos el Sidebar

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navegación para redirigir al login

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token"); // Eliminar token del almacenamiento local
      delete axios.defaults.headers.common["Authorization"]; // Eliminar token de Axios
      navigate("/login"); // Redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar /> {/* Integración del Sidebar */}
      <div
        className="content p-4"
        style={{ marginLeft: "250px", width: "100%" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card>
                <Card.Body>
                  <h2 className="text-center mb-4">Dashboard</h2>

                  {error && <Alert variant="danger">{error}</Alert>}

                  {user ? (
                    <>
                      <p>
                        <strong>Nombre:</strong> {user.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>

                      <Button
                        variant="primary"
                        onClick={handleLogout}
                        className="w-100"
                      >
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Alert variant="warning">
                      No se pudo cargar la información del usuario.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Dashboard;
