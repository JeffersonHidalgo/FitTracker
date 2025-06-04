import React, { useEffect, useState } from "react";
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
  Table,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import {
  obtenerPantallas,
  crearUsuario,
  obtenerUsuarios,
  obtenerDetalleUsuario,
  actualizarUsuario,
} from "../services/usuarioService";
import rolService from "../services/rolService";
import CustomAlert from "components/CustomAlert";
import Loading from "components/Loading";

const initialForm = {
  codigo: "",
  usuario: "",
  nombre: "",
  password: "",
  password2: "",
  email: "",
  rolId: "", // Ahora es rolId (int)
};

const UserPermissionsNew = () => {
  const [form, setForm] = useState(initialForm);
  const [pantallas, setPantallas] = useState([]);
  const [loadingPantallas, setLoadingPantallas] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Usuarios y roles
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroPantalla, setFiltroPantalla] = useState("");

  const [accesosUsuario, setAccesosUsuario] = useState([]); // Solo visualización

  const [alert, setAlert] = useState({
    isOpen: false,
    color: "success",
    message: ""
  });

  // Función para mostrar alertas
  const showAlert = (color, message) => {
    setAlert({
      isOpen: true,
      color,
      message
    });
    setTimeout(() => {
      setAlert(a => ({ ...a, isOpen: false }));
    }, 3000);
  };

  useEffect(() => {
    setLoadingPantallas(true);
    obtenerPantallas()
      .then(setPantallas)
      .catch(() => setPantallas([]))
      .finally(() => setLoadingPantallas(false));
    cargarUsuarios();
    rolService.listar().then(setRoles).catch(() => setRoles([]));
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch {
      setUsuarios([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNuevo = () => {
    setEditMode(true);
    setForm(initialForm);
    setSelectedUser(null);
    setAccesosUsuario([]);
  };

  const handleGuardar = async () => {
    if (
      !form.usuario ||
      !form.nombre ||
      !form.password ||
      !form.password2 ||
      !form.email ||
      !form.rolId
    ) {
      showAlert("warning", "Completa todos los campos.");
      return;
    }
    if (form.password !== form.password2) {
      showAlert("warning", "Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    setLoading(true);
    try {
      const usuario = {
        username: form.usuario,
        nombre: form.nombre,
        password: form.password,
        email: form.email,
        rolId: parseInt(form.rolId, 10),
      };
      await crearUsuario(usuario);
      showAlert("success", "Usuario creado correctamente");
      setEditMode(false);
      const usuariosActualizados = await obtenerUsuarios();
      setUsuarios(usuariosActualizados);
      const usuarioCreado = usuariosActualizados.find(u => u.username === form.usuario);
      if (usuarioCreado) {
        await handleSelectUser(usuarioCreado);
      }
    } catch (e) {
      showAlert("danger", "Error al crear usuario");
    }
    setSaving(false);
    setLoading(false);
  };

  // Selección y edición de usuario existente
  const handleSelectUser = async (usuario) => {
    setSelectedUser(usuario);
    setEditMode(false);
    setSaving(false);
    try {
      const detalle = await obtenerDetalleUsuario(
        usuario.id || usuario.Id || usuario.ID || usuario.codigo || usuario.username
      );
      setForm({
        codigo: detalle.id || detalle.codigo || "",
        usuario: detalle.username || "",
        nombre: detalle.nombre || "",
        password: detalle.password || "",
        password2: detalle.password || "",
        email: detalle.email || "",
        rolId: detalle.rolId ? String(detalle.rolId) : "",
      });
      setAccesosUsuario(detalle.accesos || []);
    } catch {
      showAlert("danger", "No se pudo cargar el detalle del usuario");
    }
  };

  const handleEditar = () => {
    setEditMode(true);
  };

  const handleActualizar = async () => {
    if (
      !form.codigo ||
      isNaN(Number(form.codigo)) ||
      !form.usuario ||
      !form.nombre ||
      !form.email ||
      !form.rolId
    ) {
      showAlert("warning", "Completa todos los campos obligatorios.");
      return;
    }
    if (form.password && form.password !== form.password2) {
      showAlert("warning", "Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    try {
      const usuario = {
        id: Number(form.codigo),
        username: form.usuario,
        nombre: form.nombre,
        password: form.password || "", // Si no se cambia, envía string vacío
        email: form.email,
        rolId: parseInt(form.rolId, 10),
        accesos: accesosUsuario && accesosUsuario.length > 0 ? accesosUsuario : [], // Si tienes accesos, envíalos, si no, array vacío
      };
      console.log("Enviando usuario:", usuario);
      await actualizarUsuario(usuario);
      showAlert("success", "Usuario actualizado correctamente");
      setEditMode(false);
      setForm(initialForm);
      setSelectedUser(null);
      setAccesosUsuario([]);
      cargarUsuarios();
      const usuariosActualizados = await obtenerUsuarios();
      setUsuarios(usuariosActualizados);
      const usuarioActualizado = usuariosActualizados.find(u => u.username === form.usuario);
      if (usuarioActualizado) {
        await handleSelectUser(usuarioActualizado);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al actualizar usuario";
      showAlert("danger", msg);
    }
    setSaving(false);
  };

  const handleCancelar = () => {
    setEditMode(false);
    setForm(initialForm);
    setSelectedUser(null);
    setAccesosUsuario([]);
  };

  const getRolNombre = (rolId) => {
    const rol = roles.find(r => String(r.id) === String(rolId));
    return rol ? rol.nombre : "";
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    (u.nombre || "").toLowerCase().includes(filtroUsuario.toLowerCase()) ||
    (u.username || "").toLowerCase().includes(filtroUsuario.toLowerCase())
  );

  const pantallasFiltradas = pantallas.filter((p) =>
    (p.nombre || "").toLowerCase().includes(filtroPantalla.toLowerCase()) ||
    (p.descripcion || "").toLowerCase().includes(filtroPantalla.toLowerCase())
  );

  // Accesos del usuario (solo visualización)
  const accesosPantallasUsuario = (accesosUsuario || []).filter(a => a.acceso === "S").map(a => a.pantallaId);

  // Maneja el cambio de acceso a pantallas (checkbox)

  return (
    <>
      <Header />
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row className="justify-content-center">
            <Col xl="12" lg="12">
              <Card className="bg-secondary shadow" style={{ minHeight: "400px" }}>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0" style={{ color: "#4A628A" }}>
                        Gestión de Usuarios
                      </h3>
                    </Col>
                    <Col className="text-right d-flex justify-content-end" xs="4">
                      {/* Botón Nuevo: solo visible si NO está en edición y NO hay usuario seleccionado */}
                      {!editMode && !selectedUser && (
                        <Button
                          color="primary"
                          size="sm"
                          className="mr-2"
                          style={{ padding: "10px 20px" }}
                          onClick={handleNuevo}
                        >
                          Nuevo
                        </Button>
                      )}
                      {/* Botón Modificar y Cancelar: solo visibles si hay usuario seleccionado y NO está en edición */}
                      {!editMode && selectedUser && (
                        <>
                          <Button
                            color="warning"
                            size="sm"
                            className="mr-2"
                            style={{ padding: "10px 20px" }}
                            onClick={handleEditar}
                          >
                            Modificar
                          </Button>
                          <Button
                            color="secondary"
                            size="sm"
                            style={{ padding: "10px 20px" }}
                            onClick={handleCancelar}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {/* Botón Guardar y Cancelar: solo visibles en modo edición y NO hay usuario seleccionado */}
                      {editMode && !selectedUser && (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            className="mr-2"
                            style={{ padding: "10px 20px" }}
                            onClick={handleGuardar}
                            disabled={saving}
                          >
                            Guardar
                          </Button>
                          <Button
                            color="secondary"
                            size="sm"
                            style={{ padding: "10px 20px" }}
                            onClick={handleCancelar}
                            disabled={saving}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {/* Botón Actualizar y Cancelar: solo visibles en modo edición y hay usuario seleccionado */}
                      {editMode && selectedUser && (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            className="mr-2"
                            style={{ padding: "10px 20px" }}
                            onClick={handleActualizar}
                            disabled={saving}
                          >
                            Actualizar
                          </Button>
                          <Button
                            color="secondary"
                            size="sm"
                            style={{ padding: "10px 20px" }}
                            onClick={handleCancelar}
                            disabled={saving}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label">Código</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Código"
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleInputChange}
                            disabled
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label">Usuario</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Usuario"
                            type="text"
                            name="usuario"
                            value={form.usuario}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label">Nombre</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Nombre"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label">Contraseña</label>
                          <InputGroup>
                            <Input
                              className="form-control-alternative"
                              placeholder="Contraseña"
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={form.password}
                              onChange={handleInputChange}
                              disabled={!editMode}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText
                                style={{
                                  cursor: "pointer",
                                  background: "#e3e6f0",
                                  color: "#4A628A",
                                  transition: "background 0.2s"
                                }}
                                onClick={() => setShowPassword((v) => !v)}
                                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                              >
                                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Repetir Contraseña
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Repetir Contraseña"
                            type={showPassword ? "text" : "password"}
                            name="password2"
                            value={form.password2}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label">Email</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label">Rol</label>
                          <Input
                            className="form-control-alternative"
                            type="select"
                            name="rolId"
                            value={form.rolId}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          >
                            <option value="">Seleccione un rol</option>
                            {roles.map(rol => (
                              <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xl="6" lg="6">
              {/* Listado de usuarios */}
              <Card className="shadow">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0" style={{ color: "#4A628A" }}>
                    Usuarios
                  </h3>
                </CardHeader>
                <CardBody style={{ maxHeight: 400, overflowY: "auto" }}>
                  <Input
                    className="form-control-alternative mb-2"
                    placeholder="Buscar usuario o nombre..."
                    value={filtroUsuario}
                    onChange={e => setFiltroUsuario(e.target.value)}
                  />
                  <Table hover responsive size="sm">
                    <thead className="thead-light">
                      <tr>
                        <th style={{ width: "40%" }}>Nombre</th>
                        <th style={{ width: "30%" }}>Usuario</th>
                        <th style={{ width: "30%" }}>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((u) => {
                        const isActive =
                          selectedUser &&
                          (selectedUser.id || selectedUser.Id || selectedUser.ID || selectedUser.codigo || selectedUser.username) ===
                            (u.id || u.Id || u.ID || u.codigo || u.username);
                        return (
                          <tr
                            key={u.id || u.Id || u.ID || u.codigo || u.username}
                            style={{
                              cursor: "pointer",
                              backgroundColor: isActive ? "#e3e6f0" : undefined,
                              fontWeight: isActive ? "bold" : undefined,
                            }}
                            onClick={() => handleSelectUser(u)}
                          >
                            <td>{u.nombre}</td>
                            <td>{u.username}</td>
                            <td>{getRolNombre(u.rolId)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6" lg="6">
              <Card className="shadow">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0" style={{ color: "#4A628A" }}>
                    Acceso a Pantallas
                  </h3>
                </CardHeader>
                <CardBody>
                  <Input
                    className="form-control-alternative mb-2"
                    placeholder="Buscar pantalla..."
                    value={filtroPantalla}
                    onChange={e => setFiltroPantalla(e.target.value)}
                  />
                  <div style={{ overflowX: "auto", maxWidth: "100%", padding: 0, margin: 0 }}>
                    <Table
                      className="align-items-center"
                      responsive
                      style={{ minWidth: 600 }} // Fuerza scroll si hay muchas columnas
                    >
                      <thead className="thead-light">
                        <tr>
                          <th style={{ minWidth: 200 }}>Pantalla</th>
                          <th style={{ minWidth: 250 }}>Descripción</th>
                          <th style={{ textAlign: "center", width: 120, minWidth: 120 }}>Acceso</th>
                          {/* El nivel NO se muestra, pero sí se usa internamente */}
                        </tr>
                      </thead>
                      <tbody>
                        {loadingPantallas ? (
                          <tr>
                            <td colSpan={3}>Cargando...</td>
                          </tr>
                        ) : pantallasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={3}>No hay pantallas</td>
                          </tr>
                        ) : (
                          pantallasFiltradas.map((pantalla) => (
                            // El nivel se obtiene aquí pero NO se muestra
                            <tr key={pantalla.id || pantalla.codigo || pantalla.nombre}>
                              <td>{pantalla.nombre}</td>
                              <td>{pantalla.descripcion}</td>
                              <td
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                  width: 120,
                                  minWidth: 120,
                                  background: "#f8f9fe",
                                  position: "relative",
                                }}
                              >
                                <Input
                                  type="checkbox"
                                  disabled
                                  checked={accesosPantallasUsuario.includes(
                                    pantalla.id || pantalla.codigo || pantalla.nombre
                                  )}
                                  style={{
                                    transform: "scale(1.2)",
                                    cursor: "not-allowed",
                                  }}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <CustomAlert
        isOpen={alert.isOpen}
        color={alert.color}
        message={alert.message}
        toggle={() => setAlert(a => ({ ...a, isOpen: false }))}
      />
      <Loading show={loading} />
    </>
  );
};

export default UserPermissionsNew;
