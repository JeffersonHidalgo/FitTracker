import React, { useEffect, useState } from "react";
import { Row, Col, Badge, Card, CardBody, Spinner, Nav, NavItem, NavLink, TabContent, TabPane, Button } from "reactstrap";
import classnames from "classnames";
import { Bar, Line } from "react-chartjs-2";
import { obtenerHistorialMetricasCliente } from "../../services/clienteService";
import { generarReporteMetricas, enviarEmailMetricas } from "../../services/reporteService";
import CustomAlert from "../../components/CustomAlert"; // Agrega esta importación

// Valores promedio de referencia (puedes ajustar según tu criterio o fuentes)
const REFERENCIAS = {
  IMC: { sedentario: 27, fitness: 22 },
  "% Grasa": { sedentario: 28, fitness: 14 },
  "Masa Muscular": { sedentario: 28, fitness: 35 },
  "Press Banca": { sedentario: 40, fitness: 80 },
  "Sentadilla": { sedentario: 60, fitness: 120 },
  "Peso Muerto": { sedentario: 70, fitness: 140 },
  "Test Cooper": { sedentario: 1600, fitness: 2600 },
  "FC Reposo": { sedentario: 80, fitness: 55 },
  "Flexibilidad": { sedentario: 15, fitness: 25 },
  "Salto Vertical": { sedentario: 25, fitness: 50 },
  "RPE": { sedentario: 7, fitness: 5 }
};

const ResultsSection = ({ result }) => {
  const [historial, setHistorial] = useState([]);
  const [loadingHist, setLoadingHist] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [activeIndicadorGrupo, setActiveIndicadorGrupo] = useState(0);
  const [activeIndicadorChart, setActiveIndicadorChart] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // Estado para alertas
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    color: "success"
  });
  
  // Función para cerrar alerta
  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!result?.codigoCli) return;
      setLoadingHist(true);
      try {
        const data = await obtenerHistorialMetricasCliente(result.codigoCli);
        setHistorial(data || []);
      } catch (e) {
        setHistorial([]);
      } finally {
        setLoadingHist(false);
      }
    };
    fetchHistorial();
  }, [result?.codigoCli]);

  useEffect(() => {
    setActiveIndicadorChart(0);
  }, [activeIndicadorGrupo]);

  const handleImprimirReporte = async () => {
    if (!result?.codigoCli) return;
    setDownloading(true);
    try {
      const blob = await generarReporteMetricas(result.codigoCli);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Metricas_${result.codigoCli}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setAlert({
        isOpen: true,
        message: "No se pudo generar el reporte. Intente más tarde.",
        color: "danger"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleEnviarEmail = async () => {
    if (!result?.codigoCli) return;
    setSendingEmail(true);
    try {
      await enviarEmailMetricas(result.codigoCli);
      setAlert({
        isOpen: true,
        message: "Reporte enviado por correo electrónico correctamente",
        color: "success"
      });
    } catch (e) {
      setAlert({
        isOpen: true,
        message: "No se pudo enviar el reporte por correo. Intente más tarde.",
        color: "danger"
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (!result) return null;

  // Busca la métrica actual en el historial (por metricaId)
  const metricaActual = historial.find(h => h.metricaId === result.metricaId);

  // Si no está en el historial, usa los datos de result (por compatibilidad)
  const actual = metricaActual || {
    imc: result.imc,
    grasaCorporal: result.grasaCorporal,
    masaMuscular: result.masaMuscular,
    rmPress: result.rmPress,
    rmSentadilla: result.rmSentadilla,
    rmPesoMuerto: result.rmPesoMuerto,
    testCooper: result.testCooper,
    fcReposo: result.fcReposo,
    testFlexibilidad: result.testFlexibilidad,
    saltoVertical: result.saltoVertical,
    rpe: result.rpe
  };

  // Configuración para cada métrica clave (cada una en su propio gráfico)
  const indicadores = [
    {
      label: "Composición Corporal",
      charts: [
        {
          label: "IMC",
          color: "#5e72e4",
          value: Number(actual.imc) || 0,
          help: "Índice de Masa Corporal"
        },
        {
          label: "% Grasa",
          color: "#f5365c",
          value: Number(actual.grasaCorporal) || 0,
          help: "Porcentaje de grasa corporal"
        },
        {
          label: "Masa Muscular",
          color: "#11cdef",
          value: Number(actual.masaMuscular) || 0,
          help: "Masa muscular estimada (kg)"
        }
      ]
    },
    {
      label: "Fuerza Máxima",
      charts: [
        {
          label: "Press Banca",
          color: "#fb6340",
          value: Number(actual.rmPress) || 0,
          help: "Peso máximo levantado en press banca (kg)"
        },
        {
          label: "Sentadilla",
          color: "#2dce89",
          value: Number(actual.rmSentadilla) || 0,
          help: "Peso máximo levantado en sentadilla (kg)"
        },
        {
          label: "Peso Muerto",
          color: "#8965e0",
          value: Number(actual.rmPesoMuerto) || 0,
          help: "Peso máximo levantado en peso muerto (kg)"
        }
      ]
    },
    {
      label: "Rendimiento y Salud",
      charts: [
        {
          label: "Test Cooper",
          color: "#ffbb33",
          value: Number(actual.testCooper) || 0,
          help: "Distancia recorrida en 12 min (m)"
        },
        {
          label: "FC Reposo",
          color: "#ff4444",
          value: Number(actual.fcReposo) || 0,
          help: "Frecuencia cardíaca en reposo (lpm)"
        },
        {
          label: "Flexibilidad",
          color: "#00C851",
          value: Number(actual.testFlexibilidad) || 0,
          help: "Test de flexibilidad (cm)"
        },
        {
          label: "Salto Vertical",
          color: "#33b5e5",
          value: Number(actual.saltoVertical) || 0,
          help: "Altura del salto vertical (cm)"
        },
        {
          label: "RPE",
          color: "#aa66cc",
          value: Number(actual.rpe) || 0,
          help: "Esfuerzo percibido (escala 1-10)"
        }
      ]
    }
  ];

  // Helper para gráfico de barra comparativo
  const comparativoBarData = (label, value, color) => ({
    labels: ["Cliente", "Sedentario", "Fitness"],
    datasets: [
      {
        label: label,
        backgroundColor: [color, "#adb5bd", "#2dce89"],
        data: [
          value,
          REFERENCIAS[label]?.sedentario ?? 0,
          REFERENCIAS[label]?.fitness ?? 0
        ]
      }
    ]
  });

  // Gráficos de evolución histórica
  const historialLabels = historial.map((h) => new Date(h.fechaRegistro).toLocaleDateString());
  const lineColors = {
    imc: "#5e72e4",
    grasaCorporal: "#f5365c",
    masaMuscular: "#11cdef",
    rmPress: "#fb6340",
    rmSentadilla: "#2dce89",
    rmPesoMuerto: "#8965e0",
    testCooper: "#ffbb33",
    fcReposo: "#ff4444",
    testFlexibilidad: "#00C851",
    saltoVertical: "#33b5e5",
    rpe: "#aa66cc"
  };

  const lineChartData = (label, key, color) => ({
    labels: historialLabels,
    datasets: [
      {
        label,
        data: historial.map((h) => h[key]),
        fill: false,
        borderColor: color,
        backgroundColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  // Helper para avanzar/retroceder en el carrusel de indicadores
  const grupo = indicadores[activeIndicadorGrupo];
  const chart = grupo.charts[activeIndicadorChart];

  const handlePrev = () => {
    if (activeIndicadorChart > 0) {
      setActiveIndicadorChart(activeIndicadorChart - 1);
    } else if (activeIndicadorGrupo > 0) {
      setActiveIndicadorGrupo(activeIndicadorGrupo - 1);
      setActiveIndicadorChart(indicadores[activeIndicadorGrupo - 1].charts.length - 1);
    }
  };

  const handleNext = () => {
    if (activeIndicadorChart < grupo.charts.length - 1) {
      setActiveIndicadorChart(activeIndicadorChart + 1);
    } else if (activeIndicadorGrupo < indicadores.length - 1) {
      setActiveIndicadorGrupo(activeIndicadorGrupo + 1);
      setActiveIndicadorChart(0);
    }
  };

  return (
    <section>
      <Card>
        <CardBody>
          {/* Alerta personalizada */}
          {alert.isOpen && (
            <CustomAlert
              type={alert.color}
              message={alert.message}
              onClose={closeAlert}
              dismissible
            />
          )}
          
          <div className="d-flex justify-content-end mb-3">
            <Button 
              color="info" 
              onClick={handleEnviarEmail} 
              disabled={sendingEmail || !result?.codigoCli}
              className="mr-2"
            >
              {sendingEmail ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-2" /> Enviando...
                </>
              ) : (
                <>
                  <i className="fa fa-envelope mr-2" /> Enviar por Email
                </>
              )}
            </Button>
            <Button color="primary" onClick={handleImprimirReporte} disabled={downloading}>
              {downloading ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-2" /> Generando...
                </>
              ) : (
                <>
                  <i className="fa fa-print mr-2" /> Imprimir Reporte PDF
                </>
              )}
            </Button>
          </div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => setActiveTab("1")}
                style={{ cursor: "pointer" }}
              >
                Análisis
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => setActiveTab("2")}
                style={{ cursor: "pointer" }}
              >
                Recomendaciones
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => setActiveTab("3")}
                style={{ cursor: "pointer" }}
              >
                Evolución
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <h2 style={{ color: "#4A628A" }}>Análisis por Sección</h2>
              {result.resumenAnalisis &&
                Object.entries(result.resumenAnalisis).map(([seccion, texto]) => (
                  <div key={seccion} style={{ marginBottom: 16 }}>
                    <h5 style={{ color: "#5e72e4" }}>{seccion}</h5>
                    <p style={{ marginBottom: 0 }}>{texto}</p>
                  </div>
                ))}
              <div className="mt-4">
                <h5>Indicadores Clave (Actual)</h5>
                <p style={{ fontSize: 13, color: "#888" }}>
                  Cada gráfico compara el valor actual del cliente con el de una persona promedio sedentaria y una persona fitness.
                </p>
                <Card className="mb-4 mx-auto" style={{ maxWidth: 420, boxShadow: "0 2px 8px #e9ecef" }}>
                  <CardBody>
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                      <strong style={{ color: "#4A628A", fontSize: 18 }}>{grupo.label}</strong>
                    </div>
                    <div style={{ minHeight: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Bar
                        data={comparativoBarData(chart.label, chart.value, chart.color)}
                        options={{
                          responsive: true,
                          legend: { display: false },
                          scales: {
                            yAxes: [{ ticks: { beginAtZero: true } }]
                          }
                        }}
                        height={180}
                      />
                    </div>
                    <div style={{ textAlign: "center", fontSize: 17, color: "#222", marginTop: 18, fontWeight: 500 }}>
                      {chart.label}
                    </div>
                    <div style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 2 }}>
                      {chart.help}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <Button
                        color="secondary"
                        outline
                        onClick={handlePrev}
                        disabled={activeIndicadorGrupo === 0 && activeIndicadorChart === 0}
                      >
                        <i className="fa fa-chevron-left" /> Anterior
                      </Button>
                      <span style={{ fontSize: 13, color: "#888" }}>
                        {grupo.label} ({activeIndicadorChart + 1} de {grupo.charts.length})
                      </span>
                      <Button
                        color="secondary"
                        outline
                        onClick={handleNext}
                        disabled={
                          activeIndicadorGrupo === indicadores.length - 1 &&
                          activeIndicadorChart === indicadores[indicadores.length - 1].charts.length - 1
                        }
                      >
                        Siguiente <i className="fa fa-chevron-right" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </TabPane>
            <TabPane tabId="2">
              <h2 style={{ color: "#4A628A" }}>Recomendaciones</h2>
              <ul>
                {result.recomendaciones &&
                  result.recomendaciones.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      <Badge color="info" pill className="mr-2">
                        <i className="fa fa-check-circle" />
                      </Badge>
                      {rec}
                    </li>
                  ))}
              </ul>
            </TabPane>
            <TabPane tabId="3">
              <h2 style={{ color: "#4A628A" }}>Evolución de Métricas</h2>
              <p style={{ fontSize: 13, color: "#888" }}>
                En esta sección puedes visualizar cómo han cambiado las principales métricas del cliente a lo largo del tiempo. 
                Cada gráfico muestra la evolución de una métrica específica, permitiendo identificar tendencias de mejora, estancamiento o retroceso. 
                Analiza estos datos para ajustar el plan de entrenamiento y las recomendaciones personalizadas.
              </p>
              {loadingHist ? (
                <div className="text-center my-4">
                  <Spinner color="primary" />
                  <div>Cargando historial...</div>
                </div>
              ) : historial.length > 1 ? (
                <>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-2">IMC</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("IMC", "imc", lineColors.imc)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">% Grasa Corporal</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("% Grasa", "grasaCorporal", lineColors.grasaCorporal)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5 className="mb-2">Masa Muscular</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Masa Muscular", "masaMuscular", lineColors.masaMuscular)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">Press Banca</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Press Banca", "rmPress", lineColors.rmPress)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5 className="mb-2">Sentadilla</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Sentadilla", "rmSentadilla", lineColors.rmSentadilla)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">Peso Muerto</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Peso Muerto", "rmPesoMuerto", lineColors.rmPesoMuerto)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5 className="mb-2">Test Cooper</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Test Cooper", "testCooper", lineColors.testCooper)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">FC Reposo</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("FC Reposo", "fcReposo", lineColors.fcReposo)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5 className="mb-2">Flexibilidad</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Flexibilidad", "testFlexibilidad", lineColors.testFlexibilidad)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">Salto Vertical</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("Salto Vertical", "saltoVertical", lineColors.saltoVertical)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5 className="mb-2">RPE (Esfuerzo Percibido)</h5>
                      <div style={{ height: 260 }}>
                        <Line
                          data={lineChartData("RPE", "rpe", lineColors.rpe)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            scales: { yAxes: [{ ticks: { beginAtZero: true, max: 10 } }] },
                          }}
                          height={260}
                        />
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="text-muted">No hay historial suficiente para mostrar evolución.</div>
              )}
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </section>
  );
};

export default ResultsSection;
