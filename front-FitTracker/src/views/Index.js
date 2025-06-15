import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  ListGroup,
  ListGroupItem,
  Badge,
  Progress
} from "reactstrap";
import Header from "components/Headers/Header.js";
import {
  obtenerResumenClientes,
  obtenerDemografiaClientes,
  obtenerSaludClientes,
  obtenerCumpleanios
} from "services/dashboardService";
import { Bar, Pie } from "react-chartjs-2";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import coorData from "assets/coor.json";

const Index = () => {
  // Estructuras por defecto según los JSON reales
  const defaultSummary = {
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    activePercentage: 0,
    inactivePercentage: 0,
    newLast30: 0,
    newLast7: 0
  };
  const defaultDemography = {
    female: 0,
    male: 0,
    other: 0,
    age18_25: 0,
    age26_35: 0,
    age36_45: 0,
    age46Plus: 0,
    averageAge: 0,
    location: []
  };
  const defaultHealth = {
    bmi: 0,
    bodyFat: 0,
    muscleMass: 0,
    bmiTrend: []
  };

  const [summaryData, setSummaryData] = useState(defaultSummary);
  const [demographicData, setDemographicData] = useState(defaultDemography);
  const [healthData, setHealthData] = useState(defaultHealth);
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [resumen, demografia, salud, cumple] = await Promise.all([
          obtenerResumenClientes(),
          obtenerDemografiaClientes(),
          obtenerSaludClientes(),
          obtenerCumpleanios()
        ]);

        setSummaryData({
          totalClients: resumen.totalClients ?? 0,
          activeClients: resumen.activeClients ?? 0,
          inactiveClients: resumen.inactiveClients ?? 0,
          activePercentage: resumen.activePercentage ?? 0,
          inactivePercentage: resumen.inactivePercentage ?? 0,
          newLast30: resumen.newLast30 ?? 0,
          newLast7: resumen.newLast7 ?? 0
        });

        setDemographicData({
          female: demografia.female ?? 0,
          male: demografia.male ?? 0,
          other: demografia.other ?? 0,
          age18_25: demografia.age18_25 ?? 0,
          age26_35: demografia.age26_35 ?? 0,
          age36_45: demografia.age36_45 ?? 0,
          age46Plus: demografia.age46Plus ?? 0,
          averageAge: demografia.averageAge ?? 0,
          location: Array.isArray(demografia.location) ? demografia.location : []
        });

        setHealthData({
          bmi: salud.bmi ?? 0,
          bodyFat: salud.bodyFat ?? 0,
          muscleMass: salud.muscleMass ?? 0,
          bmiTrend: Array.isArray(salud.bmiTrend) ? salud.bmiTrend : []
        });

        setBirthdays(Array.isArray(cumple) ? cumple : []);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      }
    };
    cargarDashboard();
  }, []);

  // Calcular porcentajes para barras y evitar división por cero
  const totalClients = summaryData.totalClients || 1;
  const percent = (value) => Math.round((value / totalClients) * 100);

  // Gráfico de Distribución por Género (Pie, colores suaves)
  const generoPieData = {
    labels: ["Mujeres", "Hombres", "Otro"],
    datasets: [
      {
        data: [
          demographicData.female,
          demographicData.male,
          demographicData.other,
        ],
        backgroundColor: ["#FFB6C1", "#B3E5FC", "#E0E0E0"], // colores suaves
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const generoPieOptions = {
    legend: { display: false },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  // Datos para gráfico de barras de salud
  const saludBarDataChart = {
    labels: ["IMC", "% Grasa", "Masa Muscular"],
    datasets: [
      {
        label: "Promedio",
        data: [healthData.bmi, healthData.bodyFat, healthData.muscleMass],
        backgroundColor: ["#ffd600", "#fb6340", "#11cdef"],
      },
    ],
  };

  const saludBarOptions = {
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: { beginAtZero: true },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Configuración del mapa
  const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '8px'
  };
  const center = { lat: 19.0, lng: -70.5 }; // Centro de República Dominicana

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "TU_API_KEY_AQUI" // Reemplaza con tu API Key real
  });

  // Relaciona ciudades de demographicData.location con coordenadas de coor.json
  const locationsWithCoords = demographicData.location.map(loc => {
    const provincia = coorData.provincias.find(
      p => p.nombre && p.nombre.toLowerCase() === loc.city?.toLowerCase()
    );
    return provincia && provincia.coordenadas
      ? { ...loc, lat: provincia.coordenadas.lat, lng: provincia.coordenadas.lng }
      : null;
  }).filter(Boolean);

  return (
    <>
      <Header />
      <div className="main-content">
        <Container fluid>
          {/* 1. Resumen General de Clientes */}
          <Row className="mt-4">
            {/* ... (los tres primeros Col md="4" iguales) ... */}
            <Col md="4">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow mr-3">
                      <i className="ni ni-badge"></i>
                    </div>
                    <h5 className="mb-0">Total de Clientes Registrados</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <h2 className="display-3">{summaryData.totalClients}</h2>
                    <p className="text-muted">clientes registrados</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow mr-3">
                      <i className="ni ni-active-40"></i>
                    </div>
                    <h5 className="mb-0">Clientes Activos vs. Inactivos</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Activos:</span>
                    <strong>
                      {summaryData.activeClients} ({summaryData.activePercentage}%)
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Inactivos:</span>
                    <strong>
                      {summaryData.inactiveClients} ({summaryData.inactivePercentage}%)
                    </strong>
                  </div>
                  <Progress multi className="mt-3" style={{ height: "10px" }}>
                    <Progress
                      bar
                      value={summaryData.activePercentage}
                      color="success"
                    />
                    <Progress
                      bar
                      value={summaryData.inactivePercentage}
                      color="danger"
                    />
                  </Progress>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow mr-3">
                      <i className="ni ni-satisfied"></i>
                    </div>
                    <h5 className="mb-0">Nuevos Clientes</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Últimos 30 días:</span>
                    <strong>{summaryData.newLast30}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Últimos 7 días:</span>
                    <strong>{summaryData.newLast7}</strong>
                  </div>
                  <div className="mt-3 text-center">
                    <Badge color="info" pill className="px-3 py-2">
                      <i className="ni ni-chart-bar-32 mr-1"></i> Tasa de crecimiento: +12%
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* 2. Demografía y Datos Personales */}
          <Row className="mt-4">
            <Col md="6">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow mr-3">
                      <i className="ni ni-single-02"></i>
                    </div>
                    <h5 className="mb-0">Distribución por Género</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="d-flex justify-content-between mb-2">
                        <span><i className="ni ni-single-02 text-pink mr-1"></i> Mujeres:</span>
                        <strong>
                          {demographicData.female} ({percent(demographicData.female)}%)
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span><i className="ni ni-single-02 text-info mr-1"></i> Hombres:</span>
                        <strong>
                          {demographicData.male} ({percent(demographicData.male)}%)
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span><i className="ni ni-single-02 text-secondary mr-1"></i> Otro:</span>
                        <strong>
                          {demographicData.other} ({percent(demographicData.other)}%)
                        </strong>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex justify-content-center align-items-center" style={{ height: "140px" }}>
                        <Pie
                          data={generoPieData}
                          options={generoPieOptions}
                          height={140}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-purple text-white rounded-circle shadow mr-3">
                      <i className="ni ni-calendar-grid-58"></i>
                    </div>
                    <h5 className="mb-0">Distribución por Edad</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="mb-3">
                    <h6><i className="ni ni-watch-time mr-1"></i> Edad Promedio: <strong>{demographicData.averageAge} años</strong></h6>
                  </div>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><i className="ni ni-bold-right mr-1"></i> 18-25 años:</td>
                        <td><strong>{demographicData.age18_25} clientes</strong></td>
                        <td width="70%">
                          <Progress value={percent(demographicData.age18_25)} />
                        </td>
                      </tr>
                      <tr>
                        <td><i className="ni ni-bold-right mr-1"></i> 26-35 años:</td>
                        <td><strong>{demographicData.age26_35} clientes</strong></td>
                        <td>
                          <Progress value={percent(demographicData.age26_35)} color="success" />
                        </td>
                      </tr>
                      <tr>
                        <td><i className="ni ni-bold-right mr-1"></i> 36-45 años:</td>
                        <td><strong>{demographicData.age36_45} clientes</strong></td>
                        <td>
                          <Progress value={percent(demographicData.age36_45)} color="info" />
                        </td>
                      </tr>
                      <tr>
                        <td><i className="ni ni-bold-right mr-1"></i> 46+ años:</td>
                        <td><strong>{demographicData.age46Plus} clientes</strong></td>
                        <td>
                          <Progress value={percent(demographicData.age46Plus)} color="warning" />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col md="12">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-blue text-white rounded-circle shadow mr-3">
                      <i className="ni ni-pin-3"></i>
                    </div>
                    <h5 className="mb-0">Ubicación Geográfica</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* Mapa OpenStreetMap */}
                  <div style={{ width: "100%", height: 350, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
                    <iframe
                      title="OpenStreetMap"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-72.0%2C17.5%2C-68.0%2C20.5&amp;layer=mapnik"
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                  {/* Tabla de ubicaciones */}
                  <Table hover>
                    <thead>
                      <tr>
                        <th><i className="ni ni-square-pin mr-1"></i> Ciudad</th>
                        <th className="text-right">Clientes</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demographicData.location.map((loc, index) => (
                        <tr key={index}>
                          <td><i className="ni ni-pin-3 mr-1"></i> {loc.city}</td>
                          <td className="text-right">{loc.clients}</td>
                          <td>
                            <Progress
                              value={percent(loc.clients)}
                              color={index % 2 === 0 ? "primary" : "info"}
                              style={{ height: "8px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* 3. Indicadores de Salud Promedio */}
          <Row className="mt-4">
            <Col md="12">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-green text-white rounded-circle shadow mr-3">
                      <i className="ni ni-chart-bar-32"></i>
                    </div>
                    <h5 className="mb-0">Indicadores de Salud Promedio</h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-center" style={{ width: "100%", height: 220 }}>
                    <Bar data={saludBarDataChart} options={saludBarOptions} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* 4. Cumpleaños próximos */}
          <Row className="mt-4">
            <Col md="12">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow mr-3">
                      <i className="ni ni-calendar-grid-58"></i>
                    </div>
                    <h5 className="mb-0">Cumpleaños próximos</h5>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  {birthdays.length > 0 ? (
                    <div className="birthday-list">
                      {birthdays.map((bday, index) => {
                        const daysLeft = Math.floor(Math.random() * 7) + 1;
                        
                        return (
                          <div 
                            key={index} 
                            className="birthday-item p-3 mb-2 rounded w-100" 
                            style={{
                              background: index % 2 === 0 ? '#f6f9fc' : 'white',
                              border: '1px solid #e9ecef',
                              transition: 'all .15s ease',
                              overflow: 'hidden' // Evitar desbordamiento
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <Row className="align-items-center no-gutters"> {/* Eliminado gutters */}
                              <Col xs="2" md="1" className="text-center pr-0">
                                <div 
                                  className="avatar rounded-circle bg-soft-primary mx-auto"
                                  style={{
                                    width: '40px', // Reducido tamaño
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                  }}
                                >
                                  <span className="font-weight-bold text-primary">
                                    {bday.name.charAt(0)}
                                  </span>
                                </div>
                              </Col>
                              <Col xs="6" md="6" className="px-2"> {/* Ajustado el padding horizontal */}
                                <h5 className="mb-0 text-truncate" style={{ fontSize: '1rem' }}>{bday.name}</h5>
                                <div className="small text-muted d-flex align-items-center">
                                  <i className="ni ni-calendar-grid-58 mr-1"></i> 
                                  <span className="text-truncate">{bday.date}</span>
                                </div>
                              </Col>
                              <Col xs="4" md="3" className="text-center px-1"> {/* Ajustado padding */}
                                <Badge 
                                  color="primary" 
                                  pill 
                                  className="px-2 py-1" // Reducido padding
                                  style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                                >
                                  <i className="fa fa-gift mr-1"></i>
                                  {bday.age ? `${bday.age} años` : "Cumpleaños"}
                                </Badge>
                              </Col>
                              <Col md="2" className="d-none d-md-flex justify-content-end">
                                <div className="text-right">
                                  <Badge 
                                    color={daysLeft <= 3 ? "danger" : "warning"} 
                                    className="px-2"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    {daysLeft === 1 ? "¡Mañana!" : `En ${daysLeft} días`}
                                  </Badge>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="icon icon-shape icon-lg bg-gradient-secondary text-white rounded-circle shadow mx-auto mb-3">
                        <i className="ni ni-calendar-grid-58"></i>
                      </div>
                      <h4 className="text-muted">No hay cumpleaños próximos</h4>
                      <p className="text-sm text-muted">
                        No hay clientes que cumplan años en los próximos 7 días
                      </p>
                    </div>
                  )}
                  
                  {birthdays.length > 0 && (
                    <div className="text-center mt-3">
                      <Badge color="success" className="px-3 py-2">
                        <i className="ni ni-notification-70 mr-1"></i> {birthdays.length} cumpleaños próximos
                      </Badge>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Index;
