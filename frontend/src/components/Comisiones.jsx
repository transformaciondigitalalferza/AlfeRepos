import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
  Pagination,
  Card,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/comisiones.css";
import Sidebar from "./Sidebar";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faDownload,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

const Comisiones = () => {
  // Estados para Proyectos, Comisiones y Detallado
  const [proyectos, setProyectos] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [errorProyectos, setErrorProyectos] = useState(null);

  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [comisionesData, setComisionesData] = useState([]);
  const [loadingComisiones, setLoadingComisiones] = useState(false);
  const [errorComisiones, setErrorComisiones] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [comisionesDetalladoData, setComisionesDetalladoData] = useState([]);
  const [loadingComisionesDetallado, setLoadingComisionesDetallado] =
    useState(false);
  const [errorComisionesDetallado, setErrorComisionesDetallado] = useState(null);
  const [exportSuccessComisionesDetallado, setExportSuccessComisionesDetallado] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch proyectos al montar el componente
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch("http://192.168.2.47:8000/api/proyectos");
        if (!response.ok) throw new Error("Error al obtener los proyectos");
        const data = await response.json();
        setProyectos(data.data.data);
      } catch (err) {
        setErrorProyectos(err.message);
      } finally {
        setLoadingProyectos(false);
      }
    };
    fetchProyectos();
  }, []);

  // Fetch comisiones basado en el proyecto seleccionado
  const handleFetchComisiones = async () => {
    if (!selectedProjectId) return;
    setLoadingComisiones(true);
    setErrorComisiones(null);
    setComisionesData([]);
    setExportSuccess(false);

    try {
      const response = await fetch(
        `http://192.168.2.47:8000/api/comisiones?Numero=${selectedProjectId}`
      );
      if (!response.ok) throw new Error("Error al obtener los datos de comisiones");
      const data = await response.json();

      // Agregar el campo Total a cada elemento de comisionesData
      const dataWithTotal = data.data.map((row) => ({
        ...row,
        total:
          Number(row.total_suma) + Number(row.comporc) + Number(row.comdesc),
      }));

      setComisionesData(dataWithTotal);
    } catch (err) {
      setErrorComisiones(err.message);
    } finally {
      setLoadingComisiones(false);
    }
  };

  // Fetch comisiones detalladas
  const handleFetchComisionesDetallado = async () => {
    setLoadingComisionesDetallado(true);
    setErrorComisionesDetallado(null);
    setComisionesDetalladoData([]);
    setExportSuccessComisionesDetallado(false);
    setCurrentPage(1);

    try {
      const response = await fetch("http://192.168.2.47:8000/api/migraciones");
      if (!response.ok) throw new Error("Error al obtener las comisiones detalladas");
      const data = await response.json();
      setComisionesDetalladoData(data.data);
    } catch (err) {
      setErrorComisionesDetallado(err.message);
    } finally {
      setLoadingComisionesDetallado(false);
    }
  };

  // Manejar exportación a Excel
  const exportToExcel = (data, fileName) => {
    if (data.length === 0) return;

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      return false;
    }
  };

  // Manejar la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = comisionesDetalladoData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(comisionesDetalladoData.length / itemsPerPage);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {items}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  // Función para formatear fechas en el formato dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />
      <Container fluid className="p-4" style={{ marginLeft: "250px" }}>
        <Row>
          <Col>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">
                  <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
                  Selecciona un Proyecto
                </Card.Title>
                <Row className="align-items-end">
                  <Col md={6} lg={4}>
                    <Form.Group controlId="projectSelect">
                      <Form.Label>Proyecto</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        aria-label="Selecciona un proyecto"
                      >
                        <option value="">-- Selecciona un proyecto --</option>
                        {proyectos.map((proyecto) => (
                          <option key={proyecto.id} value={proyecto.id}>
                            {proyecto.nombreproyecto}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={2} className="mt-3 mt-lg-0">
                    <Button
                      onClick={handleFetchComisiones}
                      variant="primary"
                      disabled={!selectedProjectId || loadingComisiones}
                      className="w-100"
                    >
                      {loadingComisiones ? "Cargando..." : "Obtener Comisiones"}
                    </Button>
                  </Col>
                  <Col md={6} lg={2} className="mt-3 mt-lg-0">
                    <Button
                      onClick={handleFetchComisionesDetallado}
                      variant="secondary"
                      disabled={loadingComisionesDetallado}
                      className="w-100"
                    >
                      {loadingComisionesDetallado ? "Cargando..." : "Obtener Comisiones Detallado"}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mensajes de Error y Éxito */}
        {(errorProyectos || errorComisiones || errorComisionesDetallado) && (
          <Alert variant="danger">Error: {errorProyectos || errorComisiones || errorComisionesDetallado}</Alert>
        )}
        {exportSuccess && (
          <Alert variant="success">
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Datos de comisiones exportados a Excel exitosamente.
          </Alert>
        )}
        {exportSuccessComisionesDetallado && (
          <Alert variant="success">
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Datos de comisiones detalladas exportados a Excel exitosamente.
          </Alert>
        )}

        {/* Tabla de Comisiones */}
        {comisionesData.length > 0 && (
          <DataCard
            title="Comisiones"
            data={comisionesData}
            columns={[
              { key: "username_creador", label: "Usuario" },
              { key: "total_suma", label: "Com. por Dormitorios" },
              { key: "comporc", label: "Com. Porcentaje Pagado" },
              { key: "comdesc", label: "Com. por Descuento Realizado" },
              { key: "total", label: "Total" },
            ]}
            onExport={() => {
              if (exportToExcel(comisionesData, "comisiones")) {
                setExportSuccess(true);
              }
            }}
          />
        )}

        {/* Tabla de Comisiones Detallado */}
        {comisionesDetalladoData.length > 0 && (
          <DataCard
            title="Comisiones Detallado"
            data={currentItems}
            columns={[
              { key: "fecseparacion", label: "Fecha Separación", format: formatDate },
              { key: "username_creador", label: "Usuario Creador" },
              { key: "nombres", label: "Nombre Cliente" },
              { key: "codigo_unidad", label: "Código Unidad" },
              { key: "precio_base_proforma", label: "Precio Base Proforma" },
              { key: "total_pagado", label: "Total Pagado" },
              { key: "dormitorios", label: "Dormitorios" },
              { key: "desc_m2", label: "Descuento m2" },
              { key: "porcent_pagado", label: "Porcentaje Pagado" },
            ]}
            onExport={() => {
              if (exportToExcel(comisionesDetalladoData, "comisiones_detallado")) {
                setExportSuccessComisionesDetallado(true);
              }
            }}
          />
        )}
        {totalPages > 1 && renderPagination()}
      </Container>
    </div>
  );
};

// Subcomponente para mostrar los datos y manejar la exportación
const DataCard = ({ title, data, columns, onExport }) => (
  <Row className="mb-4">
    <Col>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            {title}
          </h5>
          <Badge bg="light" text="dark">
            {data.length} Registros
          </Badge>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {column.format ? column.format(row[column.key]) : row[column.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Exportar a Excel</Tooltip>}
            >
              <Button variant="success" onClick={onExport}>
                <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                Exportar
              </Button>
            </OverlayTrigger>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default Comisiones;
