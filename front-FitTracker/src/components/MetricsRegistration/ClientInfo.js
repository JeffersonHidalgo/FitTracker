import React from "react";
import { Card, CardHeader, CardBody, Row, Col, Button, FormGroup, Input } from "reactstrap";

const ClientInfo = ({ toggleModal }) => {
  const clientData = {
    name: "John Doe",
    id: "001",
    age: 30,
    gender: "Masculino",
    email: "johndoe@example.com",
    phone: "+123456789",
    address: "123 Main St, City, Country",
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h3 className="mb-0" style={{ color: "#4A628A" }}>
          Información del Cliente
        </h3>
        <Button
          color="primary"
          size="sm"
          style={{ padding: "8px 16px", fontSize: "14px" }}
          onClick={toggleModal}
        >
          Buscar Cliente
        </Button>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>Nombre</label>
              <Input type="text" value={clientData.name} readOnly />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Identificación</label>
              <Input type="text" value={clientData.id} readOnly />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>Edad</label>
              <Input type="number" value={clientData.age} readOnly />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Género</label>
              <Input type="text" value={clientData.gender} readOnly />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>Correo Electrónico</label>
              <Input type="email" value={clientData.email} readOnly />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Teléfono</label>
              <Input type="text" value={clientData.phone} readOnly />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Dirección</label>
              <Input type="text" value={clientData.address} readOnly />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ClientInfo;
