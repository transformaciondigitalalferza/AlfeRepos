import React, { useState } from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './styles/grid.css';
import { BsList } from "react-icons/bs";

function Sidebar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    navigate(path);
    setShow(false); 
  };

  return (
    <>
    <div className="one">
      <Button variant="primary" onClick={handleShow} className="m-3">
        <BsList size={40} />
      </Button>
    </div>
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
            <Nav.Link onClick={() => handleNavigation("/comisiones")}>
              Calculo de Comisiones
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("/settings")}>
              Configuraciones
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("/objectives")}>
              Actividades
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
