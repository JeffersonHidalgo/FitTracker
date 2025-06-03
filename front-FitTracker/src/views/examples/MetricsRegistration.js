import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import ClientInfo from "components/MetricsRegistration/ClientInfo";
import MetricsForm from "components/MetricsRegistration/MetricsForm";
import ResultsSection from "components/MetricsRegistration/ResultsSection";

const MetricsRegistration = () => {
  const [result, setResult] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="10" lg="12">
              <ClientInfo
                selectedCliente={selectedCliente}
                setSelectedCliente={setSelectedCliente}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col xl="10" lg="12">
              <MetricsForm
                codigoCli={selectedCliente?.id || selectedCliente?.codigoCli}
                onResult={setResult}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col xl="10" lg="12">
              <ResultsSection result={result} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MetricsRegistration;
