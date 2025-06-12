import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Badge, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, ButtonGroup
} from "reactstrap";
import { obtenerClientesReduccionIMC } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesReduccionIMC = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [mesesSeleccionados, setMesesSeleccionados] = useState(3);
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  useEffect(() => {
    cargarClientes(mesesSeleccionados);
  }, [mesesSeleccionados]);

  const cargarClientes = async (meses) => {
    setLoading(true);
    try {
      const data = await obtenerClientesReduccionIMC(meses);
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

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Función para exportar a Excel
  const exportToExcel = () => {
    const datosFormateados = filteredClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "IMC Inicial": cliente.imcInicial.toFixed(1),
      "IMC Actual": cliente.imcActual.toFixed(1),
      "Diferencia": cliente.diferencia.toFixed(1),
      "Porcentaje de Cambio": `${cliente.porcentajeCambio.toFixed(1)}%`
    }));
    
    const allData = [
      [`Reporte de Clientes con Reducción de IMC (Últimos ${mesesSeleccionados} meses) - ${new Date().toLocaleDateString()}`],
      [],
      ['ID', 'Nombre Completo', 'IMC Inicial', 'IMC Actual', 'Diferencia', 'Porcentaje de Cambio'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["IMC Inicial"],
        item["IMC Actual"],
        item["Diferencia"],
        item["Porcentaje de Cambio"]
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 12 },  // IMC Inicial
      { wch: 12 },  // IMC Actual
      { wch: 12 },  // Diferencia
      { wch: 18 }   // Porcentaje
    ];
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 5} }];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reducción IMC");
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(data, `Reduccion_IMC_${mesesSeleccionados}_meses_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                    <h3 className="mb-0">Clientes con Reducción de IMC</h3>
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
                    <Col md="7">
                      <ButtonGroup size="sm">
                        <Button 
                          color={mesesSeleccionados === 3 ? "primary" : "secondary"} 
                          onClick={() => setMesesSeleccionados(3)}
                          outline={mesesSeleccionados !== 3}
                        >
                          Últimos 3 meses
                        </Button>
                        <Button 
                          color={mesesSeleccionados === 6 ? "primary" : "secondary"} 
                          onClick={() => setMesesSeleccionados(6)}
                          outline={mesesSeleccionados !== 6}
                        >
                          Últimos 6 meses
                        </Button>
                        <Button 
                          color={mesesSeleccionados === 12 ? "primary" : "secondary"} 
                          onClick={() => setMesesSeleccionados(12)}
                          outline={mesesSeleccionados !== 12}
                        >
                          Último año
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col md="5">
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
                              <th>IMC Inicial</th>
                              <th>IMC Actual</th>
                              <th>Diferencia</th>
                              <th>% Cambio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center">
                                  No se encontraron clientes con reducción de IMC en los últimos {mesesSeleccionados} meses
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => (
                                <tr key={cliente.clienteId}>
                                  <td>{cliente.clienteId}</td>
                                  <td>{cliente.nombreCompleto}</td>
                                  <td>{cliente.imcInicial.toFixed(1)}</td>
                                  <td>{cliente.imcActual.toFixed(1)}</td>
                                  <td>
                                    <Badge color="success">
                                      {cliente.diferencia.toFixed(1)}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color="success">
                                      {cliente.porcentajeCambio.toFixed(1)}%
                                    </Badge>
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

export default ClientesReduccionIMC;