import React, { useState } from "react";
import {  Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import SearchModal from "components/SearchModal";
import ClientInfo from "components/MetricsRegistration/ClientInfo";
import MetricsForm from "components/MetricsRegistration/MetricsForm";
import ResultsSection from "components/MetricsRegistration/ResultsSection";

const MetricsRegistration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSearch = (query) => {
    // Simulate search results
    setSearchResults([
      { id: "001", name: "John Doe", status: "Activo" },
      { id: "002", name: "Jane Smith", status: "Inactivo" },
    ]);
  };

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="10" lg="12">
              <ClientInfo toggleModal={toggleModal} />
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col xl="10" lg="12">
              <MetricsForm />
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col xl="10" lg="12">
              <ResultsSection />
            </Col>
          </Row>
        </Container>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSearch={handleSearch}
        results={searchResults}
      />
    </>
  );
};

export default MetricsRegistration;
