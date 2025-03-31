/*!

=========================================================
* FitTracker - v1.0.0
=========================================================

* Product Page: https://www.fittracker.com
* Copyright 2024 Charlie Delgado & Jefferson Hidalgo
* Licensed under MIT (https://github.com/charliedelgado/fittracker/blob/master/LICENSE.md)

* Coded by Charlie Delgado & Jefferson Hidalgo

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import StatsCards from "components/Stats/StatsCards.js"; // Importamos StatsCards

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);

  // Datos para StatsCards
  const statsData = {
    totalClients: 165,
    maleClients: 90,
    femaleClients: 75,
    avgWeight: "72 kg",
    avgBodyFat: "20%",
    avgMuscleMass: "35%",
  };

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <Container fluid>
          <div className="mb-4">
            <StatsCards data={statsData} /> {/* Pasamos datos a StatsCards */}
          </div>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Demografía
                      </h6>
                      <h2 className="mb-0">Distribución de Clientes</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Gráfico */}
                  <div className="chart">
                    <Bar
                      data={{
                        labels: ["Hombres", "Mujeres"],
                        datasets: [
                          {
                            label: "Clientes",
                            data: [90, 75],
                            backgroundColor: ["#5e72e4", "#f5365c"],
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: { beginAtZero: true },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Compromiso
                      </h6>
                      <h2 className="mb-0">Frecuencia de Actualización</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Bar
                      data={{
                        labels: ["Actualizaciones Regulares", "Sin Actualizaciones"],
                        datasets: [
                          {
                            label: "Clientes",
                            data: [120, 45],
                            backgroundColor: ["#2dce89", "#f5365c"],
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: { beginAtZero: true },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Tendencias de Progreso</h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Line
                      data={{
                        labels: ["Enero", "Febrero", "Marzo", "Abril"],
                        datasets: [
                          {
                            label: "Fuerza",
                            data: [50, 60, 70, 80],
                            borderColor: "#5e72e4",
                            backgroundColor: "rgba(94, 114, 228, 0.2)",
                          },
                          {
                            label: "Resistencia",
                            data: [40, 50, 65, 75],
                            borderColor: "#2dce89",
                            backgroundColor: "rgba(45, 206, 137, 0.2)",
                          },
                          {
                            label: "Capacidad Aeróbica",
                            data: [30, 40, 55, 70],
                            borderColor: "#f5365c",
                            backgroundColor: "rgba(245, 54, 92, 0.2)",
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: { beginAtZero: true },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Comparativa de Desempeño</h3>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Métrica</th>
                      <th scope="col">Logrado</th>
                      <th scope="col">Objetivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Fuerza</th>
                      <td>80%</td> {/* Fixed closing tag */}
                      <td>90%</td>
                    </tr>
                    <tr>
                      <th scope="row">Resistencia</th>
                      <td>75%</td>
                      <td>85%</td>
                    </tr>
                    <tr>
                      <th scope="row">Capacidad Aeróbica</th>
                      <td>70%</td>
                      <td>80%</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Index;
