import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Badge, Progress
} from "reactstrap";
import { obtenerClientesProgresoAerobico } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesProgresoAerobico = () => {
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
        const data = await obtenerClientesProgresoAerobico();
        
        // Normalizar los datos mapeando correctamente los nombres de propiedades
        const datosNormalizados = (data || []).map(cliente => ({
          clienteId: cliente.clienteId,
          nombreCompleto: cliente.nombreCompleto,
          // Mapear los nombres de propiedades correctamente
          testInicial: cliente.testCooperInicial || 0,
          testActual: cliente.testCooperActual || 0,
          diferencia: cliente.diferencia || 0,
          porcentajeCambio: cliente.porcentajeMejora || 0
        }));
        
        setClientes(datosNormalizados);
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

  // Filtrar clientes por búsqueda
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase())
  );

  // Ordenar por mayor mejora (porcentaje)
  const sortedClientes = [...filteredClientes].sort((a, b) => b.porcentajeCambio - a.porcentajeCambio);

  // Paginación
  const totalPages = Math.ceil(sortedClientes.length / PAGE_SIZE);
  const paginatedClientes = sortedClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Función para exportar a Excel
  const exportToExcel = () => {
    // Transformar datos
    const datosFormateados = sortedClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "Test Inicial (m)": cliente.testInicial || 0,
      "Test Actual (m)": cliente.testActual || 0,
      "Diferencia (m)": cliente.diferencia || 0,
      "Porcentaje de Cambio": `${cliente.porcentajeCambio ? cliente.porcentajeCambio.toFixed(1) : '0.0'}%`
    }));
    
    // Crear todos los datos juntos
    const allData = [
      // Fila 1: Título
      [`Reporte de Progreso Aeróbico de Clientes - ${new Date().toLocaleDateString()}`],
      [],
      ['ID', 'Nombre Completo', 'Test Inicial (m)', 'Test Actual (m)', 'Diferencia (m)', 'Porcentaje de Cambio'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["Test Inicial (m)"],
        item["Test Actual (m)"],
        item["Diferencia (m)"],
        item["Porcentaje de Cambio"]
      ])
    ];
    
    // Crear una hoja con todos los datos
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    // Definir anchos de columna
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // Test Inicial
      { wch: 15 },  // Test Actual
      { wch: 15 },  // Diferencia
      { wch: 20 }   // Porcentaje
    ];
    
    // Combinar celdas para el título
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 5} }];
    
    // Crear libro y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Progreso Aerobico");
    
    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Descargar archivo
    saveAs(data, `Progreso_Aerobico_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                    <h3 className="mb-0">Progreso Aeróbico de Clientes</h3>
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
                        {filteredClientes.length} clientes con mejora en capacidad aeróbica
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
                              <th>Test Inicial (m)</th>
                              <th>Test Actual (m)</th>
                              <th>Diferencia</th>
                              <th>% Mejora</th>
                              <th>Progreso</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No se encontraron clientes con progreso aeróbico
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => (
                                <tr key={cliente.clienteId}>
                                  <td>{cliente.clienteId}</td>
                                  <td>{cliente.nombreCompleto}</td>
                                  <td>{cliente.testInicial || 0} m</td>
                                  <td>{cliente.testActual || 0} m</td>
                                  <td>
                                    <Badge color="info">
                                      +{cliente.diferencia || 0} m
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color="info">
                                      +{cliente.porcentajeCambio ? cliente.porcentajeCambio.toFixed(1) : '0.0'}%
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="mr-2">{cliente.porcentajeCambio ? cliente.porcentajeCambio.toFixed(1) : '0.0'}%</span>
                                      <div style={{ width: "100px" }}>
                                        <Progress
                                          max="100"
                                          value={Math.min(cliente.porcentajeCambio, 100)}
                                          color="info"
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

export default ClientesProgresoAerobico;