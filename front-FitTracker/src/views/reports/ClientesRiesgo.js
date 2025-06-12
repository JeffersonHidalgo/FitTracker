import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Badge, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Alert
} from "reactstrap";
import { obtenerClientesRiesgo } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesRiesgo = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const PAGE_SIZE = 10;

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientesRiesgo();
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

  // Filtrar clientes por búsqueda
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
    // Transformar datos
    const datosFormateados = filteredClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "Edad": cliente.edad,
      "IMC": cliente.imc.toFixed(1),
      "FC Reposo": cliente.fcReposo,
      "Test Cooper (m)": cliente.testCooper
    }));
    
    // Crear todos los datos juntos
    const allData = [
      // Fila 1: Título
      [`Reporte de Clientes en Situación de Riesgo - ${new Date().toLocaleDateString()}`],
      [],
      ['ID', 'Nombre Completo', 'Edad', 'IMC', 'FC Reposo', 'Test Cooper (m)'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["Edad"],
        item["IMC"],
        item["FC Reposo"],
        item["Test Cooper (m)"]
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 10 },  // Edad
      { wch: 10 },  // IMC
      { wch: 12 },  // FC Reposo
      { wch: 15 }   // Test Cooper
    ];
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 5} }];
    
    // Crear libro y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes en Riesgo");
    
    // Generar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Descargar
    saveAs(data, `Clientes_Riesgo_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Determinar nivel de riesgo
  const calcularNivelRiesgo = (cliente) => {
    let factoresRiesgo = 0;
    let descripcion = [];
    
    if (cliente.imc >= 30) {
      factoresRiesgo++;
      descripcion.push("Obesidad");
    }
    
    if (cliente.fcReposo > 80) {
      factoresRiesgo++;
      descripcion.push("FC reposo elevada");
    }
    
    if (cliente.testCooper < 1500) {
      factoresRiesgo++;
      descripcion.push("Baja capacidad aeróbica");
    }
    
    if (cliente.edad > 50) {
      factoresRiesgo++;
      descripcion.push("Mayor de 50 años");
    }
    
    let nivel = "success";
    if (factoresRiesgo >= 3) nivel = "danger";
    else if (factoresRiesgo === 2) nivel = "warning";
    
    return { nivel, factoresRiesgo, descripcion };
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
                    <h3 className="mb-0">Clientes en Situación de Riesgo</h3>
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
                  {showInfoBanner && (
                    <Alert color="info" className="mb-4" toggle={() => setShowInfoBanner(false)}>
                      <div className="d-flex align-items-center">
                        <i className="ni ni-notification-70 mr-3" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                          <h4 className="alert-heading mb-1">Criterios de riesgo</h4>
                          <p className="mb-0">
                            Este reporte identifica clientes con múltiples factores de riesgo: IMC ≥ 30 (obesidad),
                            frecuencia cardíaca en reposo &gt; 80, Test Cooper &lt; 1500m o edad &gt; 50 años.
                          </p>
                        </div>
                      </div>
                    </Alert>
                  )}
                
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
                      <div className="text-right">
                        <Badge color="success" className="mr-2">● Bajo riesgo</Badge>
                        <Badge color="warning" className="mr-2">● Riesgo moderado</Badge>
                        <Badge color="danger">● Alto riesgo</Badge>
                      </div>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          Mostrando {filteredClientes.length} clientes en situación de riesgo
                        </h6>
                      </div>
                      
                      {/* Tabla de clientes */}
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Completo</th>
                              <th>Edad</th>
                              <th>IMC</th>
                              <th>FC Reposo</th>
                              <th>Test Cooper</th>
                              <th>Nivel de Riesgo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No se encontraron clientes en situación de riesgo
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => {
                                const { nivel, descripcion } = calcularNivelRiesgo(cliente);
                                return (
                                  <tr key={cliente.clienteId}>
                                    <td>{cliente.clienteId}</td>
                                    <td>{cliente.nombreCompleto}</td>
                                    <td>{cliente.edad}</td>
                                    <td>
                                      <Badge color={cliente.imc >= 30 ? "danger" : "primary"}>
                                        {cliente.imc.toFixed(1)}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Badge color={cliente.fcReposo > 80 ? "danger" : "primary"}>
                                        {cliente.fcReposo}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Badge color={cliente.testCooper < 1500 ? "danger" : "primary"}>
                                        {cliente.testCooper}m
                                      </Badge>
                                    </td>
                                    <td>
                                      <Badge color={nivel} className="mr-1">{descripcion.length} factores</Badge>
                                      <div style={{ fontSize: '0.8rem', marginTop: '3px' }}>
                                        {descripcion.join(", ")}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Paginación */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                          <Pagination size="sm">
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink first onClick={() => setCurrentPage(1)} />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
                            </PaginationItem>
                            
                            {/* Mostrar solo 5 páginas alrededor de la actual */}
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

export default ClientesRiesgo;