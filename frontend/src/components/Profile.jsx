import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import Sidebar from "./Sidebar";

function Profile() {
  const id = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User ID:", id);
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("API response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        setError("No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!user) {
    return (
      <Alert variant="warning">
        No se pudieron obtener los datos del usuario.
      </Alert>
    );
  }

  // Verifica que 'user' tenga las propiedades necesarias
  const { id: userId, name, email, nombrecargo, nombres } = user;

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="p-4 bg-light">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white text-center">
                <h2>Perfil de Usuario</h2>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src={`https://robohash.org/${userId}.png?size=150x150`}
                    alt="Perfil"
                    className="rounded-circle mb-3"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <h3>{name}</h3>
                  <p className="text-muted">{email}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Cargo:</strong> {nombrecargo}
                  </li>
                  <li className="list-group-item">
                    <strong>Área:</strong> {nombres}
                  </li>
                </ul>
                <Button
                  variant="primary"
                  className="w-100 mt-4"
                  onClick={() => alert("Función adicional próximamente")}
                >
                  Editar Perfil
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
