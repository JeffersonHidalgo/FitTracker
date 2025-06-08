import React, { useState } from "react";
import {
  Card, CardHeader, CardBody, Row, Col, Button, FormGroup, Input, Modal, ModalHeader, ModalBody, Table, Form
} from "reactstrap";
import { obtenerClientes, obtenerDetalleCliente } from "../../services/clienteService";
import FotoUploader from "../FotoUploader";
import { API_ROOT } from "../../services/apiClient";
import CustomAlert from "components/CustomAlert"; // Asegúrate de importar
import ClienteSelectorModal from "components/ClienteSelectorModal";

const ClientInfo = ({ selectedCliente, setSelectedCliente, onLimpiar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [alert, setAlert] = useState({ isOpen: false, color: "danger", message: "" });

  const showAlert = (color, message) => {
    setAlert({ isOpen: true, color, message });
    setTimeout(() => setAlert(a => ({ ...a, isOpen: false })), 3500);
  };

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && clientes.length === 0) {
      try {
        const data = await obtenerClientes();
        setClientes(data);
        setSearchResults(data);
      } catch (e) {
        showAlert("danger", "Error al cargar clientes");
      }
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const filtered = clientes.filter(
      c =>
        (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(value.toLowerCase())) ||
        (c.codigoCli && c.codigoCli.toString().includes(value))
    );
    setSearchResults(filtered);
  };

  const handleSelectCliente = async (codigoCli) => {
    try {
      const detalle = await obtenerDetalleCliente(codigoCli);
      const clienteObj = {
        name: detalle.nombreCompleto || "",
        id: detalle.codigoCli || "",
        age: detalle.fechaNacimiento ? (new Date().getFullYear() - new Date(detalle.fechaNacimiento).getFullYear()) : "",
        gender: detalle.genero === "M" ? "Masculino" : detalle.genero === "F" ? "Femenino" : "Otro",
        email: (detalle.emails && detalle.emails[0]?.email) || "",
        phone: (detalle.telefonos && detalle.telefonos[0]?.numero) || "",
        address: `${detalle.calle || ""}, ${detalle.ciudad || ""}, ${detalle.provincia || ""}`,
        fotoPerfil: detalle.fotoPerfil
          ? `${API_ROOT}/imagen-cliente/${detalle.fotoPerfil}`
          : null,
        estado: detalle.estado // <-- Agrega esto
      };
      setSelectedCliente(clienteObj);
      setIsModalOpen(false);
    } catch (e) {
      showAlert("danger", "No se pudo cargar el cliente");
    }
  };

  return (
    <Card className="shadow">
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert(a => ({ ...a, isOpen: false }))}
      />
      <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h3 className="mb-0" style={{ color: "#4A628A" }}>
          Información del Cliente
        </h3>
        <div>
          <Button
            color="info"
            size="md"
            style={{
              padding: "6px 18px",
              minWidth: 100,
              backgroundColor: "#11cdef",
              borderColor: "#11cdef",
              color: "#fff"
            }}
            onClick={toggleModal}
            className="mr-2"
          >
            Consultar Cliente
          </Button>
          <Button
            color="danger"
            size="md"
            style={{ padding: "6px 18px", minWidth: 100 }}
            onClick={onLimpiar}
          >
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="3" className="d-flex align-items-center justify-content-center">
            <div style={{ width: 110 }}>
              <FotoUploader
                value={
                  selectedCliente?.fotoPerfil
                    ? { url: selectedCliente.fotoPerfil }
                    : undefined
                }
                disabled={true} // Solo consulta, no editable
              />
            </div>
          </Col>
          <Col md="9">
            <Row>
              <Col xs="6" sm="4" md="3">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Código</label>
                  <Input
                    type="text"
                    value={selectedCliente?.id || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs="6" sm="8" md="9">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Nombre</label>
                  <Input
                    type="text"
                    value={selectedCliente?.name || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="4" md="3">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Edad</label>
                  <Input
                    type="text"
                    value={
                      selectedCliente?.age
                        ? `${selectedCliente.age} años`
                        : ""
                    }
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs="6" sm="4" md="3">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Género</label>
                  <Input
                    type="text"
                    value={selectedCliente?.gender || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs="12" sm="4" md="6">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Teléfono</label>
                  <Input
                    type="text"
                    value={selectedCliente?.phone || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Correo Electrónico</label>
                  <Input
                    type="email"
                    value={selectedCliente?.email || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs="12" sm="6">
                <FormGroup>
                  <label style={{ fontSize: 13 }}>Dirección</label>
                  <Input
                    type="text"
                    value={selectedCliente?.address || ""}
                    readOnly
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>

      <ClienteSelectorModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        onSelect={handleSelectCliente}
      />
    </Card>
  );
};

export default ClientInfo;
