import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

const StatsCards = ({ data }) => {
  return (
    <Row>
      <Col lg="3" md="6">
        <Card className="card-stats mb-4 mb-lg-0 shadow-lg">
          <CardBody className="text-center">
            <div className="icon icon-shape bg-primary text-white rounded-circle mb-3">
              <i className="ni ni-circle-08"></i>
            </div>
            <h5 className="card-title text-uppercase text-muted mb-0">
              Total de Clientes
            </h5>
            <span className="h2 font-weight-bold mb-0">{data.totalClients}</span>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" md="6">
        <Card className="card-stats mb-4 mb-lg-0 shadow-lg">
          <CardBody className="text-center">
            <div className="icon icon-shape bg-info text-white rounded-circle mb-3">
              <i className="ni ni-single-02"></i>
            </div>
            <h5 className="card-title text-uppercase text-muted mb-0">
              Clientes Hombres
            </h5>
            <span className="h2 font-weight-bold mb-0">{data.maleClients}</span>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" md="6">
        <Card className="card-stats mb-4 mb-lg-0 shadow-lg">
          <CardBody className="text-center">
            <div className="icon icon-shape bg-danger text-white rounded-circle mb-3">
              <i className="ni ni-female"></i>
            </div>
            <h5 className="card-title text-uppercase text-muted mb-0">
              Clientes Mujeres
            </h5>
            <span className="h2 font-weight-bold mb-0">{data.femaleClients}</span>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" md="6">
        <Card className="card-stats mb-4 mb-lg-0 shadow-lg">
          <CardBody className="text-center">
            <div className="icon icon-shape bg-success text-white rounded-circle mb-3">
              <i className="ni ni-chart-bar-32"></i>
            </div>
            <h5 className="card-title text-uppercase text-muted mb-0">
              Peso Promedio
            </h5>
            <span className="h2 font-weight-bold mb-0">{data.avgWeight}</span>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
