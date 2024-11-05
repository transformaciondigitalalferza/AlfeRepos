import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import './styles/tablas.css'; 
import './styles/grid.css';

function Objectives() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15;
  const id = localStorage.getItem('userId'); 

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/user/${id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    if (id) {
      fetchTasks();
    } else {
      console.error('No se encontró el id del usuario.');
    }
  }, [id]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    if (indexOfLastTask < tasks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setShowEvidenceModal(true);
  };

  const handleCloseEvidenceModal = () => {
    setShowEvidenceModal(false);
    setSelectedEvidence(null);
  };

  const handleUploadEvidence = (taskId) => {
    setSelectedTaskId(taskId);
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedTaskId(null);
  };

  const handleSubmitEvidence = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('taskId', selectedTaskId);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-evidence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Evidencia subida:', response.data);
      const updatedTasks = await axios.get(`http://localhost:8000/api/tasks/user/${id}`);
      setTasks(updatedTasks.data);
    } catch (error) {
      console.error('Error al subir la evidencia:', error);
    } finally {
      handleCloseUploadModal();
    }
  };

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar />
      </div>
      
      <div className="content flex-grow-1">
        <Container fluid className="mt-4 ms-3">
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Área</th>
                <th>Nombre Usuario</th>
                <th>Descripción</th>
                <th>Evidencia</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.Fecha}</td>
                    <td>{task.nombres}</td>
                    <td>{task.name}</td>
                    <td>{task.descripcion}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewEvidence(task.evidencia)}
                        disabled={!task.evidencia}
                      >
                        Ver Evidencia
                      </Button>{' '}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUploadEvidence(task.id)}
                      >
                        Subir/Actualizar
                      </Button>
                    </td>
                    <td>{task.fechainicio}</td>
                    <td>{task.fechafin}</td>
                    <td>{task.estado_descripcion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No se encontraron tareas.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between mb-4">
            <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </Button>
            <Button variant="secondary" onClick={handleNextPage} disabled={indexOfLastTask >= tasks.length}>
              Siguiente
            </Button>
          </div>
        </Container>

        <Modal show={showEvidenceModal} onHide={handleCloseEvidenceModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ver Evidencia</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvidence ? (
              <div>
                {selectedEvidence.endsWith('.jpg') ||
                selectedEvidence.endsWith('.jpeg') ||
                selectedEvidence.endsWith('.png') ||
                selectedEvidence.endsWith('.gif') ? (
                  <img
                    src={selectedEvidence}
                    alt="Evidencia"
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  selectedEvidence.endsWith('.pdf') ? (
                    <iframe
                      src={selectedEvidence}
                      title="Evidencia"
                      width="100%"
                      height="500px"
                    ></iframe>
                  ) : (
                    <a href={selectedEvidence} target="_blank" rel="noopener noreferrer">
                      Descargar Evidencia
                    </a>
                  )
                )}
              </div>
            ) : (
              <p>No hay evidencia disponible.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEvidenceModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
          <Modal.Header closeButton>
            <Modal.Title>Subir/Actualizar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitEvidence}>
              <div className="mb-3">
                <label htmlFor="evidenciaFile" className="form-label">
                  Selecciona un archivo para subir:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="evidenciaFile"
                  name="evidencia"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                  required
                />
              </div>
              <Button variant="primary" type="submit">
                Subir Evidencia
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Objectives;
