import React from "react";
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap";
import { Bar, Line } from "react-chartjs-2";

const ResultsSection = () => {
  const results = {
    bmi: 24.5,
    bodyFat: 18.2,
    muscleMass: 55.3,
    cooperTest: 2400,
    verticalJump: 50,
    rpe: 7.5,
  };

  const trainingRecommendations = [
    "Increase aerobic training to improve Cooper Test results.",
    "Focus on strength training to enhance muscle mass.",
    "Incorporate flexibility exercises to improve mobility.",
    "Monitor RPE to avoid overtraining.",
  ];

  const sendResultsByEmail = () => {
    // Simulate sending results via email
    alert("Results have been sent to the registered email address.");
  };

  const barChartData = {
    labels: ["BMI", "Body Fat (%)", "Muscle Mass (kg)", "Cooper Test (m)", "Vertical Jump (cm)", "RPE"],
    datasets: [
      {
        label: "Results",
        data: [results.bmi, results.bodyFat, results.muscleMass, results.cooperTest, results.verticalJump, results.rpe],
        backgroundColor: ["#5e72e4", "#2dce89", "#f5365c", "#11cdef", "#fb6340", "#8965e0"],
      },
    ],
  };

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Progress Over Time",
        data: [23.5, 24.0, 24.3, 24.5], // Example data
        borderColor: "#5e72e4",
        fill: false,
      },
    ],
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-white border-0">
        <h3 className="mb-0" style={{ color: "#4A628A" }}>
          Resultados y Recomendaciones
        </h3>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="6">
            <h5>Resultados en Gráficos</h5>
            <Bar data={barChartData} />
          </Col>
          <Col md="6">
            <h5>Progreso en el Tiempo</h5>
            <Line data={lineChartData} />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h5>Recomendaciones de Entrenamiento</h5>
            <ul>
              {trainingRecommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Button color="primary" onClick={sendResultsByEmail}>
            Enviar Resultados por Correo
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ResultsSection;
