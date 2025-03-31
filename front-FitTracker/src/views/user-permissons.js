import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  Table,
  Container,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const UserForm = () => (
  <Card className="bg-secondary shadow" style={{ minHeight: "400px" }}>
    <CardHeader className="bg-white border-0">
      <Row className="align-items-center">
        <Col xs="8">
          <h3 className="mb-0" style={{ color: "#4A628A" }}>
            Gestión de Usuarios
          </h3>
        </Col>
        <Col className="text-right d-flex justify-content-end" xs="4">
          <Button
            color="primary"
            size="sm"
            className="mr-2"
            style={{ padding: "10px 20px" }}
          >
            Nuevo
          </Button>
          <Button
            color="info"
            size="sm"
            className="mr-2"
            style={{ padding: "10px 20px" }}
          >
            Modificar
          </Button>
          <Button
            color="success"
            size="sm"
            style={{ padding: "10px 20px" }}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </CardHeader>
    <CardBody>
      <Form>
        <Row>
          <Col md="4">
            <FormGroup>
              <label className="form-control-label">Código</label>
              <Input
                className="form-control-alternative"
                placeholder="Código"
                type="text"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <label className="form-control-label">Usuario</label>
              <Input
                className="form-control-alternative"
                placeholder="Usuario"
                type="text"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <label className="form-control-label">Nombre</label>
              <Input
                className="form-control-alternative"
                placeholder="Nombre"
                type="text"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label className="form-control-label">Contraseña</label>
              <Input
                className="form-control-alternative"
                placeholder="Contraseña"
                type="password"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label className="form-control-label">
                Repetir Contraseña
              </label>
              <Input
                className="form-control-alternative"
                placeholder="Repetir Contraseña"
                type="password"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label className="form-control-label">Email</label>
              <Input
                className="form-control-alternative"
                placeholder="Email"
                type="email"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label className="form-control-label">Rol</label>
              <Input
                className="form-control-alternative"
                type="select"
              >
                <option>Administrador</option>
                <option>Usuario Normal</option>
                <option>Invitado</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </CardBody>
  </Card>
);

const UserList = () => (
  <Card className="shadow">
    <CardHeader className="bg-white border-0">
      <h3 className="mb-0" style={{ color: "#4A628A" }}>
        Lista de Usuarios
      </h3>
    </CardHeader>
    <CardBody>
      <FormGroup>
        <Input
          className="form-control-alternative"
          placeholder="Buscar usuarios..."
          type="text"
        />
      </FormGroup>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>Código</th>
            <th>Usuario</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>admin</td>
            <td>
              <span className="badge badge-primary">
                Administrador
              </span>
            </td>
          </tr>
          {/* Más filas según sea necesario */}
        </tbody>
      </Table>
    </CardBody>
  </Card>
);

const ScreenAccessList = () => (
  <Card className="shadow">
    <CardHeader className="bg-white border-0">
      <h3 className="mb-0" style={{ color: "#4A628A" }}>
        Acceso a Pantallas
      </h3>
    </CardHeader>
    <CardBody>
      <FormGroup>
        <Input
          className="form-control-alternative"
          placeholder="Buscar pantallas..."
          type="text"
        />
      </FormGroup>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>Pantalla</th>
            <th>Descripción</th>
            <th>Acceso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dashboard</td>
            <td>Panel principal</td>
            <td>
              <Input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Reportes</td>
            <td>Generación de reportes</td>
            <td>
              <Input type="checkbox" />
            </td>
          </tr>
          {/* Más filas según sea necesario */}
        </tbody>
      </Table>
    </CardBody>
  </Card>
);

const UserPermissionsNew = () => {
  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="12" lg="12">
              <UserForm />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xl="6" lg="6">
              <UserList />
            </Col>
            <Col xl="6" lg="6">
              <ScreenAccessList />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserPermissionsNew;
