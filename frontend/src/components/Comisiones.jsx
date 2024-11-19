import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Form, Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/comisiones.css";
import Sidebar from "./Sidebar";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faDownload } from '@fortawesome/free-solid-svg-icons'; 

const Comisiones = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [errorProyectos, setErrorProyectos] = useState(null);
  
  const [selectedProjectId, setSelectedProjectId] = useState("");
  
  const [comisionesData, setComisionesData] = useState([]);
  const [loadingComisiones, setLoadingComisiones] = useState(false);
  const [errorComisiones, setErrorComisiones] = useState(null);
  
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch("http://192.168.2.47:8000/api/proyectos");
        if (!response.ok) {
          throw new Error("Error al obtener los proyectos");
        }
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
      if (!response.ok) {
        throw new Error("Error al obtener los datos de comisiones");
      }
      const data = await response.json();
      setComisionesData(data.data);
    } catch (err) {
      setErrorComisiones(err.message);
    } finally {
      setLoadingComisiones(false);
    }
  };

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
    setComisionesData([]);
    setErrorComisiones(null);
    setExportSuccess(false);
  };

  const exportToExcel = () => {
    if (comisionesData.length === 0) return;

    setExporting(true);
    setExportSuccess(false);

    try {
      const exportData = comisionesData.map((row) => ({
        Usuario: row.username_creador,
        "Com. por Dormitorios": row.total_suma,
        "Com. Porcentaje Pagado": row.comporc,
        "Com. por Descuento Realizado": row.comdesc,
        Total: Number(row.total_suma) + Number(row.comporc) + Number(row.comdesc)
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Comisiones");
      XLSX.writeFile(workbook, "comisiones.xlsx");

      setExportSuccess(true);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      setErrorComisiones("Error al exportar a Excel.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Container fluid className="d-flex">
      <Sidebar />
      <Container fluid className="p-4">
        <Row>
          <Col>
            <h2 className="mb-4">Selecciona un Proyecto</h2>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} lg={4}>
            <Form.Group controlId="projectSelect">
              <Form.Label>Proyecto</Form.Label>
              <Form.Control
                as="select"
                value={selectedProjectId}
                onChange={handleProjectSelect}
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
          <Col md={6} lg={2} className="d-flex align-items-end">
            <Button
              onClick={handleFetchComisiones}
              variant="primary"
              disabled={!selectedProjectId || loadingComisiones}
              className="w-100"
            >
              {loadingComisiones ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Cargando...
                </>
              ) : (
                "Obtener Comisiones"
              )}
            </Button>
          </Col>
        </Row>

        {errorProyectos && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger">Error: {errorProyectos}</Alert>
            </Col>
          </Row>
        )}

        {errorComisiones && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger">Error: {errorComisiones}</Alert>
            </Col>
          </Row>
        )}

        {exportSuccess && (
          <Row className="mb-3">
            <Col>
              <Alert variant="success">Datos exportados a Excel exitosamente.</Alert>
            </Col>
          </Row>
        )}

        {comisionesData.length > 0 && (
          <>
            <Row className="mb-3">
              <Col>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Usuario</th>
                        <th>Com. por Dormitorios</th>
                        <th>Com. Porcentaje Pagado</th>
                        <th>Com. por Descuento Realizado</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comisionesData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.username_creador}</td>
                          <td>{row.total_suma}</td>
                          <td>{row.comporc}</td>
                          <td>{row.comdesc}</td>
                          <td>
                            {Number(row.total_suma) + Number(row.comporc) + Number(row.comdesc)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>

            <Row>
              <Col className="text-end">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Exportar a Excel</Tooltip>}
                >
                  <Button
                    variant="success"
                    onClick={exportToExcel}
                    disabled={exporting}
                  >
                    {exporting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Exportando...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faFileExcel} /> Exportar
                      </>
                    )}
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
          </>
        )}

        {loadingProyectos && (
          <Row className="justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <Col className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando proyectos...</span>
              </Spinner>
              <div className="mt-3">Cargando proyectos...</div>
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default Comisiones;
