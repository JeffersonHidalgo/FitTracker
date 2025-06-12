import React, { useEffect, useState } from "react";
import {
  obtenerRecomendaciones,
  obtenerDetalleRecomendacion,
  crearRecomendacion,
  actualizarRecomendacion,
} from "../services/recomendacionService";
import RecomendacionForm from "./RecomendacionForm";
import { Button, Table, Card, CardBody, Container, Row, Col, Pagination, PaginationItem, PaginationLink, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import Header from "components/Headers/Header";
import CustomAlert from "components/CustomAlert";
import Loading from "components/Loading";

const PAGE_SIZE = 10;

const RecomendacionAdmin = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formInitialData, setFormInitialData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });

  const listarRecomendaciones = async () => {
    setLoading(true);
    try {
      const data = await obtenerRecomendaciones();
      setRecomendaciones(data || []);
      setCurrentPage(1); // Reinicia a la primera página al recargar
    } catch (error) {
      setAlert({
        isOpen: true,
        color: "danger",
        message: "Error al cargar recomendaciones.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    listarRecomendaciones();
  }, []);

  const handleCrear = () => {
    setFormMode("create");
    setFormInitialData(null);
    setShowForm(true);
  };

  const handleEditar = async (id) => {
    setLoading(true);
    try {
      const data = await obtenerDetalleRecomendacion(id);
      setFormMode("edit");
      setFormInitialData(data);
      setShowForm(true);
    } catch (error) {
      setAlert({
        isOpen: true,
        color: "danger",
        message: "Error al obtener la recomendación.",
      });
    }
    setLoading(false);
  };

  const handleDesactivar = async (rec) => {
    setLoading(true);
    try {
      await actualizarRecomendacion({ ...rec, activo: false });
      setAlert({
        isOpen: true,
        color: "success",
        message: "Recomendación desactivada.",
      });
      listarRecomendaciones();
    } catch (error) {
      setAlert({
        isOpen: true,
        color: "danger",
        message: "Error al desactivar la recomendación.",
      });
    }
    setLoading(false);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (formMode === "create") {
        await crearRecomendacion(values);
        setAlert({
          isOpen: true,
          color: "success",
          message: "Recomendación creada correctamente.",
        });
      } else {
        await actualizarRecomendacion(values);
        setAlert({
          isOpen: true,
          color: "success",
          message: "Recomendación actualizada correctamente.",
        });
      }
      setShowForm(false);
      listarRecomendaciones();
    } catch (error) {
      setAlert({
        isOpen: true,
        color: "danger",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Ocurrió un error al guardar la recomendación.",
      });
    }
    setLoading(false);
  };

  // Filtrado por búsqueda
  const filteredRecomendaciones = recomendaciones.filter((rec) => {
    const term = search.toLowerCase();
    return (
      rec.seccion?.toLowerCase().includes(term) ||
      rec.condicion?.toLowerCase().includes(term) ||
      rec.recomendacion?.toLowerCase().includes(term)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredRecomendaciones.length / PAGE_SIZE);
  const paginatedData = filteredRecomendaciones.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reiniciar a la primera página si cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      <Header />
      <Loading show={loading} />
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert((a) => ({ ...a, isOpen: false }))}
      />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="12" lg="12">
              <Card className="shadow">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0" style={{ color: "#4A628A" }}>
                      Mantenimiento de Recomendaciones
                    </h3>
                    <Button color="primary" onClick={handleCrear}>
                      Crear nueva recomendación
                    </Button>
                  </div>
                  {/* Buscador mejorado */}
                  <Row className="mb-4">
                    <Col md="6" lg="5" xl="4">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText style={{ background: "#f6f9fc" }}>
                            <i className="fa fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Buscar por sección, condición o recomendación..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          style={{
                            borderLeft: "none",
                            background: "#f6f9fc",
                            borderRadius: "0 0.375rem 0.375rem 0"
                          }}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  {/* Fin buscador mejorado */}
                  <Table striped bordered responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Sección</th>
                        <th>Condición</th>
                        <th>Recomendación</th>
                        <th>Activo</th>
                        <th>FechaCreación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((rec) => (
                        <tr key={rec.id}>
                          <td>{rec.id}</td>
                          <td>{rec.seccion}</td>
                          <td>{rec.condicion}</td>
                          <td>{rec.recomendacion}</td>
                          <td>{rec.activo ? "Sí" : "No"}</td>
                          <td>
                            {rec.fechaCrea
                              ? rec.fechaCrea.substring(0, 10)
                              : ""}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              color="info"
                              onClick={() => handleEditar(rec.id)}
                            >
                              Editar
                            </Button>{" "}
                            {rec.activo && (
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => handleDesactivar(rec)}
                              >
                                Desactivar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/* Paginación */}
                  {totalPages > 1 && (
                    <Pagination className="justify-content-center">
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink first onClick={() => goToPage(1)} />
                      </PaginationItem>
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink previous onClick={() => goToPage(currentPage - 1)} />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem active={currentPage === i + 1} key={i}>
                          <PaginationLink onClick={() => goToPage(i + 1)}>
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink next onClick={() => goToPage(currentPage + 1)} />
                      </PaginationItem>
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink last onClick={() => goToPage(totalPages)} />
                      </PaginationItem>
                    </Pagination>
                  )}
                  {showForm && (
                    <RecomendacionForm
                      mode={formMode}
                      initialData={formInitialData}
                      onSubmit={handleFormSubmit}
                      onCancel={() => setShowForm(false)}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RecomendacionAdmin;