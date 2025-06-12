import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, ButtonGroup, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Badge
} from "reactstrap";
import { obtenerClientesSinActividad } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesSinActividad = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState(30);
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  useEffect(() => {
    cargarClientes(diasSeleccionados);
  }, [diasSeleccionados]);

  const cargarClientes = async (dias) => {
    setLoading(true);
    try {
      const data = await obtenerClientesSinActividad(dias);
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

  // Filtrar clientes por búsqueda
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.emailPrincipal?.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.telefonoPrincipal?.includes(filtro)
  );

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Determinar cuánto tiempo sin actividad
  const calcularTiempoSinActividad = (ultimaMetrica) => {
    if (!ultimaMetrica) return { text: "Sin registro", class: "danger" };
    
    const fecha = new Date(ultimaMetrica);
    const hoy = new Date();
    const diasDiferencia = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
    
    if (diasDiferencia > 90) return { text: `${diasDiferencia} días`, class: "danger" };
    if (diasDiferencia > 30) return { text: `${diasDiferencia} días`, class: "warning" };
    return { text: `${diasDiferencia} días`, class: "info" };
  };

  // Función mejorada para exportar a Excel
  const exportToExcel = () => {
    // Transformar datos
    const datosFormateados = filteredClientes.map(cliente => {
      const inactividad = calcularTiempoSinActividad(cliente.ultimaMetrica);
      return {
        ID: cliente.clienteId,
        "Nombre Completo": cliente.nombreCompleto,
        "Última Métrica": cliente.ultimaMetrica 
          ? new Date(cliente.ultimaMetrica).toLocaleDateString()
          : "Sin registro",
        "Tiempo sin Actividad": inactividad.text,
        "Correo Electrónico": cliente.emailPrincipal || "No disponible",
        "Teléfono": cliente.telefonoPrincipal || "No disponible"
      };
    });
    
    // Crear todos los datos juntos, incluyendo título y encabezados
    const allData = [
      // Fila 1: Título
      [`Reporte de Clientes Sin Actividad (${diasSeleccionados} días) - ${new Date().toLocaleDateString()}`],
      
      // Fila 2: Encabezados
      ['ID', 'Nombre Completo', 'Última Métrica', 'Tiempo sin Actividad', 'Correo Electrónico', 'Teléfono'],
      
      // Filas 3+: Datos
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["Última Métrica"],
        item["Tiempo sin Actividad"],
        item["Correo Electrónico"],
        item["Teléfono"]
      ])
    ];
    
    // Crear una hoja con todos los datos
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    // Definir anchos de columna
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // Última Métrica
      { wch: 18 },  // Tiempo sin Actividad
      { wch: 30 },  // Email
      { wch: 15 }   // Teléfono
    ];
    
    // Combinar celdas para el título
    worksheet['!merges'] = [
      // Combinar A1:F1 para el título
      { s: {r: 0, c: 0}, e: {r: 0, c: 5} }
    ];
    
    // Crear libro y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes Sin Actividad");
    
    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array'
    });
    
    // Crear blob y descargar
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Descargar archivo
    saveAs(data, `Clientes_Sin_Actividad_${diasSeleccionados}_dias_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                    <h3 className="mb-0">Reporte de Clientes Sin Actividad Reciente</h3>
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
                          color={diasSeleccionados === 30 ? "primary" : "secondary"} 
                          onClick={() => setDiasSeleccionados(30)}
                          outline={diasSeleccionados !== 30}
                        >
                          30 días
                        </Button>
                        <Button 
                          color={diasSeleccionados === 60 ? "primary" : "secondary"} 
                          onClick={() => setDiasSeleccionados(60)}
                          outline={diasSeleccionados !== 60}
                        >
                          60 días
                        </Button>
                        <Button 
                          color={diasSeleccionados === 90 ? "primary" : "secondary"} 
                          onClick={() => setDiasSeleccionados(90)}
                          outline={diasSeleccionados !== 90}
                        >
                          90 días
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col md="5">
                      <FormGroup className="mb-0">
                        <Input
                          placeholder="Buscar por nombre, correo o teléfono..."
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
                      {/* Envolver la tabla en un div con altura máxima y scroll */}
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Completo</th>
                              <th>Última Métrica</th>
                              <th>Tiempo sin Actividad</th>
                              <th>Email</th>
                              <th>Teléfono</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center">
                                  No se encontraron clientes sin actividad en los últimos {diasSeleccionados} días
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => {
                                const inactividad = calcularTiempoSinActividad(cliente.ultimaMetrica);
                                return (
                                  <tr key={cliente.clienteId}>
                                    <td>{cliente.clienteId}</td>
                                    <td>{cliente.nombreCompleto}</td>
                                    <td>
                                      {cliente.ultimaMetrica 
                                        ? new Date(cliente.ultimaMetrica).toLocaleDateString()
                                        : "Sin registro"}
                                    </td>
                                    <td>
                                      <Badge color={inactividad.class}>
                                        {inactividad.text}
                                      </Badge>
                                    </td>
                                    <td>{cliente.emailPrincipal || '-'}</td>
                                    <td>{cliente.telefonoPrincipal || '-'}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Limitar número de páginas visibles en la paginación */}
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
                              // Solo mostrar páginas cercanas a la actual
                              if (
                                i === 0 || // Primera página
                                i === totalPages - 1 || // Última página
                                (i >= currentPage - 2 && i <= currentPage + 2) // 2 antes y 2 después de la actual
                              ) {
                                return (
                                  <PaginationItem active={i + 1 === currentPage} key={i}>
                                    <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                                      {i + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                              // Mostrar ... si hay saltos
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

export default ClientesSinActividad;