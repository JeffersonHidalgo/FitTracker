import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Badge, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Progress
} from "reactstrap";
import { obtenerClientesGananciaFuerza } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesGananciaFuerza = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientesGananciaFuerza();
        setClientes(data || []);
      } catch (error) {
        setAlert({
          isOpen: true,
          color: "danger",
          message: "Error al cargar el reporte. Intente nuevamente."
        });
      } finally {
        setLoading(false);
      }
    };
    cargarClientes();
  }, []);

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase())
  );

  // Ordenar por mayor mejora (porcentaje)
  const sortedClientes = [...filteredClientes].sort((a, b) => b.porcentajeIncremento - a.porcentajeIncremento);

  // Paginación
  const totalPages = Math.ceil(sortedClientes.length / PAGE_SIZE);
  const paginatedClientes = sortedClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Función para exportar a Excel
  const exportToExcel = () => {
    const datosFormateados = sortedClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "RM Inicial (kg)": cliente.rmInicial,
      "RM Actual (kg)": cliente.rmActual,
      "Diferencia (kg)": cliente.diferencia,
      "Porcentaje de Incremento": `${cliente.porcentajeIncremento.toFixed(1)}%`
    }));
    
    const allData = [
      [`Reporte de Clientes con Ganancia de Fuerza - ${new Date().toLocaleDateString()}`],
      [],
      ['ID', 'Nombre Completo', 'RM Inicial (kg)', 'RM Actual (kg)', 'Diferencia (kg)', 'Porcentaje de Incremento'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["RM Inicial (kg)"],
        item["RM Actual (kg)"],
        item["Diferencia (kg)"],
        item["Porcentaje de Incremento"]
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // RM Inicial
      { wch: 15 },  // RM Actual
      { wch: 15 },  // Diferencia
      { wch: 20 }   // Porcentaje
    ];
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 5} }];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ganancia Fuerza");
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(data, `Ganancia_Fuerza_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <CustomAlert
          isOpen={alert.isOpen}
          color={alert.color}
          message={alert.message}
          toggle={() => setAlert({ ...alert, isOpen: false })}
        />
        <Container className="mt--6" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Clientes con Ganancia de Fuerza</h3>
                    <Button 
                      size="sm"
                      color="primary"
                      onClick={exportToExcel}
                      disabled={loading || filteredClientes.length === 0}
                    >
                      <i className="fas fa-file-excel mr-2"></i> Exportar a Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col md="6">
                      <FormGroup className="mb-0">
                        <Input
                          placeholder="Buscar por nombre..."
                          value={filtro}
                          onChange={e => {
                            setFiltro(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" className="d-flex justify-content-end align-items-center">
                      <div className="text-muted">
                        {filteredClientes.length} clientes con mejora en fuerza máxima (RM)
                      </div>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Completo</th>
                              <th>RM Inicial (kg)</th>
                              <th>RM Actual (kg)</th>
                              <th>Diferencia</th>
                              <th>% Incremento</th>
                              <th>Progreso</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No se encontraron clientes con ganancia de fuerza
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => (
                                <tr key={cliente.clienteId}>
                                  <td>{cliente.clienteId}</td>
                                  <td>{cliente.nombreCompleto}</td>
                                  <td>{cliente.rmInicial} kg</td>
                                  <td>{cliente.rmActual} kg</td>
                                  <td>
                                    <Badge color="success">
                                      +{cliente.diferencia} kg
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color="success">
                                      +{cliente.porcentajeIncremento.toFixed(1)}%
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="mr-2">{cliente.porcentajeIncremento.toFixed(1)}%</span>
                                      <div style={{ width: "100px" }}>
                                        <Progress
                                          max="100"
                                          value={Math.min(cliente.porcentajeIncremento, 100)}
                                          color="success"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                          <Pagination size="sm">
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink first onClick={() => setCurrentPage(1)} />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
                            </PaginationItem>
                            
                            {[...Array(totalPages)].map((_, i) => {
                              if (
                                i === 0 || 
                                i === totalPages - 1 || 
                                (i >= currentPage - 2 && i <= currentPage + 2)
                              ) {
                                return (
                                  <PaginationItem active={i + 1 === currentPage} key={i}>
                                    <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                                      {i + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                              if (i === currentPage - 3 || i === currentPage + 3) {
                                return <PaginationItem disabled key={`ellipsis-${i}`}><PaginationLink>...</PaginationLink></PaginationItem>;
                              }
                              return null;
                            })}
                            
                            <PaginationItem disabled={currentPage === totalPages}>
                              <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage === totalPages}>
                              <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
                            </PaginationItem>
                          </Pagination>
                        </div>
                      )}
                    </>
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

export default ClientesGananciaFuerza;