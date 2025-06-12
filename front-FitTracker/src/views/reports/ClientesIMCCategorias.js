import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, 
  Button, Badge, Pagination, PaginationItem, PaginationLink,
  Input, FormGroup, Spinner, Progress
} from "reactstrap";
import { obtenerClientesIMCCategorias } from "../../services/reporteService";
import Header from "components/Headers/Header";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomAlert from "components/CustomAlert";
import { Bar } from "react-chartjs-2";

const ClientesIMCCategorias = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const PAGE_SIZE = 10;

  // Categorías de IMC
  const CATEGORIAS_IMC = {
    "Bajo peso": { min: 0, max: 18.5, color: "info", hexColor: '#b8e0f0' }, // Azul más brillante
    "Normal": { min: 18.5, max: 24.9, color: "success", hexColor: '#b8f0d0' }, // Verde más brillante
    "Sobrepeso": { min: 25, max: 29.9, color: "warning", hexColor: '#f0e0b8' }, // Amarillo más brillante
    "Obesidad": { min: 30, max: 100, color: "danger", hexColor: '#f0c0c0' }  // Rojo más brillante
  };

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientesIMCCategorias();
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

  // Determinar categoría IMC
  const obtenerCategoriaIMC = (imc) => {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 25) return "Normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidad";
  };

  // Filtrar clientes por búsqueda y categoría
  const filteredClientes = clientes.filter(cliente => {
    // Filtro por texto
    const matchesText = 
      cliente.nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtro por categoría
    const categoriaIMC = obtenerCategoriaIMC(cliente.imcActual);
    const matchesCategory = 
      categoriaSeleccionada === "todas" || 
      categoriaSeleccionada === categoriaIMC;
    
    return matchesText && matchesCategory;
  });

  // Agrupar para estadísticas
  const estadisticasPorCategoria = Object.keys(CATEGORIAS_IMC).map(categoria => {
    const clientesEnCategoria = clientes.filter(c => obtenerCategoriaIMC(c.imcActual) === categoria);
    return {
      categoria,
      cantidad: clientesEnCategoria.length,
      porcentaje: clientes.length > 0 ? ((clientesEnCategoria.length / clientes.length) * 100).toFixed(1) : 0,
      color: CATEGORIAS_IMC[categoria].color
    };
  });

  // Datos para gráfico
  const chartData = {
    labels: estadisticasPorCategoria.map(e => e.categoria),
    datasets: [
      {
        label: 'Clientes por Categoría IMC',
        data: estadisticasPorCategoria.map(e => e.cantidad),
        backgroundColor: estadisticasPorCategoria.map(e => CATEGORIAS_IMC[e.categoria].hexColor),
        borderColor: estadisticasPorCategoria.map(e => {
          // Borde ligeramente más oscuro para dar definición
          const hexColor = CATEGORIAS_IMC[e.categoria].hexColor;
          return hexColor.replace('e5', 'd0');
        }),
        borderWidth: 1
      }
    ]
  };

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
      "IMC Actual": cliente.imcActual.toFixed(1),
      "Categoría IMC": obtenerCategoriaIMC(cliente.imcActual),
      "Última Medición": new Date(cliente.fechaUltimaMedicion).toLocaleDateString()
    }));
    
    // Crear resumen para estadísticas
    const estadisticasData = estadisticasPorCategoria.map(e => [
      e.categoria, e.cantidad, `${e.porcentaje}%`
    ]);
    
    // Crear todos los datos juntos
    const allData = [
      // Fila 1: Título
      [`Reporte de Clientes por Categoría IMC - ${new Date().toLocaleDateString()}`],
      [],
      ['ID', 'Nombre Completo', 'IMC Actual', 'Categoría', 'Última Medición'],
      ...datosFormateados.map(item => [
        item.ID,
        item["Nombre Completo"],
        item["IMC Actual"],
        item["Categoría IMC"],
        item["Última Medición"]
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    worksheet['!cols'] = [
      { wch: 8 },   // ID
      { wch: 30 },  // Nombre
      { wch: 12 },  // IMC
      { wch: 15 },  // Categoría
      { wch: 18 }   // Fecha
    ];
    worksheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 4} }];
    
    // Segunda hoja con estadísticas
    const estadisticasSheet = XLSX.utils.aoa_to_sheet([
      ["Distribución de Clientes por Categoría IMC"],
      [],
      ["Categoría", "Cantidad", "Porcentaje"],
      ...estadisticasData
    ]);
    estadisticasSheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
    estadisticasSheet['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 2} }];
    
    // Crear libro y agregar hojas
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes por IMC");
    XLSX.utils.book_append_sheet(workbook, estadisticasSheet, "Estadísticas");
    
    // Generar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Descargar
    saveAs(data, `Clientes_Por_IMC_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                    <h3 className="mb-0">Reporte de Clientes por Categoría IMC</h3>
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
                      <label className="mr-2 mb-0">Filtrar por categoría:</label>
                      <div className="btn-group btn-group-sm">
                        <Button 
                          color={categoriaSeleccionada === "todas" ? "primary" : "secondary"} 
                          onClick={() => {
                            setCategoriaSeleccionada("todas");
                            setCurrentPage(1);
                          }}
                          outline={categoriaSeleccionada !== "todas"}
                        >
                          Todas
                        </Button>
                        {Object.entries(CATEGORIAS_IMC).map(([categoria, { color }]) => (
                          <Button 
                            key={categoria}
                            color={categoriaSeleccionada === categoria ? color : "secondary"}
                            onClick={() => {
                              setCategoriaSeleccionada(categoria);
                              setCurrentPage(1);
                            }}
                            outline={categoriaSeleccionada !== categoria}
                          >
                            {categoria}
                          </Button>
                        ))}
                      </div>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <>
                      {/* Gráfico de barras */}
                      <div className="mb-4" style={{ height: "300px" }}>
                        <Bar 
                          data={chartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                position: 'top',
                                align: 'center',
                                labels: {
                                  boxWidth: 15,
                                  padding: 15,
                                  usePointStyle: true,
                                  generateLabels: (chart) => {
                                    const datasets = chart.data.datasets;
                                    return datasets[0].data.map((value, i) => {
                                      return {
                                        text: `${chart.data.labels[i]} - ${value} (${estadisticasPorCategoria[i].porcentaje}%)`,
                                        fillStyle: datasets[0].backgroundColor[i],
                                        hidden: false,
                                        lineCap: 'round',
                                        lineJoin: 'round',
                                        lineWidth: 0,
                                        strokeStyle: datasets[0].backgroundColor[i],
                                        pointStyle: 'circle',
                                        index: i
                                      };
                                    });
                                  }
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    const category = context.label;
                                    const percent = estadisticasPorCategoria.find(e => e.categoria === category).porcentaje;
                                    return `${category}: ${value} clientes (${percent}%)`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0
                                },
                                title: {
                                  display: true,
                                  text: 'Número de Clientes'
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Categoría IMC'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                      
                      {/* Indicadores */}
                      <Row className="mb-4">
                        {estadisticasPorCategoria.map(e => (
                          <Col key={e.categoria} md="3" sm="6" className="mb-3">
                            <Card className="shadow-sm" style={{ backgroundColor: CATEGORIAS_IMC[e.categoria].hexColor }}>
                              <CardBody className="py-3">
                                <div className="text-dark">
                                  <h5 className="mb-1 font-weight-bold">{e.categoria}</h5>
                                  <div className="d-flex justify-content-between">
                                    <span>{e.cantidad} clientes</span>
                                    <span>{e.porcentaje}%</span>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          Mostrando {filteredClientes.length} de {clientes.length} clientes
                        </h6>
                      </div>
                      
                      {/* Tabla de clientes */}
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Completo</th>
                              <th>IMC Actual</th>
                              <th>Categoría</th>
                              <th>Última Medición</th>
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
                              paginatedClientes.map(cliente => {
                                const categoriaIMC = obtenerCategoriaIMC(cliente.imcActual);
                                const colorCategoria = CATEGORIAS_IMC[categoriaIMC].color;
                                return (
                                  <tr key={cliente.clienteId}>
                                    <td>{cliente.clienteId}</td>
                                    <td>{cliente.nombreCompleto}</td>
                                    <td>{cliente.imcActual.toFixed(1)}</td>
                                    <td>
                                      <Badge style={{ 
                                        backgroundColor: CATEGORIAS_IMC[categoriaIMC].hexColor, 
                                        color: '#2c2c2c'
                                      }}>
                                        {categoriaIMC}
                                      </Badge>
                                    </td>
                                    <td>
                                      {new Date(cliente.fechaUltimaMedicion).toLocaleDateString()}
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

export default ClientesIMCCategorias;