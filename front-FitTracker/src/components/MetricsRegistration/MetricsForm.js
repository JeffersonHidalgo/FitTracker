import React, { useState } from "react";
import { Card, CardHeader, CardBody, Form, Row, Col, FormGroup, Input, Button } from "reactstrap";

const MetricsForm = () => {
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

  const calculateMetrics = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBmi);
    }
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-white border-0">
        <h3 className="mb-0" style={{ color: "#4A628A" }}>
          Registro de Métricas
        </h3>
      </CardHeader>
      <CardBody>
        <Form>
          <h6 className="heading-small text-muted mb-4">Datos Antropométricos y Composición Corporal</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Peso (kg)</label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Altura (cm)</label>
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>IMC</label>
                <Input type="number" value={bmi} readOnly />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>% Grasa Corporal</label>
                <Input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Masa Muscular (kg)</label>
                <Input type="number" value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Cintura (cm)</label>
                <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Caderas (cm)</label>
                <Input type="number" value={hip} onChange={(e) => setHip(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Brazos (cm)</label>
                <Input type="number" value={arms} onChange={(e) => setArms(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="heading-small text-muted mb-4">Indicadores de Fuerza y Resistencia</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>1RM Press de Banca (kg)</label>
                <Input type="number" value={rmPress} onChange={(e) => setRmPress(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>1RM Sentadilla (kg)</label>
                <Input type="number" value={rmSquat} onChange={(e) => setRmSquat(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>1RM Peso Muerto (kg)</label>
                <Input type="number" value={rmDeadlift} onChange={(e) => setRmDeadlift(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Repeticiones</label>
                <Input type="number" value={repetitions} onChange={(e) => setRepetitions(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Velocidad de Ejecución (s)</label>
                <Input type="number" value={executionSpeed} onChange={(e) => setExecutionSpeed(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="heading-small text-muted mb-4">Capacidad Aeróbica y Función Cardiovascular</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Test de Cooper (m)</label>
                <Input type="number" value={cooperTest} onChange={(e) => setCooperTest(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Frecuencia Cardíaca en Reposo (ppm)</label>
                <Input type="number" value={restingHeartRate} onChange={(e) => setRestingHeartRate(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Frecuencia de Recuperación (ppm)</label>
                <Input type="number" value={recoveryHeartRate} onChange={(e) => setRecoveryHeartRate(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Duración Aeróbica (min)</label>
                <Input type="number" value={aerobicDuration} onChange={(e) => setAerobicDuration(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="heading-small text-muted mb-4">Flexibilidad y Movilidad</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Test de Flexibilidad (cm)</label>
                <Input type="number" value={flexibilityTest} onChange={(e) => setFlexibilityTest(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Rango de Movimiento (°)</label>
                <Input type="number" value={rangeOfMotion} onChange={(e) => setRangeOfMotion(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="heading-small text-muted mb-4">Potencia y Agilidad</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Salto Vertical (cm)</label>
                <Input type="number" value={verticalJump} onChange={(e) => setVerticalJump(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Velocidad en Sprints (s)</label>
                <Input type="number" value={sprintSpeed} onChange={(e) => setSprintSpeed(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label>Prueba de Agilidad</label>
                <Input type="number" value={agilityTest} onChange={(e) => setAgilityTest(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="heading-small text-muted mb-4">Percepción del Esfuerzo</h6>
          <Row>
            <Col md="4">
              <FormGroup>
                <label>Escala de Percepción del Esfuerzo (RPE)</label>
                <Input type="number" value={rpe} onChange={(e) => setRpe(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button color="primary" onClick={calculateMetrics}>
              Calcular
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MetricsForm;
