import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Container,
  Row,
  Col,
  Spinner,
  Badge,
  Tooltip
} from "reactstrap";
import Header from "components/Headers/Header.js";
import FotoUploader from "components/FotoUploader";
import CustomAlert from "components/CustomAlert";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  SubirLogoEmpresa
} from "services/configuracionService";
import { API_ROOT } from "../../services/apiClient";

const EmpresaConfig = () => {
  const [form, setForm] = useState({
    id: null,
    nombreEmpresa: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    pais: "",
    telefono: "",
    email: "",
    smtpServidor: "",
    smtpPuerto: "",
    smtpUsuario: "",
    smtpPassword: "",
    usarSSL: false,
    logo: ""
  });

  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        setLoading(true);
        const config = await obtenerConfiguracion();
        const logoRelativo = config.logo || "";
        const logoCompleto = logoRelativo
          ? `${API_ROOT}/${logoRelativo.replace(/^\/?/, "")}`
          : "";
        setForm({
          id: config.id,
          nombreEmpresa: config.nombreEmpresa,
          direccion: config.direccion,
          ciudad: config.ciudad,
          provincia: config.provincia,
          codigoPostal: config.codigoPostal,
          pais: config.pais,
          telefono: config.telefonoEmpresa,
          email: config.emailEmpresa,
          smtpServidor: config.servidorSmtp,
          smtpPuerto: config.puertoSmtp,
          smtpUsuario: config.usuarioSmtp,
          smtpPassword: config.passwordSmtp,
          usarSSL: config.usarSsl,
          logo: logoRelativo
        });
        setLogoUrl(logoCompleto);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar configuración: " + err.message);
        setLoading(false);
      }
    };
    cargarConfiguracion();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubirLogo = async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error("No se seleccionó un archivo válido");
    }
    try {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const validExtensions = ["jpg", "jpeg", "png", "webp"];
      if (!validExtensions.includes(fileExtension)) {
        throw new Error(
          `Extensión .${fileExtension} no permitida. Use JPG, PNG o WEBP`
        );
      }
      setLoading(true);
      setUploadError(null);
      setLogoFile(file);
      const response = await SubirLogoEmpresa(form.id, file);
      if (!response?.rutaRelativa) {
        throw new Error("El servidor no devolvió la ruta del logo");
      }
      const nuevaUrl = `${API_ROOT}/${response.rutaRelativa.replace(/^\/?/, "")}`;
      setForm((prev) => ({ ...prev, logo: response.rutaRelativa }));
      setLogoUrl(nuevaUrl);
      setSuccess("¡Logo actualizado correctamente!");
    } catch (err) {
      let errorMessage = "Error al subir logo";
      if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      setUploadError(errorMessage);
      console.error("Error detallado:", {
        error: err,
        response: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const datosActualizar = {
        id: form.id,
        nombreEmpresa: form.nombreEmpresa,
        direccion: form.direccion,
        ciudad: form.ciudad,
        provincia: form.provincia,
        codigoPostal: form.codigoPostal,
        pais: form.pais,
        telefonoEmpresa: form.telefono,
        emailEmpresa: form.email,
        servidorSmtp: form.smtpServidor,
        puertoSmtp: form.smtpPuerto,
        usuarioSmtp: form.smtpUsuario,
        passwordSmtp: form.smtpPassword,
        usarSsl: form.usarSSL,
        logo: form.logo
      };
      await actualizarConfiguracion(datosActualizar);
      if (logoFile && !form.logo.includes("empresa_")) {
        await handleSubirLogo(logoFile);
      } else {
        setSuccess("Configuración actualizada correctamente");
      }
    } catch (err) {
      setError("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = (type) => {
    if (type === "error") setError(null);
    if (type === "success") setSuccess(false);
    if (type === "upload") setUploadError(null);
  };

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--6" fluid>
          <Row className="justify-content-center">
            <Col xl="10">
              {/* Alertas arriba y con espaciado */}
              <div style={{ marginBottom: 20 }}>
                {error && (
                  <CustomAlert
                    type="error"
                    message={error}
                    onClose={() => closeAlert("error")}
                    dismissible
                  />
                )}
                {success && (
                  <CustomAlert
                    type="success"
                    message={success}
                    onClose={() => closeAlert("success")}
                    dismissible
                  />
                )}
                {uploadError && (
                  <CustomAlert
                    type="error"
                    message={uploadError}
                    onClose={() => closeAlert("upload")}
                    dismissible
                    small
                  />
                )}
              </div>
              <Card className="bg-white shadow border-0">
                <CardHeader className="bg-white border-0 pb-2">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0 text-primary">
                        <i className="ni ni-settings-gear-65 mr-2"></i>
                        Configuración de Empresa
                      </h3>
                    </Col>
                    <Col className="text-right">
                      <Button
                        color="success"
                        size="md"
                        onClick={handleGuardar}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" color="light" /> Guardando...
                          </>
                        ) : (
                          <>
                            <i className="ni ni-check-bold mr-1"></i>
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      {/* Columna logo */}
                      <Col md="4" className="text-center d-flex flex-column align-items-center justify-content-start">
                        <h5 className="mb-3">Logo de la Empresa</h5>
                        <div
                          className="mb-3"
                          style={{
                            border: "1px solid #e9ecef",
                            borderRadius: 8,
                            padding: 10,
                            background: "#f8f9fa",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            minHeight: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <FotoUploader
                            value={logoUrl}
                            onChange={handleSubirLogo}
                            disabled={loading}
                          />
                        </div>
                        <small className="text-muted d-block mb-2">
                          Formatos: JPG, PNG, WEBP. Máx: 2MB
                        </small>
                        <Badge color="secondary" pill id="logoInfo" style={{ cursor: "pointer" }}>
                          ?
                        </Badge>
                        <Tooltip
                          placement="right"
                          isOpen={tooltipOpen}
                          target="logoInfo"
                          toggle={() => setTooltipOpen(!tooltipOpen)}
                        >
                          Sube el logo de tu empresa para personalizar la plataforma.
                        </Tooltip>
                      </Col>
                      {/* Columna datos generales */}
                      <Col md="8">
                        <h6 className="heading-small text-muted mb-3">
                          <i className="ni ni-building mr-2"></i>
                          Datos Generales
                        </h6>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <Label>Nombre de la Empresa <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.nombreEmpresa}
                                onChange={(e) =>
                                  handleChange("nombreEmpresa", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <Label>Dirección <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.direccion}
                                onChange={(e) =>
                                  handleChange("direccion", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label>Ciudad <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.ciudad}
                                onChange={(e) =>
                                  handleChange("ciudad", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label>Provincia <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.provincia}
                                onChange={(e) =>
                                  handleChange("provincia", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label>Código Postal <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.codigoPostal}
                                onChange={(e) =>
                                  handleChange("codigoPostal", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label>País <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.pais}
                                onChange={(e) =>
                                  handleChange("pais", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <Label>Teléfono <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="text"
                                value={form.telefono}
                                onChange={(e) =>
                                  handleChange("telefono", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label>Email <span style={{ color: 'red' }}>*</span></Label>
                              <Input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                  handleChange("email", e.target.value)
                                }
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <hr className="my-4" />
                    <h6 className="heading-small text-muted mb-3">
                      <i className="ni ni-email-83 mr-2"></i>
                      Configuración SMTP
                    </h6>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Servidor SMTP <span style={{ color: 'red' }}>*</span></Label>
                          <Input
                            type="text"
                            value={form.smtpServidor}
                            onChange={(e) =>
                              handleChange("smtpServidor", e.target.value)
                            }
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Puerto <span style={{ color: 'red' }}>*</span></Label>
                          <Input
                            type="number"
                            value={form.smtpPuerto}
                            onChange={(e) =>
                              handleChange("smtpPuerto", e.target.value)
                            }
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3" className="d-flex align-items-center pt-3">
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              checked={form.usarSSL}
                              onChange={(e) =>
                                handleChange("usarSSL", e.target.checked)
                              }
                            />{" "}
                            Usar SSL
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Usuario SMTP <span style={{ color: 'red' }}>*</span></Label>
                          <Input
                            type="text"
                            value={form.smtpUsuario}
                            onChange={(e) =>
                              handleChange("smtpUsuario", e.target.value)
                            }
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Contraseña SMTP <span style={{ color: 'red' }}>*</span></Label>
                          <Input
                            type="password"
                            value={form.smtpPassword}
                            onChange={(e) =>
                              handleChange("smtpPassword", e.target.value)
                            }
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EmpresaConfig;