import React, { useState } from "react";
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
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const ClientForm = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [phones, setPhones] = useState([{ number: "", type: "", description: "" }]);
  const [emails, setEmails] = useState([{ email: "", description: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const addPhone = () => setPhones([...phones, { number: "", type: "", description: "" }]);
  const removePhone = (index) => setPhones(phones.filter((_, i) => i !== index));
  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  const addEmail = () => setEmails([...emails, { email: "", description: "" }]);
  const removeEmail = (index) => setEmails(emails.filter((_, i) => i !== index));
  const handleEmailChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSearch = () => {
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
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8" className="d-flex align-items-center">
                      <h3 className="mb-0" style={{ color: "#4A628A" }}>
                        Gestión de Cliente
                      </h3>
                    </Col>
                    <Col className="text-right d-flex justify-content-end">
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
                        color="warning"
                        size="sm"
                        className="mr-2" // Add margin-right for consistent spacing
                        style={{ padding: "10px 20px" }}
                        onClick={toggleModal}
                      >
                        Consultar Cliente
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    <Button
                      color={activeTab === "basic" ? "primary" : "secondary"}
                      size="sm"
                      className="mr-2"
                      onClick={() => setActiveTab("basic")}
                    >
                      Información Básica
                    </Button>
                    <Button
                      color={activeTab === "contact" ? "primary" : "secondary"}
                      size="sm"
                      className="mr-2"
                      onClick={() => setActiveTab("contact")}
                    >
                      Contacto
                    </Button>
                    <Button
                      color={activeTab === "extras" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setActiveTab("extras")}
                    >
                      Extras
                    </Button>
                  </div>
                  {activeTab === "basic" && (
                    <Form>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Código</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Código"
                              type="text"
                              readOnly
                              value="001"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Nombre</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Nombre completo"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Estado</label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                            >
                              <option>Activo</option>
                              <option>Inactivo</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Fecha de Nacimiento
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="date"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Género</label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                            >
                              <option>Masculino</option>
                              <option>Femenino</option>
                              <option>Otro</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  )}
                  {activeTab === "contact" && (
                    <Form>
                      <h4>Correos Electrónicos</h4>
                      {emails.map((email, index) => (
                        <Row key={index}>
                          <Col md="5">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Correo electrónico"
                                type="email"
                                value={email.email}
                                onChange={(e) =>
                                  handleEmailChange(index, "email", e.target.value)
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md="5">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Descripción"
                                type="text"
                                value={email.description}
                                onChange={(e) =>
                                  handleEmailChange(index, "description", e.target.value)
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => removeEmail(index)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button color="success" size="sm" onClick={addEmail}>
                        Agregar Correo
                      </Button>
                      <hr />
                      <h4>Teléfonos</h4>
                      {phones.map((phone, index) => (
                        <Row key={index}>
                          <Col md="4">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Número de teléfono"
                                type="tel"
                                value={phone.number}
                                onChange={(e) =>
                                  handlePhoneChange(index, "number", e.target.value)
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                type="select"
                                value={phone.type}
                                onChange={(e) =>
                                  handlePhoneChange(index, "type", e.target.value)
                                }
                              >
                                <option value="">Tipo</option>
                                <option value="Móvil">Móvil</option>
                                <option value="Casa">Casa</option>
                                <option value="Trabajo">Trabajo</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Descripción"
                                type="text"
                                value={phone.description}
                                onChange={(e) =>
                                  handlePhoneChange(index, "description", e.target.value)
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => removePhone(index)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button color="success" size="sm" onClick={addPhone}>
                        Agregar Teléfono
                      </Button>
                    </Form>
                  )}
                  {activeTab === "extras" && (
                    <Form>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Dirección</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Dirección"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Tipo de Membresía
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Ej. Premium"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Fecha de Inicio de Membresía
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="date"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Contacto de Emergencia
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Nombre y Teléfono"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Consultar Cliente</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Input
                type="text"
                placeholder="Buscar por nombre o código"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" size="sm" onClick={handleSearch}>
              Buscar
            </Button>
          </Form>
          <Table className="mt-3" responsive>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.name}</td>
                  <td>{result.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ClientForm;
