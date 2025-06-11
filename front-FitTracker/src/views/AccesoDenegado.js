import React from "react";
import { Card, CardHeader, CardBody, Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Header from "components/Headers/Header";

const AccesoDenegado = () => {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col lg="8" md="10">
            <Card className="shadow border-0">
              <CardHeader className="bg-danger">
                <h3 className="text-white mb-0">Acceso Denegado</h3>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5 text-center">
                <div className="mb-4">
                  <i className="ni ni-lock-circle-open text-danger" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2>No tienes permisos para acceder a esta página</h2>
                <p className="mt-3">
                  Tu perfil de usuario no tiene los permisos necesarios para acceder al recurso solicitado.
                  Si crees que esto es un error, por favor contacta al administrador del sistema.
                </p>
                <Button
                  color="primary"
                  tag={Link}
                  to="/admin/index"
                  className="mt-4"
                >
                  Volver al Inicio
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AccesoDenegado;