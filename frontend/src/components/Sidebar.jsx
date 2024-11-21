// Sidebar.jsx
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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { BsList, BsFileBarGraph } from "react-icons/bs";
import "./styles/sidebar.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const navigate = useNavigate();

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobile(false);
  };

  const handleCloseMobile = () => setShowMobile(false);
  const handleShowMobile = () => setShowMobile(true);

  // Definimos el tema oscuro de forma predeterminada
  const theme = "dark";
  const themes = {
    dark: {
      sidebar: {
        backgroundColor: "#343a40",
        color: "#ffffff",
      },
      menu: {
        icon: "#ffffff",
        hover: {
          backgroundColor: "#495057",
        },
      },
    },
  };

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
      label: "Actualización Procedimientos y Políticas",
    },
    { path: "/formats", icon: <FaFileAlt />, label: "Formatos" },
    {
      label: "Gestión Objetivos",
      icon: <FaTasks />,
      children: [
        {
          path: "/strategicobjectives",
          label: "Objetivos Estratégicos",
        },
        {
          path: "/operationalobjectives",
          label: "Objetivos Operacionales",
        },
      ],
    },
    {
      path: "/Tareas",
      icon: <FaTasks />,
      label: "Tareas",
    },
    {
      path: "/IndicadoresGest",
      icon: <BsFileBarGraph />,
      label: "Control de Gestión(MCI)",
    },
    { path: "/logout", icon: <FaSignOutAlt />, label: "Cerrar Sesión" },
  ];

  const toggleSubmenu = (label) => {
    if (openSubmenu === label) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(label);
    }
  };

  return (
    <>
      {/* Botón para dispositivos móviles */}
      <div className="mobile-toggle-button d-block d-md-none p-2">
        <Button variant="primary" onClick={handleShowMobile}>
          <BsList size={24} />
        </Button>
      </div>

      {/* Sidebar principal */}
      <div
        className={`sidebar d-none d-md-flex flex-column ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
        style={{
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s",
          backgroundColor: themes[theme].sidebar.backgroundColor,
          color: themes[theme].sidebar.color,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
        }}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
          {!collapsed && <h4 className="mb-0">Menú</h4>}
          <Button
            variant="link"
            onClick={handleToggle}
            style={{ color: themes[theme].menu.icon }}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </Button>
        </div>
        <Nav className="flex-column flex-grow-1">
          {navLinks.map((link, index) => {
            if (link.children) {
              return (
                <div key={index} className="sidebar-accordion">
                  <Nav.Link
                    as="div"
                    className="d-flex align-items-center px-3 py-2 sidebar-link"
                    onClick={() => toggleSubmenu(link.label)}
                    style={{
                      cursor: "pointer",
                      color: themes[theme].menu.icon,
                      backgroundColor:
                        openSubmenu === link.label
                          ? themes[theme].menu.hover.backgroundColor
                          : "transparent",
                      borderRadius: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    {link.icon}
                    {!collapsed && (
                      <>
                        <span className="ms-2">{link.label}</span>
                        <span className="ms-auto">
                          {openSubmenu === link.label ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </span>
                      </>
                    )}
                  </Nav.Link>
                  {!collapsed && openSubmenu === link.label && (
                    <Nav className="flex-column ms-3">
                      {link.children.map((child, childIndex) => (
                        <Nav.Link
                          key={childIndex}
                          onClick={() => handleNavigation(child.path)}
                          className="d-flex align-items-center px-3 py-2 sidebar-link"
                          style={{
                            color: themes[theme].sidebar.color,
                            backgroundColor: "transparent",
                            paddingLeft: "30px",
                          }}
                        >
                          <span className="ms-2">{child.label}</span>
                        </Nav.Link>
                      ))}
                    </Nav>
                  )}
                </div>
              );
            } else {
              return (
                <Nav.Link
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="d-flex align-items-center px-3 py-2 sidebar-link"
                  style={{
                    color: themes[theme].menu.icon,
                    backgroundColor: "transparent",
                    marginBottom: "4px",
                  }}
                >
                  {link.icon}
                  {!collapsed && <span className="ms-2">{link.label}</span>}
                </Nav.Link>
              );
            }
          })}
        </Nav>
        {/* Sección de configuración eliminada */}
      </div>

      {/* Offcanvas para dispositivos móviles */}
      <Offcanvas
        show={showMobile}
        onHide={handleCloseMobile}
        backdrop={false}
        className="d-md-none"
        style={{
          backgroundColor: themes[theme].sidebar.backgroundColor,
          color: themes[theme].sidebar.color,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navLinks.map((link, index) => {
              if (link.children) {
                return (
                  <div key={index} className="sidebar-accordion">
                    <Nav.Link
                      as="div"
                      className="d-flex align-items-center px-3 py-2 sidebar-link"
                      onClick={() => toggleSubmenu(link.label)}
                      style={{
                        cursor: "pointer",
                        color: themes[theme].menu.icon,
                        backgroundColor:
                          openSubmenu === link.label
                            ? themes[theme].menu.hover.backgroundColor
                            : "transparent",
                        borderRadius: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {link.icon}
                      <span className="ms-2">{link.label}</span>
                      <span className="ms-auto">
                        {openSubmenu === link.label ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </Nav.Link>
                    {openSubmenu === link.label && (
                      <Nav className="flex-column ms-3">
                        {link.children.map((child, childIndex) => (
                          <Nav.Link
                            key={childIndex}
                            onClick={() => handleNavigation(child.path)}
                            className="d-flex align-items-center px-3 py-2 sidebar-link"
                            style={{
                              color: themes[theme].sidebar.color,
                              backgroundColor: "transparent",
                              paddingLeft: "30px",
                            }}
                          >
                            <span className="ms-2">{child.label}</span>
                          </Nav.Link>
                        ))}
                      </Nav>
                    )}
                  </div>
                );
              } else {
                return (
                  <Nav.Link
                    key={index}
                    onClick={() => handleNavigation(link.path)}
                    className="d-flex align-items-center px-3 py-2 sidebar-link"
                    style={{
                      color: themes[theme].menu.icon,
                      backgroundColor: "transparent",
                      marginBottom: "4px",
                    }}
                  >
                    {link.icon}
                    <span className="ms-2">{link.label}</span>
                  </Nav.Link>
                );
              }
            })}
          </Nav>
          {/* Opciones de configuración eliminadas */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
