import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Header from "components/Headers/Header.js";
import ClientInfo from "components/MetricsRegistration/ClientInfo";
import MetricsForm from "components/MetricsRegistration/MetricsForm";
import ResultsSection from "components/MetricsRegistration/ResultsSection";

const MetricsRegistration = () => {
  const [result, setResult] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleLimpiar = () => {
    setSelectedCliente(null);
    setResult(null);
  };

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="10" lg="12">
              <Card className="shadow mb-4">
                <CardHeader className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0" style={{ color: "#4A628A" }}>
                      Registro de Métricas
                    </h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <ClientInfo
                    selectedCliente={selectedCliente}
                    setSelectedCliente={setSelectedCliente}
                    onLimpiar={handleLimpiar}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xl="10" lg="12">
              {selectedCliente && selectedCliente.estado === "A" ? (
                
                    <MetricsForm
                      codigoCli={selectedCliente?.id || selectedCliente?.codigoCli}
                      onResult={setResult}
                      result={result}
                    />
                  
              ) : selectedCliente ? (
                <div className="alert alert-warning text-center">
                  El cliente seleccionado no está activo. No es posible registrar
                  métricas.
                </div>
              ) : null}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xl="10" lg="12">
              {result && (
                
                    <ResultsSection result={result} />
                  
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MetricsRegistration;
