import React, { useState } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaChartLine,
  FaCog,
  FaTasks,
  FaUserPlus,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsList } from "react-icons/bs";
import "./styles/sidebar.css"; // Mantén o minimiza según sea necesario

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobile(false); // Cerrar el Offcanvas móvil al navegar
  };

  const handleCloseMobile = () => setShowMobile(false);
  const handleShowMobile = () => setShowMobile(true);

  const navLinks = [
    { path: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/profile", icon: <FaUser />, label: "Perfil" },
    {
      path: "/comisiones",
      icon: <FaChartLine />,
      label: "Cálculo de Comisiones",
    },
    { path: "/settings", icon: <FaCog />, label: "Configuraciones" },
    { path: "/register", icon: <FaUserPlus />, label: "Nuevo Usuario" },
    {
      path: "/UpdateDocs",
      icon: <FaFileAlt />,
      label: "Actualizacion Procedimientos y Políticas",
    },
    { path: "/formats", icon: <FaFileAlt />, label: "Formatos" },
    {
      path: "/strategicobjectives",
      icon: <FaTasks />,
      label: "Objetivos Estratégicos",
    },
    {
      path: "/operationalobjectives",
      icon: <FaTasks />,
      label: "Objetivos Operacionales",
    },
    {
      path: "/Tareas",
      icon: <FaTasks />,
      label: "Tareas",
    },
    { path: "/logout", icon: <FaSignOutAlt />, label: "Cerrar Sesión" },
  ];

  return (
    <>
      <div className="mobile-toggle-button d-block d-md-none p-2">
        <Button variant="primary" onClick={handleShowMobile}>
          <BsList size={24} />
        </Button>
      </div>

      <div
        className={`sidebar d-none d-md-flex flex-column bg-light ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
        style={{
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s",
        }}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
          {!collapsed && <h4 className="mb-0">Menú</h4>}
          <Button variant="link" onClick={handleToggle}>
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </Button>
        </div>
        <Nav className="flex-column flex-grow-1">
          {navLinks.map((link, index) => (
            <Nav.Link
              key={index}
              onClick={() => handleNavigation(link.path)}
              className="d-flex align-items-center px-3 py-2 sidebar-link"
            >
              {link.icon}
              {!collapsed && <span className="ms-2">{link.label}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <Offcanvas
        show={showMobile}
        onHide={handleCloseMobile}
        backdrop={false}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavigation(link.path)}
                className="d-flex align-items-center px-3 py-2"
              >
                {link.icon}
                <span className="ms-2">{link.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
