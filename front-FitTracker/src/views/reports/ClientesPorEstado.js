import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Badge, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, ButtonGroup
} from "reactstrap";
import { obtenerClientesPorEstado } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesPorEstado = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientesPorEstado();
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

  // Agregar esta función de transformación
  const formatearEstado = (estadoOriginal) => {
    if (estadoOriginal === "A") return "Activo";
    if (estadoOriginal === "I") return "Inactivo";
    return estadoOriginal; // Mantener el valor original si no es "A" o "I"
  };

  // Filtrar clientes por texto de búsqueda y estado
  const filteredClientes = clientes.filter(cliente => {
    // Filtro por texto
    const matchesText = 
      cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.emailPrincipal?.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.telefonoPrincipal?.includes(filtro);
    
    // Filtro por estado - convertir para comparar correctamente
    const matchesState = 
      estadoSeleccionado === "todos" || 
      (estadoSeleccionado === "Activo" && cliente.estado === "A") ||
      (estadoSeleccionado === "Inactivo" && cliente.estado === "I");
    
    return matchesText && matchesState;
  });

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Función corregida para exportar a Excel con formato
  const exportToExcel = () => {
    // Transformar datos
    const datosFormateados = filteredClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "Fecha de Inicio": new Date(cliente.fechaInicio).toLocaleDateString(),
      "Correo Electrónico": cliente.emailPrincipal || "No disponible",
      "Teléfono": cliente.telefonoPrincipal || "No disponible",
      "Estado": formatearEstado(cliente.estado)
    }));
    
    // Crear todos los datos juntos, incluyendo título y encabezados
    const allData = [
      // Fila 1: Título
      [`Reporte de Clientes por Estado - ${new Date().toLocaleDateString()}`],
      
      // Fila 2: Encabezados
      ['ID', 'Nombre Completo', 'Fecha de Inicio', 'Correo Electrónico', 'Teléfono', 'Estado'],
      
      // Filas 3+: Datos
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["Fecha de Inicio"],
        item["Correo Electrónico"],
        item["Teléfono"],
        item["Estado"]
      ])
    ];
    
    // Crear una hoja con todos los datos
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    // Definir anchos de columna
    worksheet['!cols'] = [
      { wch: 10 },  // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // Fecha
      { wch: 30 },  // Email
      { wch: 15 },  // Teléfono
      { wch: 15 }   // Estado
    ];
    
    // Combinar celdas para el título
    worksheet['!merges'] = [
      // Combinar A1:F1 para el título
      { s: {r: 0, c: 0}, e: {r: 0, c: 5} }
    ];
    
    // Crear libro y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes Por Estado");
    
    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array'
    });
    
    // Crear blob y descargar
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Nombre de archivo
    let nombreArchivo = 'Clientes_Por_Estado';
    if (estadoSeleccionado !== 'todos') {
      nombreArchivo += `_${estadoSeleccionado}s`;
    }
    nombreArchivo += `_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Descargar archivo
    saveAs(data, nombreArchivo);
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
                    <h3 className="mb-0">Reporte de Clientes por Estado</h3>
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
                          placeholder="Buscar por nombre, correo o teléfono..."
                          value={filtro}
                          onChange={e => {
                            setFiltro(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" className="d-flex justify-content-end align-items-center">
                      <label className="mr-2 mb-0">Filtrar por estado:</label>
                      <ButtonGroup size="sm">
                        <Button 
                          color={estadoSeleccionado === "todos" ? "primary" : "secondary"} 
                          onClick={() => {
                            setEstadoSeleccionado("todos");
                            setCurrentPage(1);
                          }}
                          outline={estadoSeleccionado !== "todos"}
                        >
                          Todos
                        </Button>
                        <Button 
                          color={estadoSeleccionado === "Activo" ? "success" : "secondary"}
                          onClick={() => {
                            setEstadoSeleccionado("Activo");
                            setCurrentPage(1);
                          }}
                          outline={estadoSeleccionado !== "Activo"}
                        >
                          Activos
                        </Button>
                        <Button 
                          color={estadoSeleccionado === "Inactivo" ? "danger" : "secondary"}
                          onClick={() => {
                            setEstadoSeleccionado("Inactivo");
                            setCurrentPage(1);
                          }}
                          outline={estadoSeleccionado !== "Inactivo"}
                        >
                          Inactivos
                        </Button>
                      </ButtonGroup>
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
                              <th>Fecha Inicio</th>
                              <th>Email</th>
                              <th>Teléfono</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center">
                                  No se encontraron clientes
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => (
                                <tr key={cliente.clienteId}>
                                  <td>{cliente.clienteId}</td>
                                  <td>{cliente.nombreCompleto}</td>
                                  <td>{new Date(cliente.fechaInicio).toLocaleDateString()}</td>
                                  <td>{cliente.emailPrincipal || '-'}</td>
                                  <td>{cliente.telefonoPrincipal || '-'}</td>
                                  <td>
                                    <Badge color={cliente.estado === "A" ? "success" : "danger"}>
                                      {formatearEstado(cliente.estado)}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
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

export default ClientesPorEstado;