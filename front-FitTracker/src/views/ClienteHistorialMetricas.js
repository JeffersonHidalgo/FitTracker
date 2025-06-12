import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, CardBody, CardHeader, Button, Table, Badge, Alert, Form, FormGroup, Input, Carousel, CarouselItem, CarouselIndicators
} from "reactstrap";
import Header from "components/Headers/Header";
import ClientInfo from "components/MetricsRegistration/ClientInfo";
import { 
  obtenerHistorialCompletoCliente,
} from "services/clienteService";
import {
  generarReorteHistorial,
  enviarHistorial
} from "services/reporteService";
import { Line } from "react-chartjs-2";
import Loading from "components/Loading";
import CustomAlert from "components/CustomAlert";

const metricasKeyMap = {
  imc: "imc",
  grasaCorporal: "grasaCorporal",
  masaMuscular: "masaMuscular",
  rmPress: "rmPress",
  rmSentadilla: "rmSentadilla",
  rmPesoMuerto: "rmPesoMuerto",
  testCooper: "testCooper",
  fcReposo: "fcReposo",
  testFlexibilidad: "testFlexibilidad",
  saltoVertical: "saltoVertical",
  rpe: "rpe",
};

const metricasUnidades = {
  imc: "",
  grasaCorporal: "%",
  masaMuscular: "kg",
  rmPress: "kg",
  rmSentadilla: "kg",
  rmPesoMuerto: "kg",
  testCooper: "m",
  fcReposo: "lpm",
  testFlexibilidad: "cm",
  saltoVertical: "cm",
  rpe: "",
};

const metricasCategorias = [
  {
    label: "Antropometría",
    keys: [
      { key: "imc", label: "IMC", color: "#5e72e4" },
      { key: "grasaCorporal", label: "% Grasa", color: "#f5365c" },
      { key: "masaMuscular", label: "Masa Muscular", color: "#11cdef" }
    ]
  },
  {
    label: "Fuerza",
    keys: [
      { key: "rmPress", label: "RM Press", color: "#fb6340" },
      { key: "rmSentadilla", label: "RM Sentadilla", color: "#2dce89" },
      { key: "rmPesoMuerto", label: "RM Peso Muerto", color: "#8965e0" }
    ]
  },
  {
    label: "Cardio",
    keys: [
      { key: "testCooper", label: "Test Cooper", color: "#ffbb33" },
      { key: "fcReposo", label: "FC Reposo", color: "#ff4444" }
    ]
  },
  {
    label: "Flexibilidad y Potencia",
    keys: [
      { key: "testFlexibilidad", label: "Test Flexibilidad", color: "#00C851" },
      { key: "saltoVertical", label: "Salto Vertical", color: "#33b5e5" }
    ]
  },
  {
    label: "RPE",
    keys: [
      { key: "rpe", label: "RPE", color: "#aa66cc" }
    ]
  }
];

const ClienteHistorialMetricas = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [activeMetricCat, setActiveMetricCat] = useState(0);
  const [animatingMetricCat, setAnimatingMetricCat] = useState(false);
  const [activeHist, setActiveHist] = useState(0);
  const [animatingHist, setAnimatingHist] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Cuando cambia el cliente, consulta el historial
  useEffect(() => {
    const fetchHistorial = async () => {
      if (!cliente?.id) {
        setHistorial([]);
        return;
      }
      setLoading(true);
      try {
        const historialData = await obtenerHistorialCompletoCliente(cliente.id);
        setHistorial(historialData || []);
      } catch (e) {
        setAlert({ isOpen: true, color: "danger", message: "Error al cargar historial del cliente." });
      }
      setLoading(false);
    };
    fetchHistorial();
  }, [cliente]);

  // Filtrado de historial por fechas (frontend)
  const historialFiltrado = React.useMemo(() => {
    if (!dateFilter.from && !dateFilter.to) return historial;
    return historial.filter(h => {
      const fecha = new Date(h.fechaRegistro);
      if (dateFilter.from && fecha < new Date(dateFilter.from)) return false;
      if (dateFilter.to && fecha > new Date(dateFilter.to)) return false;
      return true;
    });
  }, [historial, dateFilter]);

  const historialOrdenado = [...historialFiltrado].sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));

  const getLineData = (key, label, color) => {
    const dataSorted = [...historialFiltrado]
      .filter(h => h[metricasKeyMap[key]] !== undefined && h[metricasKeyMap[key]] !== null)
      .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro));
    return {
      labels: dataSorted.map(h => new Date(h.fechaRegistro).toLocaleDateString()),
      datasets: [
        {
          label: label,
          data: dataSorted.map(h => h[metricasKeyMap[key]]),
          fill: false,
          borderColor: color,
          backgroundColor: color,
          pointRadius: 4,
          pointHoverRadius: 6,
          lineTension: 0.2,
        }
      ]
    };
  };

  // Carrusel de métricas por categoría
  const metricasSlides = metricasCategorias.map((cat, idx) => (
    <CarouselItem
      onExiting={() => setAnimatingMetricCat(true)}
      onExited={() => setAnimatingMetricCat(false)}
      key={cat.label}
    >
      <Card className="h-100">
        <CardHeader className="py-2 px-3">
          <h5 className="mb-0" style={{ color: "#5e72e4", fontSize: 18 }}>{cat.label}</h5>
        </CardHeader>
        <CardBody style={{ minHeight: 340 }}>
          {cat.keys.map(m => {
            const hayDatos = historialFiltrado.some(h => h[metricasKeyMap[m.key]] !== undefined && h[metricasKeyMap[m.key]] !== null);
            return (
              <div key={m.key} className="mb-4" style={{ height: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, textAlign: "center" }}>{m.label}</div>
                {hayDatos ? (
                  <Line
                    data={getLineData(m.key, m.label, m.color)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } }
                    }}
                    height={180}
                  />
                ) : (
                  <div className="text-center text-muted" style={{ paddingTop: 60, fontSize: 14 }}>
                    Sin datos para {m.label}
                  </div>
                )}
              </div>
            );
          })}
        </CardBody>
      </Card>
    </CarouselItem>
  ));

  const nextMetricCat = () => {
    if (animatingMetricCat) return;
    setActiveMetricCat(activeMetricCat === metricasSlides.length - 1 ? 0 : activeMetricCat + 1);
  };
  const prevMetricCat = () => {
    if (animatingMetricCat) return;
    setActiveMetricCat(activeMetricCat === 0 ? metricasSlides.length - 1 : activeMetricCat - 1);
  };
  const goToMetricCat = idx => {
    if (animatingMetricCat) return;
    setActiveMetricCat(idx);
  };

  // Carrusel de registros históricos
  const historialSlides = historialOrdenado.map((h, idx) => (
    <CarouselItem
      onExiting={() => setAnimatingHist(true)}
      onExited={() => setAnimatingHist(false)}
      key={h.metricaId || idx}
    >
      <Card className="mb-4">
        <CardHeader>
          <strong>Fecha de registro: </strong>
          {new Date(h.fechaRegistro).toLocaleString()}
        </CardHeader>
        <CardBody>
          {/* Sección 1: Métricas claves */}
          <Row>
            {Object.entries(metricasKeyMap).map(([key, label]) =>
              h[label] !== undefined && (
                <Col md={3} sm={6} xs={12} className="mb-2" key={key}>
                  <div style={{
                    background: "#f8f9fe",
                    borderRadius: 8,
                    padding: 12,
                    textAlign: "center",
                    boxShadow: "0 1px 4px #e9ecef"
                  }}>
                    <div style={{ fontSize: 13, color: "#888" }}>
                      {metricasCategorias
                        .flatMap(cat => cat.keys)
                        .find(m => m.key === key)?.label || key}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      {h[label] !== null ? h[label] : "-"}
                      <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>
                        {metricasUnidades[key]}
                      </span>
                    </div>
                  </div>
                </Col>
              )
            )}
          </Row>
          {/* Sección 2: Evaluaciones */}
          <h6 className="mt-3" style={{ color: "#5e72e4" }}>Evaluaciones</h6>
          {h.resumenPorSeccion && Object.keys(h.resumenPorSeccion).length > 0 ? (
            <Table size="sm" bordered>
              <thead>
                <tr>
                  <th>Sección</th>
                  <th>Diagnóstico</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(h.resumenPorSeccion).map(([seccion, diag]) => (
                  <tr key={seccion}>
                    <td>{seccion}</td>
                    <td>{diag}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-muted">Sin evaluaciones para este registro.</div>
          )}
          {/* Sección 3: Recomendaciones */}
          <h6 className="mt-3" style={{ color: "#5e72e4" }}>Recomendaciones</h6>
          {Array.isArray(h.recomendaciones) && h.recomendaciones.length > 0 ? (
            <ul style={{ paddingLeft: 18 }}>
              {h.recomendaciones.map((rec, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <Badge color="info" pill className="mr-2">
                    <i className="fa fa-info-circle" />
                  </Badge>
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">Sin recomendaciones para este registro.</div>
          )}
        </CardBody>
      </Card>
    </CarouselItem>
  ));

  const nextHist = () => {
    if (animatingHist) return;
    setActiveHist(activeHist === historialSlides.length - 1 ? 0 : activeHist + 1);
  };
  const prevHist = () => {
    if (animatingHist) return;
    setActiveHist(activeHist === 0 ? historialSlides.length - 1 : activeHist - 1);
  };
  const goToHist = idx => {
    if (animatingHist) return;
    setActiveHist(idx);
  };

  const handleImprimirHistorial = async () => {
    if (!cliente?.id) return;
    
    setDownloadingReport(true);
    try {
      const blob = await generarReorteHistorial(cliente.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Historial_Metricas_${cliente.name || cliente.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error al generar reporte:", e);
      setAlert({
        isOpen: true,
        color: "danger",
        message: "No se pudo generar el reporte. Intente más tarde."
      });
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleEnviarHistorialEmail = async () => {
    if (!cliente?.id) return;
    
    setSendingEmail(true);
    try {
      await enviarHistorial(cliente.id);
      setAlert({
        isOpen: true,
        color: "success",
        message: "El historial ha sido enviado por correo electrónico correctamente."
      });
    } catch (e) {
      console.error("Error al enviar historial por email:", e);
      setAlert({
        isOpen: true,
        color: "danger",
        message: "No se pudo enviar el historial por correo. Intente más tarde."
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
      <Header />
      <Loading show={loading} />
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert(a => ({ ...a, isOpen: false }))}
      />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          {/* DATOS BÁSICOS DEL CLIENTE */}
          <Row className="justify-content-center">
            <Col xl="10" lg="10" md="12">
              <Card className="shadow mb-4">
                <CardHeader className="bg-transparent">
  <div className="d-flex justify-content-between align-items-center">
    <h3 className="mb-0" style={{ color: "#4A628A" }}>Historial de Cliente</h3>
  </div>
</CardHeader>
                <CardBody>
                  <ClientInfo
                    selectedCliente={cliente}
                    setSelectedCliente={setCliente}
                    onLimpiar={() => {
                      setCliente(null);
                      setHistorial([]);
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* FILTRO Y ACCIONES */}
          {cliente && (
            <>
              <Row className="justify-content-center mb-4">
                <Col xl="10" lg="10" md="12">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <Form inline className="d-flex flex-wrap">
                          <FormGroup className="mr-2 mb-2">
                            <label className="mr-2 mb-0" style={{ fontSize: 14 }}>Desde</label>
                            <Input
                              type="date"
                              bsSize="sm"
                              style={{ width: 140, fontSize: 14 }}
                              value={dateFilter.from}
                              onChange={e => setDateFilter(f => ({ ...f, from: e.target.value }))}
                            />
                          </FormGroup>
                          <FormGroup className="mr-2 mb-2">
                            <label className="mr-2 mb-0" style={{ fontSize: 14 }}>Hasta</label>
                            <Input
                              type="date"
                              bsSize="sm"
                              style={{ width: 140, fontSize: 14 }}
                              value={dateFilter.to}
                              onChange={e => setDateFilter(f => ({ ...f, to: e.target.value }))}
                            />
                          </FormGroup>
                          <Button
                            color="primary"
                            className="mb-2"
                            size="sm"
                            style={{ fontSize: 14, padding: "2px 12px" }}
                            onClick={() => setDateFilter({ from: "", to: "" })}
                            outline
                          >
                            Limpiar Filtro
                          </Button>
                        </Form>
                        <div>
                          <Button
                            color="info"
                            className="mb-2 mr-2"
                            size="sm"
                            style={{ fontSize: 14, padding: "2px 18px" }}
                            onClick={() => navigate("/admin/metrics-registration")}
                          >
                            Registrar Métricas
                          </Button>
                          <Button
                            color="secondary"
                            className="mb-2 mr-2"
                            size="sm"
                            style={{ fontSize: 14, padding: "2px 18px" }}
                            onClick={handleEnviarHistorialEmail}
                            disabled={sendingEmail || historial.length === 0}
                          >
                            {sendingEmail ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-1" /> Enviando...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-envelope mr-1" /> Enviar por Email
                              </>
                            )}
                          </Button>
                          <Button
                            color="primary"
                            className="mb-2"
                            size="sm"
                            style={{ fontSize: 14, padding: "2px 18px" }}
                            onClick={handleImprimirHistorial}
                            disabled={downloadingReport || historial.length === 0}
                          >
                            {downloadingReport ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-1" /> Generando...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-print mr-1" /> Imprimir Historial
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* HISTORIAL */}
              <Row className="justify-content-center">
                <Col xl="10" lg="10" md="12">
                  {loading ? (
                    <div className="text-center my-4">
                      <span>Cargando historial...</span>
                    </div>
                  ) : historial.length === 0 ? (
                    <Alert color="warning" className="text-center shadow-sm" style={{ fontSize: 16 }}>
                      Este cliente aún no tiene métricas registradas.
                    </Alert>
                  ) : (
                    <>
                      {/* Gráficos de evolución temporal */}
                      <Card className="mb-4">
                        <CardHeader>
                          <h4 className="mb-0" style={{ color: "#4A628A" }}>Evolución de Métricas</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={prevMetricCat}
                              disabled={animatingMetricCat}
                            >
                              <i className="fa fa-chevron-left" /> Anterior
                            </Button>
                            <span style={{ fontSize: 15 }}>
                              {metricasCategorias[activeMetricCat]?.label}
                            </span>
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={nextMetricCat}
                              disabled={animatingMetricCat}
                            >
                              Siguiente <i className="fa fa-chevron-right" />
                            </Button>
                          </div>
                          <Carousel
                            activeIndex={activeMetricCat}
                            next={nextMetricCat}
                            previous={prevMetricCat}
                            interval={false}
                            ride="false"
                            className="w-100"
                            style={{ minHeight: 400 }}
                          >
                            {metricasSlides}
                            <CarouselIndicators
                              items={metricasCategorias.map((cat, idx) => ({ key: idx }))}
                              activeIndex={activeMetricCat}
                              onClickHandler={goToMetricCat}
                            />
                          </Carousel>
                        </CardBody>
                      </Card>

                      {/* Carrusel de registros históricos */}
                      <Card className="mb-4">
                        <CardHeader>
                          <h4 className="mb-0" style={{ color: "#4A628A" }}>Historial de Métricas</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={prevHist}
                              disabled={animatingHist}
                            >
                              <i className="fa fa-chevron-left" /> Anterior
                            </Button>
                            <span style={{ fontSize: 15 }}>
                              {historialOrdenado.length > 0
                                ? new Date(historialOrdenado[activeHist]?.fechaRegistro).toLocaleDateString()
                                : ""}
                            </span>
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={nextHist}
                              disabled={animatingHist}
                            >
                              Siguiente <i className="fa fa-chevron-right" />
                            </Button>
                          </div>
                          <Carousel
                            activeIndex={activeHist}
                            next={nextHist}
                            previous={prevHist}
                            interval={false}
                            ride="false"
                            className="w-100"
                            style={{ minHeight: 400 }}
                          >
                            {historialSlides}
                            <CarouselIndicators
                              items={historialOrdenado.map((h, idx) => ({ key: idx }))}
                              activeIndex={activeHist}
                              onClickHandler={goToHist}
                            />
                          </Carousel>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default ClienteHistorialMetricas;