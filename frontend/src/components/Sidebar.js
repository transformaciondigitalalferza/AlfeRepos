import React, { useState } from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [show, setShow] = useState(false); // Estado para controlar la visibilidad
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    navigate(path);
    setShow(false); // Cierra el sidebar al navegar
  };

  return (
    <>
      {/* Botón para abrir el sidebar */}
      <Button variant="primary" onClick={handleShow} className="m-3">
        Menú
      </Button>

      {/* Sidebar tipo Offcanvas de Bootstrap */}
      <Offcanvas show={show} onHide={handleClose} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => handleNavigation("/dashboard")}>
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("/profile")}>
              Perfil
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("/settings")}>
              Configuraciones
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("/logout")}>
              Cerrar Sesión
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
