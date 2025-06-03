import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Form, Row, Col, FormGroup, Input, Button, Tooltip, Nav, NavItem, NavLink, TabContent, TabPane, Label
} from "reactstrap";
import classnames from "classnames";
import { request } from "../../services/apiClient";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import CustomAlert from "components/CustomAlert";

const tooltips = {
  weight: "Peso corporal. Ingresa el valor en la unidad seleccionada (kg o lb).",
  height: "Altura total. Ingresa el valor en la unidad seleccionada (cm o in).",
  bmi: "Índice de Masa Corporal. Se calcula automáticamente con peso y altura.",
  bodyFat: "Porcentaje estimado de grasa corporal (%).",
  muscleMass: "Masa muscular total en la unidad seleccionada (kg o lb).",
  waist: "Circunferencia de la cintura en la unidad seleccionada (cm o in).",
  hip: "Circunferencia de la cadera en la unidad seleccionada (cm o in).",
  arms: "Circunferencia de los brazos en la unidad seleccionada (cm o in).",
  rmPress: "Peso máximo levantado en una repetición de press de banca (kg o lb).",
  rmSquat: "Peso máximo levantado en una repetición de sentadilla (kg o lb).",
  rmDeadlift: "Peso máximo levantado en una repetición de peso muerto (kg o lb).",
  repetitions: "Cantidad máxima de repeticiones realizadas en un ejercicio.",
  executionSpeed: "Tiempo en segundos para completar una repetición.",
  cooperTest: "Distancia recorrida en el Test de Cooper (12 minutos), en metros.",
  restingHeartRate: "Pulsaciones por minuto en reposo (ppm).",
  recoveryHeartRate: "Pulsaciones por minuto tras el ejercicio (ppm).",
  aerobicDuration: "Duración total de ejercicio aeróbico (minutos).",
  flexibilityTest: "Distancia alcanzada en el test de flexibilidad (cm o in).",
  rangeOfMotion: "Grados de movimiento articular (°).",
  verticalJump: "Altura alcanzada en el salto vertical (cm o in).",
  sprintSpeed: "Tiempo en segundos en una carrera corta (sprint).",
  agilityTest: "Resultado de la prueba de agilidad (segundos o puntos).",
  rpe: "Escala subjetiva de esfuerzo percibido (1-10)."
};

const MetricsForm = ({ codigoCli, onResult, result }) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [arms, setArms] = useState("");
  const [rmPress, setRmPress] = useState("");
  const [rmSquat, setRmSquat] = useState("");
  const [rmDeadlift, setRmDeadlift] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [executionSpeed, setExecutionSpeed] = useState("");
  const [cooperTest, setCooperTest] = useState("");
  const [restingHeartRate, setRestingHeartRate] = useState("");
  const [recoveryHeartRate, setRecoveryHeartRate] = useState("");
  const [aerobicDuration, setAerobicDuration] = useState("");
  const [flexibilityTest, setFlexibilityTest] = useState("");
  const [rangeOfMotion, setRangeOfMotion] = useState("");
  const [verticalJump, setVerticalJump] = useState("");
  const [sprintSpeed, setSprintSpeed] = useState("");
  const [agilityTest, setAgilityTest] = useState("");
  const [rpe, setRpe] = useState("");

  // Tooltips state
  const [tooltipOpen, setTooltipOpen] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [sistemaMetrico, setSistemaMetrico] = useState("M"); // "M" o "I"
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, color: "success", message: "" });

  const toggleTooltip = (key) => {
    setTooltipOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  // Conversión de unidades si es imperial
  const toMetric = (val, type) => {
    if (!val) return "";
    if (sistemaMetrico === "M") return Number(val);
    if (type === "kg") return Number(val) / 2.20462;
    if (type === "cm") return Number(val) * 2.54;
    return Number(val);
  };

  const showAlert = (color, message) => {
    setAlert({ isOpen: true, color, message });
    setTimeout(() => setAlert(a => ({ ...a, isOpen: false })), 3500);
  };

  // Utilidad para convertir a número o null
  const safeDecimal = v => v === "" || v === undefined || isNaN(Number(v)) ? null : Number(v);
  const safeInt = v => v === "" || v === undefined || isNaN(Number(v)) ? null : parseInt(v, 10);

  const handleAnalizar = async () => {
    setLoading(true);
    try {
      const data = {
        codigoCli: codigoCli || 1,
        sistemaMetrico,
        peso: safeDecimal(toMetric(weight, "kg")),
        altura: safeDecimal(toMetric(height, "cm")),
        imc: safeDecimal(bmi),
        grasaCorporal: safeDecimal(bodyFat),
        masaMuscular: safeDecimal(toMetric(muscleMass, "kg")),
        cintura: safeDecimal(toMetric(waist, "cm")),
        caderas: safeDecimal(toMetric(hip, "cm")),
        brazos: safeDecimal(toMetric(arms, "cm")),
        rmPress: safeDecimal(toMetric(rmPress, "kg")),
        rmSentadilla: safeDecimal(toMetric(rmSquat, "kg")),
        rmPesoMuerto: safeDecimal(toMetric(rmDeadlift, "kg")),
        repeticiones: safeInt(repetitions),
        velocidadEjecucion: safeDecimal(executionSpeed),
        testCooper: safeDecimal(cooperTest),
        fcReposo: safeInt(restingHeartRate),
        fcRecuperacion: safeInt(recoveryHeartRate),
        duracionAerobica: safeDecimal(aerobicDuration),
        testFlexibilidad: safeDecimal(toMetric(flexibilityTest, "cm")),
        rangoMovimiento: safeDecimal(rangeOfMotion),
        saltoVertical: safeDecimal(toMetric(verticalJump, "cm")),
        velocidadSprint: safeDecimal(sprintSpeed),
        pruebaAgilidad: safeDecimal(agilityTest),
        rpe: safeDecimal(rpe)
      };
      // console.log("JSON enviado:", data);
      const result = await request("post", "cliente/metricas/analizar", data);

      // Si la API devuelve el IMC calculado, actualiza el campo en el formulario
      if (result && result.metricas && result.metricas.imc !== undefined && result.metricas.imc !== null) {
        setBmi(result.metricas.imc.toFixed(2));
      }

      if (onResult) onResult(result);
      showAlert("success", "¡Análisis realizado correctamente!");
    } catch (e) {
      toast.error("Error al analizar métricas");
      showAlert("danger", "Error al analizar métricas");
    } finally {
      setLoading(false);
    }
  };

  // Unidades por sistema
  const unidades = {
    M: {
      weight: "kg",
      height: "cm",
      bodyFat: "%",
      muscleMass: "kg",
      waist: "cm",
      hip: "cm",
      arms: "cm",
      rmPress: "kg",
      rmSquat: "kg",
      rmDeadlift: "kg",
      flexibilityTest: "cm",
      rangeOfMotion: "°",
      verticalJump: "cm",
      sprintSpeed: "s",
      agilityTest: "s",
    },
    I: {
      weight: "lb",
      height: "in",
      bodyFat: "%",
      muscleMass: "lb",
      waist: "in",
      hip: "in",
      arms: "in",
      rmPress: "lb",
      rmSquat: "lb",
      rmDeadlift: "lb",
      flexibilityTest: "in",
      rangeOfMotion: "°",
      verticalJump: "in",
      sprintSpeed: "s",
      agilityTest: "s",
    }
  };

  // Cambia inputStyle para que los campos no sean tan anchos y se vean más organizados
  const inputStyle = {
    width: "100%",      // Ocupa todo el ancho de la columna
    fontSize: 15,
    padding: "8px 12px",
    boxSizing: "border-box",
    display: "block"
  };

  // Función para validar campos requeridos
  const isRequiredFieldsFilled = () => {
    // Puedes ajustar los campos requeridos según tu lógica
    return (
      !!codigoCli &&
      weight !== "" &&
      height !== "" &&
      bodyFat !== "" &&
      muscleMass !== "" &&
      waist !== "" &&
      hip !== "" &&
      arms !== ""
    );
  };

  // Actualiza el IMC si cambia el resultado externo (por ejemplo, al consultar un cliente)
  useEffect(() => {
    if (result && result.metricas && result.metricas.imc !== undefined && result.metricas.imc !== null) {
      setBmi(result.metricas.imc.toFixed(2));
    }
  }, [result]);

  return (
    <>
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert(a => ({ ...a, isOpen: false }))}
      />
      <Loading show={loading} />
      <Card className="shadow">
        <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center">
          <h3 className="mb-0" style={{ color: "#4A628A" }}>
            Registro de Métricas
          </h3>
          <div>
            <span>Sistema:&nbsp;</span>
            <Input
              type="select"
              value={sistemaMetrico}
              onChange={e => setSistemaMetrico(e.target.value)}
              style={{ width: 120, display: "inline-block" }}
              bsSize="sm"
            >
              <option value="M">Métrico</option>
              <option value="I">Imperial</option>
            </Input>
          </div>
        </CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => setActiveTab("1")}
                style={{ cursor: "pointer" }}
              >
                Antropometría
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => setActiveTab("2")}
                style={{ cursor: "pointer" }}
              >
                Fuerza y Resistencia
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => setActiveTab("3")}
                style={{ cursor: "pointer" }}
              >
                Aeróbico/Cardio
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => setActiveTab("4")}
                style={{ cursor: "pointer" }}
              >
                Flexibilidad
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "5" })}
                onClick={() => setActiveTab("5")}
                style={{ cursor: "pointer" }}
              >
                Potencia y Agilidad
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "6" })}
                onClick={() => setActiveTab("6")}
                style={{ cursor: "pointer" }}
              >
                Esfuerzo Percibido
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <Form>
                <h6 className="heading-small text-muted mb-4">Datos Antropométricos y Composición Corporal</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="weight-label" style={{ fontSize: 13 }}>
                        Peso ({unidades[sistemaMetrico].weight})
                        <span id="tooltip-weight" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.weight}
                          target="tooltip-weight"
                          toggle={() => toggleTooltip("weight")}
                        >
                          {tooltips.weight}
                        </Tooltip>
                      </Label>
                      <Input
                        id="peso"
                        name="peso"
                        type="number"
                        min="0"
                        step="any"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={`Ej: 70`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="height-label" style={{ fontSize: 13 }}>
                        Altura ({unidades[sistemaMetrico].height})
                        <span id="tooltip-height" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.height}
                          target="tooltip-height"
                          toggle={() => toggleTooltip("height")}
                        >
                          {tooltips.height}
                        </Tooltip>
                      </Label>
                      <Input
                        id="altura"
                        name="altura"
                        type="number"
                        min="0"
                        step="any"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder={`Ej: 175`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="bmi-label" style={{ fontSize: 13 }}>
                        IMC
                        <span id="tooltip-bmi" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.bmi}
                          target="tooltip-bmi"
                          toggle={() => toggleTooltip("bmi")}
                        >
                          {tooltips.bmi}
                        </Tooltip>
                      </Label>
                      <Input type="number" value={bmi} readOnly style={inputStyle} bsSize="sm" />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="bodyFat-label" style={{ fontSize: 13 }}>
                        % Grasa
                        <span id="tooltip-bodyFat" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.bodyFat}
                          target="tooltip-bodyFat"
                          toggle={() => toggleTooltip("bodyFat")}
                        >
                          {tooltips.bodyFat}
                        </Tooltip>
                      </Label>
                      <Input
                        id="grasaCorporal"
                        name="grasaCorporal"
                        type="number"
                        min="0"
                        step="any"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        placeholder={`Ej: 15`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="muscleMass-label" style={{ fontSize: 13 }}>
                        Masa Muscular
                        <span id="tooltip-muscleMass" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.muscleMass}
                          target="tooltip-muscleMass"
                          toggle={() => toggleTooltip("muscleMass")}
                        >
                          {tooltips.muscleMass}
                        </Tooltip>
                      </Label>
                      <Input
                        id="masaMuscular"
                        name="masaMuscular"
                        type="number"
                        min="0"
                        step="any"
                        value={muscleMass}
                        onChange={(e) => setMuscleMass(e.target.value)}
                        placeholder={`Ej: 30`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="waist-label" style={{ fontSize: 13 }}>
                        Cintura
                        <span id="tooltip-waist" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.waist}
                          target="tooltip-waist"
                          toggle={() => toggleTooltip("waist")}
                        >
                          {tooltips.waist}
                        </Tooltip>
                      </Label>
                      <Input
                        id="cintura"
                        name="cintura"
                        type="number"
                        min="0"
                        step="any"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        placeholder={`Ej: 80`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="hip-label" style={{ fontSize: 13 }}>
                        Caderas
                        <span id="tooltip-hip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.hip}
                          target="tooltip-hip"
                          toggle={() => toggleTooltip("hip")}
                        >
                          {tooltips.hip}
                        </Tooltip>
                      </Label>
                      <Input
                        id="caderas"
                        name="caderas"
                        type="number"
                        min="0"
                        step="any"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        placeholder={`Ej: 90`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="arms-label" style={{ fontSize: 13 }}>
                        Brazos
                        <span id="tooltip-arms" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.arms}
                          target="tooltip-arms"
                          toggle={() => toggleTooltip("arms")}
                        >
                          {tooltips.arms}
                        </Tooltip>
                      </Label>
                      <Input
                        id="brazos"
                        name="brazos"
                        type="number"
                        min="0"
                        step="any"
                        value={arms}
                        onChange={(e) => setArms(e.target.value)}
                        placeholder={`Ej: 30`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="2">
              <Form>
                <h6 className="heading-small text-muted mb-4">Indicadores de Fuerza y Resistencia</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="rmPress-label" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        1RM Press de Banca ({unidades[sistemaMetrico].rmPress})
                        <span id="tooltip-rmPress" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.rmPress}
                          target="tooltip-rmPress"
                          toggle={() => toggleTooltip("rmPress")}
                        >
                          {tooltips.rmPress}
                        </Tooltip>
                      </Label>
                      <Input
                        id="pressBanca"
                        name="pressBanca"
                        type="number"
                        min="0"
                        step="any"
                        value={rmPress}
                        onChange={(e) => setRmPress(e.target.value)}
                        placeholder={`Ej: 100 ${unidades[sistemaMetrico].rmPress}`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="rmSquat-label" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        1RM Sentadilla ({unidades[sistemaMetrico].rmSquat})
                        <span id="tooltip-rmSquat" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.rmSquat}
                          target="tooltip-rmSquat"
                          toggle={() => toggleTooltip("rmSquat")}
                        >
                          {tooltips.rmSquat}
                        </Tooltip>
                      </Label>
                      <Input
                        id="sentadilla"
                        name="sentadilla"
                        type="number"
                        min="0"
                        step="any"
                        value={rmSquat}
                        onChange={(e) => setRmSquat(e.target.value)}
                        placeholder={`Ej: 120 ${unidades[sistemaMetrico].rmSquat}`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="rmDeadlift-label" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        1RM Peso Muerto ({unidades[sistemaMetrico].rmDeadlift})
                        <span id="tooltip-rmDeadlift" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.rmDeadlift}
                          target="tooltip-rmDeadlift"
                          toggle={() => toggleTooltip("rmDeadlift")}
                        >
                          {tooltips.rmDeadlift}
                        </Tooltip>
                      </Label>
                      <Input
                        id="pesoMuerto"
                        name="pesoMuerto"
                        type="number"
                        min="0"
                        step="any"
                        value={rmDeadlift}
                        onChange={(e) => setRmDeadlift(e.target.value)}
                        placeholder={`Ej: 140 ${unidades[sistemaMetrico].rmDeadlift}`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="repetitions-label" style={{ fontSize: 13 }}>
                        Repeticiones
                        <span id="repetitions-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.repetitions}
                          target="repetitions-tooltip"
                          toggle={() => toggleTooltip("repetitions")}
                        >
                          {tooltips.repetitions}
                        </Tooltip>
                      </Label>
                      <Input
                        id="repeticiones"
                        name="repeticiones"
                        type="number"
                        min="0"
                        value={repetitions}
                        onChange={(e) => setRepetitions(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="executionSpeed-label" style={{ fontSize: 13 }}>
                        Velocidad de Ejecución (s)
                        <span id="executionSpeed-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.executionSpeed}
                          target="executionSpeed-tooltip"
                          toggle={() => toggleTooltip("executionSpeed")}
                        >
                          {tooltips.executionSpeed}
                        </Tooltip>
                      </Label>
                      <Input
                        id="velocidadEjecucion"
                        name="velocidadEjecucion"
                        type="number"
                        min="0"
                        step="any"
                        value={executionSpeed}
                        onChange={(e) => setExecutionSpeed(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="3">
              <Form>
                <h6 className="heading-small text-muted mb-4">Capacidad Aeróbica y Función Cardiovascular</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="cooperTest-label" style={{ fontSize: 13 }}>
                        Test de Cooper (m)
                        <span id="cooperTest-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.cooperTest}
                          target="cooperTest-tooltip"
                          toggle={() => toggleTooltip("cooperTest")}
                        >
                          {tooltips.cooperTest}
                        </Tooltip>
                      </Label>
                      <Input
                        id="testCooper"
                        name="testCooper"
                        type="number"
                        min="0"
                        step="any"
                        value={cooperTest}
                        onChange={(e) => setCooperTest(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="restingHeartRate-label" style={{ fontSize: 13 }}>
                        Frecuencia Cardíaca en Reposo (ppm)
                        <span id="restingHeartRate-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.restingHeartRate}
                          target="restingHeartRate-tooltip"
                          toggle={() => toggleTooltip("restingHeartRate")}
                        >
                          {tooltips.restingHeartRate}
                        </Tooltip>
                      </Label>
                      <Input
                        id="fcReposo"
                        name="fcReposo"
                        type="number"
                        min="0"
                        value={restingHeartRate}
                        onChange={(e) => setRestingHeartRate(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="recoveryHeartRate-label" style={{ fontSize: 13 }}>
                        Frecuencia de Recuperación (ppm)
                        <span id="recoveryHeartRate-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.recoveryHeartRate}
                          target="recoveryHeartRate-tooltip"
                          toggle={() => toggleTooltip("recoveryHeartRate")}
                        >
                          {tooltips.recoveryHeartRate}
                        </Tooltip>
                      </Label>
                      <Input
                        id="fcRecuperacion"
                        name="fcRecuperacion"
                        type="number"
                        min="0"
                        value={recoveryHeartRate}
                        onChange={(e) => setRecoveryHeartRate(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="aerobicDuration-label" style={{ fontSize: 13 }}>
                        Duración Aeróbica (min)
                        <span id="aerobicDuration-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.aerobicDuration}
                          target="aerobicDuration-tooltip"
                          toggle={() => toggleTooltip("aerobicDuration")}
                        >
                          {tooltips.aerobicDuration}
                        </Tooltip>
                      </Label>
                      <Input
                        id="duracionAerobica"
                        name="duracionAerobica"
                        type="number"
                        min="0"
                        step="any"
                        value={aerobicDuration}
                        onChange={(e) => setAerobicDuration(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="4">
              <Form>
                <h6 className="heading-small text-muted mb-4">Flexibilidad y Movilidad</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="flexibilityTest-label" style={{ fontSize: 13 }}>
                        Test de Flexibilidad ({unidades[sistemaMetrico].flexibilityTest})
                        <span id="tooltip-flexibilityTest" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.flexibilityTest}
                          target="tooltip-flexibilityTest"
                          toggle={() => toggleTooltip("flexibilityTest")}
                        >
                          {tooltips.flexibilityTest}
                        </Tooltip>
                      </Label>
                      <Input
                        id="testFlexibilidad"
                        name="testFlexibilidad"
                        type="number"
                        min="0"
                        step="any"
                        value={flexibilityTest}
                        onChange={(e) => setFlexibilityTest(e.target.value)}
                        placeholder={`Ej: 15 ${unidades[sistemaMetrico].flexibilityTest}`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="rangeOfMotion-label" style={{ fontSize: 13 }}>
                        Rango de Movimiento (°)
                        <span id="rangeOfMotion-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.rangeOfMotion}
                          target="rangeOfMotion-tooltip"
                          toggle={() => toggleTooltip("rangeOfMotion")}
                        >
                          {tooltips.rangeOfMotion}
                        </Tooltip>
                      </Label>
                      <Input
                        id="rangoMovimiento"
                        name="rangoMovimiento"
                        type="number"
                        min="0"
                        step="any"
                        value={rangeOfMotion}
                        onChange={(e) => setRangeOfMotion(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="5">
              <Form>
                <h6 className="heading-small text-muted mb-4">Potencia y Agilidad</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="verticalJump-label" style={{ fontSize: 13 }}>
                        Salto Vertical ({unidades[sistemaMetrico].verticalJump})
                        <span id="tooltip-verticalJump" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.verticalJump}
                          target="tooltip-verticalJump"
                          toggle={() => toggleTooltip("verticalJump")}
                        >
                          {tooltips.verticalJump}
                        </Tooltip>
                      </Label>
                      <Input
                        id="saltoVertical"
                        name="saltoVertical"
                        type="number"
                        min="0"
                        step="any"
                        value={verticalJump}
                        onChange={(e) => setVerticalJump(e.target.value)}
                        placeholder={`Ej: 40 ${unidades[sistemaMetrico].verticalJump}`}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="sprintSpeed-label" style={{ fontSize: 13 }}>
                        Velocidad en Sprints (s)
                        <span id="sprintSpeed-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.sprintSpeed}
                          target="sprintSpeed-tooltip"
                          toggle={() => toggleTooltip("sprintSpeed")}
                        >
                          {tooltips.sprintSpeed}
                        </Tooltip>
                      </Label>
                      <Input
                        id="velocidadSprint"
                        name="velocidadSprint"
                        type="number"
                        min="0"
                        step="any"
                        value={sprintSpeed}
                        onChange={(e) => setSprintSpeed(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="agilityTest-label" style={{ fontSize: 13 }}>
                        Prueba de Agilidad
                        <span id="agilityTest-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.agilityTest}
                          target="agilityTest-tooltip"
                          toggle={() => toggleTooltip("agilityTest")}
                        >
                          {tooltips.agilityTest}
                        </Tooltip>
                      </Label>
                      <Input
                        id="pruebaAgilidad"
                        name="pruebaAgilidad"
                        type="number"
                        min="0"
                        step="any"
                        value={agilityTest}
                        onChange={(e) => setAgilityTest(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="6">
              <Form>
                <h6 className="heading-small text-muted mb-4">Percepción del Esfuerzo</h6>
                <Row>
                  <Col xs="12" sm="6" md="3">
                    <FormGroup>
                      <Label id="rpe-label" style={{ fontSize: 13 }}>
                        Escala de Percepción del Esfuerzo (RPE)
                        <span id="rpe-tooltip" style={{ cursor: "pointer", color: "#11cdef", marginLeft: 5 }}>ⓘ</span>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen.rpe}
                          target="rpe-tooltip"
                          toggle={() => toggleTooltip("rpe")}
                        >
                          {tooltips.rpe}
                        </Tooltip>
                      </Label>
                      <Input
                        id="rpe"
                        name="rpe"
                        type="number"
                        min="0"
                        step="any"
                        value={rpe}
                        onChange={(e) => setRpe(e.target.value)}
                        style={inputStyle}
                        required
                        bsSize="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
          </TabContent>
          <div className="text-center mt-4">
            <Button
              color="primary"
              onClick={handleAnalizar}
              disabled={loading || !isRequiredFieldsFilled()}
            >
              {loading ? "Analizando..." : "Analizar"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default MetricsForm;
