import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, ButtonGroup, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Badge, Label
} from "reactstrap";
import { obtenerClientesNuevos } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";

const ClientesPorUbicacion = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("todas");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("todas");
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  // Usar un valor alto para obtener todos los clientes (10 años)
  const DIAS_CONSULTA = 3650;

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await obtenerClientesNuevos(DIAS_CONSULTA);
      setClientes(data || []);
      
      // Extraer provincias únicas
      const uniqueProvincias = [...new Set(data
        .filter(c => c.provincia)
        .map(c => c.provincia))].sort();
      setProvincias(uniqueProvincias);
      
      // Extraer ciudades únicas
      const uniqueCiudades = [...new Set(data
        .filter(c => c.ciudad)
        .map(c => c.ciudad))].sort();
      setCiudades(uniqueCiudades);
      
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

  // Filtrar clientes por ubicación y texto
  const filteredClientes = clientes.filter(cliente => {
    // Filtro por texto
    const matchesText = 
      cliente.nombreCompleto?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      cliente.ciudad?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      cliente.provincia?.toLowerCase().includes(filtroTexto.toLowerCase());
    
    // Filtro por provincia
    const matchesProvincia = 
      provinciaSeleccionada === "todas" || 
      cliente.provincia === provinciaSeleccionada;
    
    // Filtro por ciudad
    const matchesCiudad = 
      ciudadSeleccionada === "todas" || 
      cliente.ciudad === ciudadSeleccionada;
    
    return matchesText && matchesProvincia && matchesCiudad;
  });

  // Agrupación para estadísticas
  const estadisticasPorProvincia = provincias.map(provincia => {
    const clientesEnProvincia = clientes.filter(c => c.provincia === provincia);
    return {
      provincia,
      cantidad: clientesEnProvincia.length,
      porcentaje: ((clientesEnProvincia.length / clientes.length) * 100).toFixed(1)
    };
  }).sort((a, b) => b.cantidad - a.cantidad);

  // Agrupación para estadísticas por ciudad (limitado a las 5 principales)
  const estadisticasPorCiudad = ciudades.map(ciudad => {
    const clientesEnCiudad = clientes.filter(c => c.ciudad === ciudad);
    return {
      ciudad,
      cantidad: clientesEnCiudad.length,
      porcentaje: ((clientesEnCiudad.length / clientes.length) * 100).toFixed(1)
    };
  }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Función para exportar a Excel
  const exportToExcel = () => {
    // Transformar datos de clientes filtrados
    const datosFormateados = filteredClientes.map(cliente => ({
      ID: cliente.clienteId,
      "Nombre Completo": cliente.nombreCompleto,
      "Fecha de Registro": new Date(cliente.fechaRegistro).toLocaleDateString(),
      "Provincia": cliente.provincia || "No disponible",
      "Ciudad": cliente.ciudad || "No disponible"
    }));
    
    // Calcular estadísticas basadas solo en los clientes filtrados
    const provinciasEnFiltro = [...new Set(filteredClientes
      .filter(c => c.provincia)
      .map(c => c.provincia))].sort();
    
    const ciudadesEnFiltro = [...new Set(filteredClientes
      .filter(c => c.ciudad)
      .map(c => c.ciudad))].sort();
    
    // Estadísticas para provincias filtradas
    const estadisticasProvincias = provinciasEnFiltro.map(provincia => {
      const clientesEnProvincia = filteredClientes.filter(c => c.provincia === provincia);
      return [
        provincia,
        `${clientesEnProvincia.length} clientes`,
        `${((clientesEnProvincia.length / filteredClientes.length) * 100).toFixed(1)}%`
      ];
    }).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    
    // Estadísticas para ciudades filtradas
    const estadisticasCiudades = ciudadesEnFiltro.map(ciudad => {
      const clientesEnCiudad = filteredClientes.filter(c => c.ciudad === ciudad);
      return [
        ciudad,
        `${clientesEnCiudad.length} clientes`,
        `${((clientesEnCiudad.length / filteredClientes.length) * 100).toFixed(1)}%`
      ];
    }).sort((a, b) => parseInt(b[1]) - parseInt(a[1])).slice(0, 10);
    
    // Preparar título con información de filtros
    let tituloReporte = "Reporte de Clientes por Ubicación Geográfica";
    
    // Añadir información de filtros al título
    if (provinciaSeleccionada !== "todas") {
      tituloReporte += ` - Provincia: ${provinciaSeleccionada}`;
      if (ciudadSeleccionada !== "todas") {
        tituloReporte += `, Ciudad: ${ciudadSeleccionada}`;
      }
    } else if (ciudadSeleccionada !== "todas") {
      tituloReporte += ` - Ciudad: ${ciudadSeleccionada}`;
    }
    
    if (filtroTexto) {
      tituloReporte += ` - Búsqueda: "${filtroTexto}"`;
    }
    
    tituloReporte += ` - ${new Date().toLocaleDateString()}`;
    
    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Hoja 1: Datos detallados
    const allData = [
      [tituloReporte],
      [],
      ['ID', 'Nombre Completo', 'Fecha de Registro', 'Provincia', 'Ciudad'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["Fecha de Registro"],
        item["Provincia"],
        item["Ciudad"]
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // Fecha
      { wch: 20 },  // Provincia
      { wch: 20 }   // Ciudad
    ];
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 4} }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes por Ubicación");
    
    // Agregar mensaje si no hay datos
    if (filteredClientes.length === 0) {
      const noDataSheet = XLSX.utils.aoa_to_sheet([
        ["No se encontraron clientes con los filtros aplicados"],
        [],
        ["Filtros aplicados:"],
        ["Provincia:", provinciaSeleccionada === "todas" ? "Todas" : provinciaSeleccionada],
        ["Ciudad:", ciudadSeleccionada === "todas" ? "Todas" : ciudadSeleccionada],
        ["Texto de búsqueda:", filtroTexto || "Ninguno"]
      ]);
      XLSX.utils.book_append_sheet(workbook, noDataSheet, "Sin Resultados");
    } else {
      // Hoja 2: Estadísticas basadas en datos filtrados
      const estadisticasData = [
        ["Distribución de Clientes Filtrados por Ubicación"],
        [],
        ["Filtros aplicados:"],
        ["Provincia:", provinciaSeleccionada === "todas" ? "Todas" : provinciaSeleccionada],
        ["Ciudad:", ciudadSeleccionada === "todas" ? "Todas" : ciudadSeleccionada],
        ["Texto de búsqueda:", filtroTexto || "Ninguno"],
        [],
        ["Distribución por Provincia"],
        ["Provincia", "Cantidad", "Porcentaje"],
        ...(estadisticasProvincias.length > 0 ? estadisticasProvincias : [["Sin datos", "", ""]]),
        [],
        ["Principales Ciudades"],
        ["Ciudad", "Cantidad", "Porcentaje"],
        ...(estadisticasCiudades.length > 0 ? estadisticasCiudades : [["Sin datos", "", ""]])
      ];
      
      const estadisticasSheet = XLSX.utils.aoa_to_sheet(estadisticasData);
      estadisticasSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];
      estadisticasSheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 2} }];
      XLSX.utils.book_append_sheet(workbook, estadisticasSheet, "Estadísticas");
    }
    
    // Generar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Crear nombre de archivo que refleje los filtros
    let nombreArchivo = 'Clientes_Por_Ubicacion';
    if (provinciaSeleccionada !== "todas") {
      nombreArchivo += `_${provinciaSeleccionada.replace(/\s+/g, '_')}`;
    }
    if (ciudadSeleccionada !== "todas") {
      nombreArchivo += `_${ciudadSeleccionada.replace(/\s+/g, '_')}`;
    }
    nombreArchivo += `_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Descargar archivo
    saveAs(data, nombreArchivo);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroTexto("");
    setProvinciaSeleccionada("todas");
    setCiudadSeleccionada("todas");
    setCurrentPage(1);
  };

  // Actualizar ciudades cuando cambia la provincia seleccionada
  useEffect(() => {
    if (provinciaSeleccionada !== "todas") {
      const ciudadesEnProvincia = [...new Set(clientes
        .filter(c => c.provincia === provinciaSeleccionada && c.ciudad)
        .map(c => c.ciudad))].sort();
      setCiudades(ciudadesEnProvincia);
      // Resetear ciudad seleccionada si no está en la nueva lista
      if (ciudadSeleccionada !== "todas" && !ciudadesEnProvincia.includes(ciudadSeleccionada)) {
        setCiudadSeleccionada("todas");
      }
    } else {
      // Todas las ciudades si no hay provincia seleccionada
      const todasCiudades = [...new Set(clientes
        .filter(c => c.ciudad)
        .map(c => c.ciudad))].sort();
      setCiudades(todasCiudades);
    }
  }, [provinciaSeleccionada, clientes]);

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
                    <h3 className="mb-0">Distribución Geográfica de Clientes</h3>
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
                  {/* Filtros */}
                  <Row className="mb-3">
                    <Col md="3">
                      <FormGroup>
                        <Label for="provinciaSelect">Provincia</Label>
                        <Input
                          type="select"
                          name="provinciaSelect"
                          id="provinciaSelect"
                          value={provinciaSeleccionada}
                          onChange={e => {
                            setProvinciaSeleccionada(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="todas">Todas las provincias</option>
                          {provincias.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label for="ciudadSelect">Ciudad</Label>
                        <Input
                          type="select"
                          name="ciudadSelect"
                          id="ciudadSelect"
                          value={ciudadSeleccionada}
                          onChange={e => {
                            setCiudadSeleccionada(e.target.value);
                            setCurrentPage(1);
                          }}
                          disabled={ciudades.length === 0}
                        >
                          <option value="todas">Todas las ciudades</option>
                          {ciudades.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label for="searchInput">Búsqueda</Label>
                        <Input
                          type="text"
                          name="searchInput"
                          id="searchInput"
                          placeholder="Buscar por nombre o ubicación..."
                          value={filtroTexto}
                          onChange={e => {
                            setFiltroTexto(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="2" className="d-flex align-items-end">
                      <Button 
                        color="secondary" 
                        outline 
                        block
                        onClick={limpiarFiltros}
                      >
                        Limpiar Filtros
                      </Button>
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
                          Mostrando {filteredClientes.length} de {clientes.length} clientes
                        </h6>
                        {filteredClientes.length > 0 && (
                          <Badge color="primary" pill>
                            Página {currentPage} de {totalPages}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Tabla de clientes */}
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Completo</th>
                              <th>Fecha Registro</th>
                              <th>Provincia</th>
                              <th>Ciudad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedClientes.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  No se encontraron clientes con los filtros seleccionados
                                </td>
                              </tr>
                            ) : (
                              paginatedClientes.map(cliente => (
                                <tr key={cliente.clienteId}>
                                  <td>{cliente.clienteId}</td>
                                  <td>{cliente.nombreCompleto}</td>
                                  <td>{new Date(cliente.fechaRegistro).toLocaleDateString()}</td>
                                  <td>
                                    <Badge color="info" pill>
                                      {cliente.provincia || 'No disponible'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color="primary" pill>
                                      {cliente.ciudad || 'No disponible'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Paginación */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center my-3">
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

                      {/* Resumen de estadísticas MOVIDO AQUÍ */}
                      <h4 className="mt-4 mb-3">Análisis de Distribución Geográfica</h4>
                      <Row>
                        <Col md="6">
                          <Card className="shadow mb-4">
                            <CardHeader className="bg-gradient-info">
                              <h5 className="mb-0 text-white">Distribución por Provincia</h5>
                            </CardHeader>
                            <CardBody>
                              <Table className="table-hover" responsive>
                                <thead className="thead-light">
                                  <tr>
                                    <th>Provincia</th>
                                    <th>Clientes</th>
                                    <th>Porcentaje</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {estadisticasPorProvincia.length === 0 ? (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        No hay datos disponibles
                                      </td>
                                    </tr>
                                  ) : (
                                    estadisticasPorProvincia.map(e => (
                                      <tr key={e.provincia}>
                                        <td>{e.provincia}</td>
                                        <td>{e.cantidad}</td>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <span className="mr-2">{e.porcentaje}%</span>
                                            <div>
                                              <div className="progress">
                                                <div
                                                  className="progress-bar bg-info"
                                                  role="progressbar"
                                                  aria-valuenow={e.porcentaje}
                                                  aria-valuemin="0"
                                                  aria-valuemax="100"
                                                  style={{ width: `${e.porcentaje}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        </Col>
                        
                        <Col md="6">
                          <Card className="shadow mb-4">
                            <CardHeader className="bg-gradient-primary">
                              <h5 className="mb-0 text-white">Principales Ciudades</h5>
                            </CardHeader>
                            <CardBody>
                              <Table className="table-hover" responsive>
                                <thead className="thead-light">
                                  <tr>
                                    <th>Ciudad</th>
                                    <th>Clientes</th>
                                    <th>Porcentaje</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {estadisticasPorCiudad.length === 0 ? (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        No hay datos disponibles
                                      </td>
                                    </tr>
                                  ) : (
                                    estadisticasPorCiudad.slice(0, 10).map(e => (
                                      <tr key={e.ciudad}>
                                        <td>{e.ciudad}</td>
                                        <td>{e.cantidad}</td>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <span className="mr-2">{e.porcentaje}%</span>
                                            <div>
                                              <div className="progress">
                                                <div
                                                  className="progress-bar bg-primary"
                                                  role="progressbar"
                                                  aria-valuenow={e.porcentaje}
                                                  aria-valuemin="0"
                                                  aria-valuemax="100"
                                                  style={{ width: `${e.porcentaje}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
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

export default ClientesPorUbicacion;