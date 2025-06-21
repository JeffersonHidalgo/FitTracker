import React, { useState, useEffect } from "react";
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import Header from "components/Headers/Header.js";
import CustomAlert from "components/CustomAlert";
import Loading from "components/Loading";
import {
  obtenerClientes,
  obtenerDetalleCliente,
  insertarCliente,
  actualizarCliente,
  subirFotoCliente // <-- Agrega la importación
} from "../services/clienteService";
import rdData from "../assets/rd.json"; // Ajusta la ruta si es necesario
import FotoUploader from "components/FotoUploader";
import InputMask from "react-input-mask";
import { API_ROOT } from "../services/apiClient"; // Asegúrate de que esta ruta sea correct
import ClienteSelectorModal from "components/ClienteSelectorModal";

// Obtener fecha actual en formato YYYY-MM-DD para establecer valores por defecto y límites
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ClientForm = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [phones, setPhones] = useState([{ numero: "", tipo: "", descripcion: "", principal: false }]);
  const [emails, setEmails] = useState([{ email: "", descripcion: "", principal: false }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [form, setForm] = useState({
    codigoCli: "",
    nombreCompleto: "",
    estado: "A", // <-- Cambia aquí
    fechaNacimiento: "",
    genero: "",
    calle: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    tipoMembresia: "Básica",  // Establecer Básica por defecto
    fechaInicio: getCurrentDate(),  // Fecha actual por defecto
    fotoPerfil: "",
    contactoEmergencia: "",
    fechaCrea: "",
    fechaModifica: "",
    usuModifica: "",
  });
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [insertMode, setInsertMode] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [alert, setAlert] = useState({
    isOpen: false,
    color: "success",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const provinciasRD = rdData.provincias.map(p => p.nombre);

  const PAGE_SIZE = 8; // Puedes ajustar el tamaño de página

  const addPhone = () => setPhones([...phones, { numero: "", tipo: "", descripcion: "", principal: false }]);
  const removePhone = (index) => setPhones(phones.filter((_, i) => i !== index));
  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  const addEmail = () => setEmails([...emails, { email: "", descripcion: "", principal: false }]);
  const removeEmail = (index) => setEmails(emails.filter((_, i) => i !== index));
  const handleEmailChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
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
    setCurrentPage(1);
    const filtered = clientes.filter(
      c =>
        (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(value.toLowerCase())) ||
        (c.codigoCli && c.codigoCli.toString().includes(value))
    );
    setSearchResults(filtered);
  };

  const validarFormulario = () => {
    // Validar campos básicos obligatorios
    if (
      !form.nombreCompleto ||
      !form.estado ||
      !form.fechaNacimiento ||
      !form.genero ||
      !form.provincia ||
      !form.ciudad ||
      !form.calle
    ) {
      showAlert("warning", "Por favor complete todos los datos básicos obligatorios.");
      return false;
    }
    // Al menos un teléfono o correo válido
    const tieneTelefono = phones.some(
      p => p.numero && /^\d{3}-\d{3}-\d{4}$/.test(p.numero)
    );
    const tieneEmail = emails.some(
      e => e.email && /\S+@\S+\.\S+/.test(e.email)
    );
    if (!tieneTelefono && !tieneEmail) {
      showAlert("warning", "Debe ingresar al menos un teléfono válido o un correo electrónico válido.");
      return false;
    }
    // Validar formato de emails
    for (const e of emails) {
      if (e.email && !/\S+@\S+\.\S+/.test(e.email)) {
        showAlert("warning", `El correo "${e.email}" no es válido.`);
        return false;
      }
    }
    // Validar formato de teléfonos
    for (const p of phones) {
      if (
        p.numero &&
        !/^\d{3}-\d{3}-\d{4}$/.test(p.numero)
      ) {
        showAlert("warning", `El teléfono "${p.numero}" no es válido. Debe tener el formato 000-000-0000.`);
        return false;
      }
    }
    return true;
  };

  const showAlert = (color, message) => {
    setAlert({ isOpen: true, color, message });
    setTimeout(() => setAlert(a => ({ ...a, isOpen: false })), 3500);
  };

  const handleInsertar = async () => {
    if (!validarFormulario()) return;
    setLoading(true);
    try {
      const {
        codigoCli,
        ...restForm
      } = form;

      const tipoMembresiaValida = ["Premium", "Oferta", "Básica"].includes(form.tipoMembresia)
        ? form.tipoMembresia
        : "Básica";

      // Insertar cliente sin fotoPerfil
      const cliente = {
        ...restForm,
        estado: form.estado,
        fotoPerfil: "Nhay.jpg", // o "" si tu backend lo permite
        tipoMembresia: tipoMembresiaValida,
        fechaNacimiento: form.fechaNacimiento ? `${form.fechaNacimiento}T00:00:00` : null,
        fechaInicio: form.fechaInicio ? `${form.fechaInicio}T00:00:00` : null,
        fechaCrea: form.fechaCrea ? form.fechaCrea : new Date().toISOString(),
        fechaModifica: form.fechaModifica ? form.fechaModifica : new Date().toISOString(),
        usuModifica: form.usuModifica ? Number(form.usuModifica) : 1,
        codigoPostal: form.codigoPostal || "00000",
        contactoEmergencia: form.contactoEmergencia || "No especificado",
        emails: emails.map(e => ({
          email: e.email,
          descripcion: e.descripcion,
          principal: e.principal === true || e.principal === "S" ? "S" : "N"
        })),
        telefonos: phones.map((t, idx) => ({
          ...t,
          principal: idx === 0 ? "S" : "N"
        })),
      };

      // Para depuración, imprime los datos enviados
      console.log("Insertando cliente:", cliente);

      const res = await insertarCliente(cliente);
      const nuevoCodigo = res?.codigoCli || res?.id || res;
      
      console.log("Cliente insertado con código:", nuevoCodigo);
      
      // Subir foto si hay archivo
      if (foto && foto.file && nuevoCodigo) {
        console.log("Subiendo foto para cliente nuevo:", foto.file);
        try {
          const resultado = await subirFotoCliente(nuevoCodigo, foto.file);
          console.log("Foto subida exitosamente:", resultado);
          
          // Actualizar cliente con el nombre de la foto
          if (resultado && resultado.nombreArchivo) {
            await actualizarCliente({
              ...cliente,
              codigoCli: nuevoCodigo,
              fotoPerfil: resultado.nombreArchivo
            });
            
            // AÑADIR ESTO: Actualizar el estado de la foto con la URL correcta
            setFoto({
              preview: `${API_ROOT}/api/cliente/imagen/${resultado.nombreArchivo}`,
              nombreArchivo: resultado.nombreArchivo,
              url: `${API_ROOT}/api/cliente/imagen/${resultado.nombreArchivo}`
            });
          }
        } catch (fotoError) {
          console.error("Error al subir foto:", fotoError);
          showAlert("warning", "Cliente guardado pero hubo un problema al subir la foto");
        }
      } else {
        console.log("No hay foto para subir o falta código de cliente:", {
          hayFoto: !!foto,
          hayFile: !!(foto && foto.file),
          codigo: nuevoCodigo
        });
      }
      
      showAlert("success", "Cliente insertado correctamente");
      setInsertMode(false);

      if (nuevoCodigo) {
        await handleSelectCliente(nuevoCodigo);
      } else {
        setSelectedCliente(null);
      }
    } catch (e) {
      showAlert("danger", "Error al insertar cliente");
      console.error("Error al insertar cliente:", e?.response?.data?.errors || e);
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    if (!validarFormulario()) return;
    if (!selectedCliente) return;
    setLoading(true);
    try {
      const tipoMembresiaValida = ["Premium", "Oferta", "Básica"].includes(form.tipoMembresia)
        ? form.tipoMembresia
        : "Básica";

      let fotoPerfilFinal = form.fotoPerfil || "";

      // Si hay nueva foto, súbela primero y usa el nombre retornado
      if (foto && foto.file && form.codigoCli) {
        console.log("Subiendo foto para cliente existente:", foto.file);
        try {
          const resultado = await subirFotoCliente(form.codigoCli, foto.file);
          console.log("Foto subida exitosamente:", resultado);
          fotoPerfilFinal = resultado?.nombreArchivo || fotoPerfilFinal;
        } catch (fotoError) {
          console.error("Error al subir foto:", fotoError);
          showAlert("warning", "Cliente actualizado pero hubo un problema al subir la foto");
        }
      }

      const cliente = {
        ...form,
        codigoCli: Number(form.codigoCli),
        fotoPerfil: fotoPerfilFinal,
        estado: form.estado,
        tipoMembresia: tipoMembresiaValida,
        emails: emails.map(e => ({
          ...e,
          principal: e.principal === true || e.principal === "S" ? "S" : "N"
        })),
        telefonos: phones.map(t => ({
          ...t,
          principal: t.principal === true || t.principal === "S" ? "S" : "N"
        })),
      };

      await actualizarCliente(cliente);
      showAlert("success", "Cliente modificado correctamente");
      setEditMode(false);

      await handleSelectCliente(form.codigoCli);
    } catch (e) {
      showAlert("danger", "Error al modificar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCliente = async (codigoCli) => {
    try {
      const detalle = await obtenerDetalleCliente(codigoCli);
      // Busca los municipios de la provincia seleccionada
      const provObj = rdData.provincias.find(p => p.nombre === (detalle.provincia ?? ""));
      const municipiosList = provObj ? provObj.municipios : [];
      setMunicipios(municipiosList);

      // Si la ciudad del cliente no está en la lista, déjala vacía
      const ciudadValida = municipiosList.includes(detalle.ciudad) ? detalle.ciudad : "";

      setForm({
        codigoCli: detalle.codigoCli ?? "",
        nombreCompleto: detalle.nombreCompleto ?? "",
        estado: detalle.estado ?? "A", // <-- Siempre "A" o "I"
        fechaNacimiento: detalle.fechaNacimiento ? detalle.fechaNacimiento.substring(0, 10) : "",
        genero: detalle.genero ?? "",
        calle: detalle.calle ?? "",
        ciudad: ciudadValida,
        provincia: detalle.provincia ?? "",
        codigoPostal: detalle.codigoPostal ?? "",
        tipoMembresia: detalle.tipoMembresia ?? "",
        fechaInicio: detalle.fechaInicio ? detalle.fechaInicio.substring(0, 10) : "",
        fotoPerfil: detalle.fotoPerfil ?? "",
        contactoEmergencia: detalle.contactoEmergencia ?? "",
        fechaCrea: detalle.fechaCrea ?? "",
        fechaModifica: detalle.fechaModifica ?? "",
        usuModifica: detalle.usuModifica ?? "",
      });
      setEmails((detalle.emails || []).map(e => ({
        ...e,
        principal: e.principal === "S"
      })));
      setPhones((detalle.telefonos || []).map(t => ({
        ...t,
        principal: t.principal === "S"
      })));
      // Si hay foto en el backend, muéstrala, si no, limpia
      if (detalle.fotoPerfil) {
        setFoto({
          preview: `${API_ROOT}/imagen-cliente/${detalle.fotoPerfil}`,
          nombreArchivo: detalle.fotoPerfil,
          url: `${API_ROOT}/imagen-cliente/${detalle.fotoPerfil}`
        });
      } else {
        setFoto(null);
      }

      setSelectedCliente(detalle);
      setIsModalOpen(false);
    } catch (e) {
      showAlert("danger", "No se pudo cargar el cliente");
    }
  };

  const handleProvinciaChange = (provincia) => {
    setForm({ ...form, provincia, ciudad: "" });
    const provObj = rdData.provincias.find(p => p.nombre === provincia);
    setMunicipios(provObj ? provObj.municipios : []);
  };

  // En el useEffect inicial para cargar los valores por defecto al inicio
  useEffect(() => {
    // Establecer valores iniciales por defecto cuando se monta el componente
    setForm(prevForm => ({
      ...prevForm,
      tipoMembresia: "Básica",
      fechaInicio: getCurrentDate(),
      estado: "A"
    }));
  }, []);

  // También mejorar la validación en handleInputChange para fechas
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para fechas
    if ((name === 'fechaNacimiento' || name === 'fechaInicio') && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
      
      if (selectedDate > today) {
        // Si es fecha futura, mantener el valor anterior
        showAlert("warning", "No se permiten fechas futuras");
        return;
      }
    }
    
    setForm({ ...form, [name]: value });
  };

  
  return (
    <>
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert(a => ({ ...a, isOpen: false }))}
      />
      <Loading show={loading} />
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
                      {/* Botón Nuevo */}
                      {!editMode && !selectedCliente && !insertMode && (
                        <Button
                          color="primary"
                          size="md"
                          className="mr-2"
                          style={{ padding: "6px 18px", minWidth: 100 }}
                          onClick={() => {
                            setForm({
                              codigoCli: "",
                              nombreCompleto: "",
                              estado: "A", // <-- Cambia
                              fechaNacimiento: "",
                              genero: "",
                              calle: "",
                              ciudad: "",
                              provincia: "",
                              codigoPostal: "",
                              tipoMembresia: "Básica",
                              fechaInicio: getCurrentDate(),
                              fotoPerfil: "",
                              contactoEmergencia: "",
                              fechaCrea: "",
                              fechaModifica: "",
                              usuModifica: "",
                            });
                            setPhones([{ numero: "", tipo: "", descripcion: "", principal: false }]);
                            setEmails([{ email: "", descripcion: "", principal: false }]);
                            setSelectedCliente(null);
                            setInsertMode(true);
                            setEditMode(false);
                          }}
                        >
                          Nuevo
                        </Button>
                      )}
                      {/* Botón Modificar y Cancelar */}
                      {!editMode && selectedCliente && (
                        <>
                          <Button
                            color="info" // Cambiado de "warning" a "info"
                            size="md"
                            className="mr-2"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={() => {
                              setEditMode(true);
                              setInsertMode(false);
                            }}
                          >
                            Modificar
                          </Button>
                          <Button
                            color="secondary"
                            size="md"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={() => {
                              setEditMode(false);
                              setInsertMode(false);
                              setForm({
                                codigoCli: "",
                                nombreCompleto: "",
                                estado: "A", // <-- Cambia
                                fechaNacimiento: "",
                                genero: "",
                                calle: "",
                                ciudad: "",
                                provincia: "",
                                codigoPostal: "",
                                tipoMembresia: "Básica",
                                fechaInicio: getCurrentDate(),
                                fotoPerfil: "",
                                contactoEmergencia: "",
                                fechaCrea: "",
                                fechaModifica: "",
                                usuModifica: "",
                              });
                              setPhones([{ numero: "", tipo: "", descripcion: "", principal: false }]);
                              setEmails([{ email: "", descripcion: "", principal: false }]);
                              setSelectedCliente(null);
                              setFoto(null);
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {/* Botón Guardar y Cancelar: solo visibles en modo inserción */}
                      {insertMode && (
                        <>
                          <Button
                            color="success"
                            size="md"
                            className="mr-2"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={handleInsertar}
                          >
                            Guardar
                          </Button>
                          <Button
                            color="secondary"
                            size="md"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={() => {
                              setInsertMode(false);
                              setForm({
                                codigoCli: "",
                                nombreCompleto: "",
                                estado: "A", // <-- Cambia
                                fechaNacimiento: "",
                                genero: "",
                                calle: "",
                                ciudad: "",
                                provincia: "",
                                codigoPostal: "",
                                tipoMembresia: "Básica",
                                fechaInicio: getCurrentDate(),
                                fotoPerfil: "",
                                contactoEmergencia: "",
                                fechaCrea: "",
                                fechaModifica: "",
                                usuModifica: "",
                              });
                              setPhones([{ numero: "", tipo: "", descripcion: "", principal: false }]);
                              setEmails([{ email: "", descripcion: "", principal: false }]);
                              setSelectedCliente(null);
                              setFoto(null);
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {/* Botón Actualizar y Cancelar: solo visibles en modo edición y hay cliente seleccionado */}
                      {editMode && selectedCliente && (
                        <>
                          <Button
                            color="success"
                            size="md"
                            className="mr-2"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={handleModificar}
                          >
                            Actualizar
                          </Button>
                          <Button
                            color="secondary"
                            size="md"
                            style={{ padding: "6px 18px", minWidth: 100 }}
                            onClick={() => {
                              setEditMode(false);
                              setForm({
                                codigoCli: "",
                                nombreCompleto: "",
                                estado: "A", // <-- Cambia
                                fechaNacimiento: "",
                                genero: "",
                                calle: "",
                                ciudad: "",
                                provincia: "",
                                codigoPostal: "",
                                tipoMembresia: "Básica",
                                fechaInicio: getCurrentDate(),
                                fotoPerfil: "",
                                contactoEmergencia: "",
                                fechaCrea: "",
                                fechaModifica: "",
                                usuModifica: "",
                              });
                              setPhones([{ numero: "", tipo: "", descripcion: "", principal: false }]);
                              setEmails([{ email: "", descripcion: "", principal: false }]);
                              setSelectedCliente(null);
                              setFoto(null);
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button
                        color="teal"
                        size="md"
                        className="mr-2"
                        style={{
                          padding: "6px 18px",
                          minWidth: 100,
                          backgroundColor: "#11cdef",
                          borderColor: "#11cdef",
                          color: "#fff"
                        }}
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
                        {/* Columna izquierda: Código y Estado (más pequeños) */}
                        <Col md="3">
                          <FormGroup>
                            <label className="form-control-label">Código</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Código"
                              type="text"
                              readOnly
                              value={form.codigoCli}
                              style={{ fontSize: 14, padding: "4px 8px" }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <label className="form-control-label">
                              Estado <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              value={form.estado}
                              onChange={e => setForm({ ...form, estado: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              required
                              style={{ fontSize: 14, padding: "4px 8px" }}
                            >
                              <option value="A">Activo</option>
                              <option value="I">Inactivo</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        {/* Columna central: Nombre y Fecha de Nacimiento */}
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Nombre <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Nombre completo"
                              type="text"
                              value={form.nombreCompleto}
                              onChange={e => setForm({ ...form, nombreCompleto: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              required
                            />
                          </FormGroup>
                          <FormGroup>
                            <label className="form-control-label">
                              Fecha de Nacimiento <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="date"
                              value={form.fechaNacimiento}
                              onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              required
                              max={getCurrentDate()} // Añadir esta línea
                            />
                          </FormGroup>
                        </Col>
                        {/* Columna derecha: Foto */}
                        <Col md="3" className="d-flex align-items-center justify-content-end">
                          <div style={{ width: 120 }}>
                            <FotoUploader
                              nombreCliente={form.nombreCompleto}
                              fechaNacimiento={form.fechaNacimiento}
                              value={foto}
                              onChange={setFoto}
                              disabled={!(editMode || insertMode)}
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* El resto de los campos básicos */}
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Género <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              value={form.genero}
                              onChange={e => setForm({ ...form, genero: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              required
                            >
                              <option value="">Seleccione</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                              <option value="O">Otro</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Provincia <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              value={form.provincia}
                              onChange={e => handleProvinciaChange(e.target.value)}
                              disabled={!(editMode || insertMode)}
                              required
                            >
                              <option value="">Seleccione provincia</option>
                              {provinciasRD.map((prov) => (
                                <option key={prov} value={prov}>{prov}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Ciudad/Municipio <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              value={form.ciudad}
                              onChange={e => setForm({ ...form, ciudad: e.target.value })}
                              disabled={!(editMode || insertMode) || !form.provincia}
                              required
                            >
                              <option value="">Seleccione municipio</option>
                              {municipios.map((mun) => (
                                <option key={mun} value={mun}>{mun}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Calle <span style={{color: "red"}}>*</span>
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Calle"
                              type="text"
                              value={form.calle}
                              onChange={e => setForm({ ...form, calle: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              required
                            />
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
                                onChange={e =>
                                  handleEmailChange(index, "email", e.target.value.toLowerCase())
                                }
                                disabled={!(editMode || insertMode)}
                                pattern="\S+@\S+\.\S+"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="5">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Descripción"
                                type="text"
                                value={email.descripcion}
                                onChange={(e) =>
                                  handleEmailChange(index, "descripcion", e.target.value)
                                }
                                disabled={!(editMode || insertMode)}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => removeEmail(index)}
                              disabled={!(editMode || insertMode)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button color="success" size="sm" onClick={addEmail} disabled={!(editMode || insertMode)}>
                        Agregar Correo
                      </Button>
                      <hr />
                      <h4>Teléfonos</h4>
                      {phones.map((phone, index) => (
                        <Row key={index}>
                          <Col md="4">
                            <FormGroup>
                              <InputMask
                                mask="999-999-9999"
                                value={phone.numero}
                                onChange={e => handlePhoneChange(index, "numero", e.target.value)}
                                disabled={!(editMode || insertMode)}
                              >
                                {(inputProps) => (
                                  <Input
                                    {...inputProps}
                                    className="form-control-alternative"
                                    placeholder="Número de teléfono"
                                    type="tel"
                                    disabled={!(editMode || insertMode)}
                                  />
                                )}
                              </InputMask>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                type="select"
                                value={phone.tipo}
                                onChange={(e) =>
                                  handlePhoneChange(index, "tipo", e.target.value)
                                }
                                disabled={!(editMode || insertMode)}
                              >
                                <option value="">Tipo</option>
                                <option value="Móvil">Móvil</option>
                                <option value="Casa">Casa</option>
                                <option value="Trabajo">Trabajo</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                placeholder="Descripción"
                                type="text"
                                value={phone.descripcion}
                                onChange={(e) =>
                                  handlePhoneChange(index, "descripcion", e.target.value)
                                }
                                disabled={!(editMode || insertMode)}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => removePhone(index)}
                              disabled={!(editMode || insertMode)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button color="success" size="sm" onClick={addPhone} disabled={!(editMode || insertMode)}>
                        Agregar Teléfono
                      </Button>
                    </Form>
                  )}
                  {activeTab === "extras" && (
                    <Form>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Tipo de Membresía
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              value={form.tipoMembresia}
                              onChange={e => setForm({ ...form, tipoMembresia: e.target.value })}
                              disabled={!(editMode || insertMode)}
                            >
                              <option value="Básica">Básica</option>
                              <option value="Intermedia">Intermedia</option>
                              <option value="Premium">Premium</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Fecha de Inicio de Membresía
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="date"
                              value={form.fechaInicio}
                              onChange={e => setForm({ ...form, fechaInicio: e.target.value })}
                              disabled={!(editMode || insertMode)}
                              max={getCurrentDate()} // Añadir esta línea
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">
                              Detalle Contacto de Emergencia
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Nombre y Teléfono"
                              type="text"
                              value={form.contactoEmergencia}
                              onChange={e => setForm({ ...form, contactoEmergencia: e.target.value })}
                              disabled={!(editMode || insertMode)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label">Código Postal</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Código Postal"
                              type="text"
                              value={form.codigoPostal}
                              onChange={e => setForm({ ...form, codigoPostal: e.target.value })}
                              disabled={!(editMode || insertMode)}
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
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText style={{ background: "#f6f9fc" }}>
                    <i className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  placeholder="Buscar por nombre o código"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  style={{
                    borderLeft: "none",
                    background: "#f6f9fc",
                    borderRadius: "0 0.375rem 0.375rem 0"
                  }}
                />
              </InputGroup>
            </FormGroup>
          </Form>
          
          <Table className="mt-3 table-hover table-striped" responsive bordered>
            <thead className="thead-light">
              <tr>
                <th style={{ width: 100 }}>Código</th>
                <th>Nombre</th>
                <th style={{ width: 100 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                searchResults.slice(
                  (currentPage - 1) * PAGE_SIZE,
                  currentPage * PAGE_SIZE
                ).map((result) => (
                  <tr
                    key={result.codigoCli}
                    onClick={() => handleSelectCliente(result.codigoCli)}
                    style={{ cursor: "pointer" }}
                    className="align-middle"
                  >
                    <td>{result.codigoCli}</td>
                    <td>{result.nombreCompleto}</td>
                    <td>
                      <span className={`badge badge-${result.estado === "A" ? "success" : "secondary"}`}>
                        {result.estado === "A" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {Math.ceil(searchResults.length / PAGE_SIZE) > 1 && (
            <Pagination className="justify-content-center">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => setCurrentPage(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
              {Array.from({ length: Math.ceil(searchResults.length / PAGE_SIZE) }, (_, i) => (
                <PaginationItem active={currentPage === i + 1} key={i}>
                  <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={currentPage === Math.ceil(searchResults.length / PAGE_SIZE)}>
                <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === Math.ceil(searchResults.length / PAGE_SIZE)}>
                <PaginationLink last onClick={() => setCurrentPage(Math.ceil(searchResults.length / PAGE_SIZE))} />
              </PaginationItem>
            </Pagination>
          )}
        </ModalBody>
      </Modal>

      <ClienteSelectorModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        onSelect={handleSelectCliente}
      />
    </>
  );
};

export default ClientForm;
