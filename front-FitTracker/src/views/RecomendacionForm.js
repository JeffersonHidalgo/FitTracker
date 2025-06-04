import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

const SECCIONES = [
  "Antropometria",
  "FuerzaResistencia",
  "Cardio",
  "Flexibilidad",
  "PotenciaAgilidad",
  "EsfuerzoPercibido",
];

const CONDICIONES_POR_SECCION = {
  Antropometria: [
    "Obesidad",
    "Sobrepeso",
    "Bajo peso",
    "Composición mejorable",
    "Composición corporal normal",
  ],
  FuerzaResistencia: [
    "Baja fuerza",
    "Progreso en fuerza",
    "Fatiga muscular rápida",
    "Resistencia muscular baja",
    "Fuerza adecuada",
  ],
  Cardio: [
    "Baja resistencia",
    "Alta frecuencia cardiaca",
    "Estancamiento en cardio",
    "Recuperación lenta",
    "Cardio aceptable",
  ],
  Flexibilidad: [
    "Flexibilidad limitada",
    "Rigidez lumbar",
    "Movilidad articular reducida",
    "Estiramientos insuficientes",
    "Flexibilidad óptima",
  ],
  PotenciaAgilidad: [
    "Potencia mejorable",
    "Agilidad limitada",
    "Salto bajo",
    "Coordinación deficiente",
    "Buen nivel de agilidad y potencia",
  ],
  EsfuerzoPercibido: [
    "Esfuerzo excesivo",
    "Esfuerzo insuficiente",
    "Percepción de fatiga",
    "Motivación baja",
    "Rendimiento percibido adecuado",
  ],
};

const RecomendacionForm = ({ mode, initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    seccion: "",
    condicion: "",
    recomendacion: "",
    activo: true,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        seccion: initialData.seccion || "",
        condicion: initialData.condicion || "",
        recomendacion: initialData.recomendacion || "",
        activo: initialData.activo !== undefined ? initialData.activo : true,
        id: initialData.id,
      });
    } else {
      setForm({
        seccion: "",
        condicion: "",
        recomendacion: "",
        activo: true,
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (
      form.seccion &&
      !CONDICIONES_POR_SECCION[form.seccion]?.includes(form.condicion)
    ) {
      setForm((f) => ({ ...f, condicion: "" }));
    }
  }, [form.seccion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const condicionesOptions = form.seccion
    ? CONDICIONES_POR_SECCION[form.seccion] || []
    : [];

  return (
    <Card
      className="shadow mt-4"
      style={{
        background: "#f1f3f6", // Fondo más oscuro para contraste
        borderRadius: "0.75rem",
        border: "none",
      }}
    >
      <CardBody>
        <h4
          style={{
            color: "#344767",
            fontWeight: 700,
            marginBottom: 25,
          }}
        >
          {mode === "create" ? "Crear" : "Editar"} Recomendación
        </h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label">
                  Sección <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  className="form-control-alternative"
                  type="select"
                  name="seccion"
                  value={form.seccion}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {SECCIONES.map((s) => (
                    <option key={s} value={s}>
                      {s === "Antropometria"
                        ? "Antropometría"
                        : s === "FuerzaResistencia"
                        ? "Fuerza y Resistencia"
                        : s === "Cardio"
                        ? "Aeróbico / Cardio"
                        : s === "PotenciaAgilidad"
                        ? "Potencia y Agilidad"
                        : s === "EsfuerzoPercibido"
                        ? "Esfuerzo Percibido"
                        : s}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label">
                  Condición <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  className="form-control-alternative"
                  type="select"
                  name="condicion"
                  value={form.condicion}
                  onChange={handleChange}
                  required
                  disabled={!form.seccion}
                >
                  <option value="">Seleccione...</option>
                  {condicionesOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label className="form-control-label">
                  Recomendación <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  className="form-control-alternative"
                  type="textarea"
                  name="recomendacion"
                  value={form.recomendacion}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Escribe la recomendación aquí..."
                />
              </FormGroup>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md="6">
              <FormGroup check className="mt-2">
                <Label check className="form-control-label">
                  <Input
                    type="checkbox"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                  />{" "}
                  Activo
                </Label>
              </FormGroup>
            </Col>
            <Col md="6" className="text-right">
              <Button
                color="success"
                type="submit"
                className="mr-2"
                style={{ minWidth: 110 }}
              >
                Guardar
              </Button>
              <Button
                color="secondary"
                onClick={onCancel}
                style={{ minWidth: 110 }}
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default RecomendacionForm;