import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Button, Row, Col, Table, Form, FormGroup, Input, Label, Container, Alert, Spinner,
  Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import Header from "components/Headers/Header";
import rolService from "../services/rolService";
import { obtenerPantallas } from "../services/usuarioService";

const initialForm = {
  id: null,
  nombre: "",
  descripcion: "",
  accesos: [],
};

const PAGE_SIZE_ROLES = 8;
const PAGE_SIZE_PANTALLAS = 8;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [pantallas, setPantallas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, color: "success", message: "" });
  const [filtro, setFiltro] = useState("");

  // Paginación para roles
  const [currentPageRoles, setCurrentPageRoles] = useState(1);
  const filteredRoles = roles.filter(r =>
    r.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (r.descripcion || "").toLowerCase().includes(filtro.toLowerCase())
  );
  const totalPagesRoles = Math.ceil(filteredRoles.length / PAGE_SIZE_ROLES);
  const paginatedRoles = filteredRoles.slice(
    (currentPageRoles - 1) * PAGE_SIZE_ROLES,
    currentPageRoles * PAGE_SIZE_ROLES
  );

  // Paginación para pantallas (en el form)
  const [currentPagePantallas, setCurrentPagePantallas] = useState(1);
  const filteredPantallas = pantallas.filter(p =>
    !form.pantallaFiltro ||
    p.nombre.toLowerCase().includes(form.pantallaFiltro?.toLowerCase()) ||
    (p.descripcion || "").toLowerCase().includes(form.pantallaFiltro?.toLowerCase())
  );
  const totalPagesPantallas = Math.ceil(filteredPantallas.length / PAGE_SIZE_PANTALLAS);
  const paginatedPantallas = filteredPantallas.slice(
    (currentPagePantallas - 1) * PAGE_SIZE_PANTALLAS,
    currentPagePantallas * PAGE_SIZE_PANTALLAS
  );

  // Fetch roles and pantallas on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Reiniciar página al filtrar
  useEffect(() => { setCurrentPageRoles(1); }, [filtro, roles.length]);
  useEffect(() => { setCurrentPagePantallas(1); }, [form.pantallaFiltro, pantallas.length]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rolesRes, pantallasRes] = await Promise.all([
        rolService.listar(),
        obtenerPantallas(),
      ]);
      setRoles(rolesRes);
      setPantallas(pantallasRes);
    } catch {
      setAlert({ isOpen: true, color: "danger", message: "Error al cargar datos." });
    }
    setLoading(false);
  };

  const handleSelectRole = async (role) => {
    setLoading(true);
    try {
      const detalle = await rolService.detalle(role.id);
      setForm({
        id: detalle.id,
        nombre: detalle.nombre,
        descripcion: detalle.descripcion,
        accesos: pantallas.map((p) => {
          const found = (detalle.accesos || []).find(a => a.pantallaId === p.id);
          return {
            pantallaId: p.id,
            acceso: found ? found.acceso : "N"
          };
        }),
      });
      setSelectedRole(role);
      setEditMode(true);
    } catch {
      setAlert({ isOpen: true, color: "danger", message: "No se pudo cargar el rol." });
    }
    setLoading(false);
  };

  const handleNuevo = () => {
    setForm({
      ...initialForm,
      accesos: pantallas.map(p => ({ pantallaId: p.id, acceso: "N" })),
    });
    setEditMode(true);
    setSelectedRole(null);
  };

  const handleInputChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAccesoChange = (pantallaId) => {
    setForm(f => ({
      ...f,
      accesos: f.accesos.map(a =>
        a.pantallaId === pantallaId
          ? { ...a, acceso: a.acceso === "S" ? "N" : "S" }
          : a
      ),
    }));
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      setAlert({ isOpen: true, color: "warning", message: "El nombre es obligatorio." });
      return;
    }
    if (!form.descripcion.trim()) {
      setAlert({ isOpen: true, color: "warning", message: "La descripción es obligatoria." });
      return;
    }
    const pantallasSeleccionadas = form.accesos.filter(a => a.acceso === "S");
    if (pantallasSeleccionadas.length === 0) {
      setAlert({ isOpen: true, color: "warning", message: "Debes seleccionar al menos una pantalla." });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        // Editar
        await rolService.actualizar({
          id: form.id,
          nombre: form.nombre,
          descripcion: form.descripcion,
          accesos: form.accesos,
        });
        setAlert({ isOpen: true, color: "success", message: "Rol actualizado correctamente." });
      } else {
        // Crear
        await rolService.insertar({
          nombre: form.nombre,
          descripcion: form.descripcion,
          accesos: form.accesos,
        });
        setAlert({ isOpen: true, color: "success", message: "Rol creado correctamente." });
      }
      setEditMode(false);
      setForm(initialForm);
      setSelectedRole(null);
      fetchAll();
    } catch {
      setAlert({ isOpen: true, color: "danger", message: "Error al guardar el rol." });
    }
    setSaving(false);
  };

  const handleCancelar = () => {
    setEditMode(false);
    setForm(initialForm);
    setSelectedRole(null);
  };

  return (
    <>
      <Header />
      <div className="pt-4 pb-2 text-center">
        <h2 style={{ color: "#344767", fontWeight: 700 }}>Mantenimiento de Roles</h2>
      </div>
      <div className="main-content" style={{ marginTop: "50px" }}>
        <Container className="mt--5" fluid>
          <Row>
            <Col xl="6" lg="7" md="12">
              <Card className="shadow mb-4">
                <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h3 className="mb-0" style={{ color: "#4A628A" }}>Roles</h3>
                  <Input
                    placeholder="Buscar rol..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                    bsSize="sm"
                    style={{ width: 180 }}
                  />
                  <Button color="primary" size="sm" onClick={handleNuevo} disabled={loading || editMode}>
                    Nuevo
                  </Button>
                </CardHeader>
                <CardBody style={{ maxHeight: 500, overflowY: "auto" }}>
                  {loading ? (
                    <div className="text-center py-4"><Spinner size="sm" /> Cargando...</div>
                  ) : (
                    <>
                      <Table hover responsive size="sm">
                        <thead className="thead-light">
                          <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedRoles.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="text-center text-muted">No hay roles</td>
                            </tr>
                          ) : (
                            paginatedRoles.map((rol) => (
                              <tr key={rol.id}>
                                <td>{rol.nombre}</td>
                                <td>{rol.descripcion}</td>
                                <td>
                                  <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => handleSelectRole(rol)}
                                    disabled={loading || saving}
                                  >
                                    Editar
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                      {totalPagesRoles > 1 && (
                        <Pagination className="justify-content-center">
                          <PaginationItem disabled={currentPageRoles === 1}>
                            <PaginationLink first onClick={() => setCurrentPageRoles(1)} />
                          </PaginationItem>
                          <PaginationItem disabled={currentPageRoles === 1}>
                            <PaginationLink previous onClick={() => setCurrentPageRoles(currentPageRoles - 1)} />
                          </PaginationItem>
                          {Array.from({ length: totalPagesRoles }, (_, i) => (
                            <PaginationItem active={currentPageRoles === i + 1} key={i}>
                              <PaginationLink onClick={() => setCurrentPageRoles(i + 1)}>
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem disabled={currentPageRoles === totalPagesRoles}>
                            <PaginationLink next onClick={() => setCurrentPageRoles(currentPageRoles + 1)} />
                          </PaginationItem>
                          <PaginationItem disabled={currentPageRoles === totalPagesRoles}>
                            <PaginationLink last onClick={() => setCurrentPageRoles(totalPagesRoles)} />
                          </PaginationItem>
                        </Pagination>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col xl="6" lg="6" md="12">
              <Card className="shadow mb-4">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0" style={{ color: "#4A628A" }}>
                    {editMode ? (form.id ? "Editar Rol" : "Nuevo Rol") : "Detalle de Rol"}
                  </h3>
                </CardHeader>
                <CardBody>
                  {alert.isOpen && (
                    <Alert color={alert.color} isOpen={alert.isOpen} toggle={() => setAlert(a => ({ ...a, isOpen: false }))}>
                      {alert.message}
                    </Alert>
                  )}
                  {editMode ? (
                    <Form>
                      <FormGroup>
                        <Label>Nombre del Rol <span style={{ color: "red" }}>*</span></Label>
                        <Input
                          name="nombre"
                          value={form.nombre}
                          onChange={handleInputChange}
                          maxLength={50}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Descripción <span style={{ color: "red" }}>*</span></Label>
                        <Input
                          name="descripcion"
                          value={form.descripcion}
                          onChange={handleInputChange}
                          maxLength={120}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Accesos a Pantallas <span style={{ color: "red" }}>*</span></Label>
                        <Input
                          type="text"
                          placeholder="Buscar pantalla..."
                          bsSize="sm"
                          className="mb-2"
                          value={form.pantallaFiltro || ""}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              pantallaFiltro: e.target.value
                            }))
                          }
                          disabled={pantallas.length === 0}
                        />
                        <div
                          style={{
                            maxHeight: 220,
                            overflowY: "auto",
                            border: "1px solid #e9ecef",
                            borderRadius: 6,
                            background: "#f8f9fa"
                          }}
                        >
                          <Table size="sm" bordered responsive className="mb-0">
                            <thead className="thead-light">
                              <tr>
                                <th style={{ width: 40 }}></th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedPantallas.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className="text-center text-muted">No hay pantallas</td>
                                </tr>
                              ) : (
                                paginatedPantallas.map(p => (
                                  <tr key={p.id}>
                                    <td className="text-center align-middle">
                                      <Label
                                        for={`pantalla-${p.id}`}
                                        className="mb-0 d-flex align-items-center justify-content-center"
                                        style={{ width: "100%", cursor: "pointer", minHeight: 24 }}
                                      >
                                        <Input
                                          type="checkbox"
                                          checked={!!form.accesos.find(a => a.pantallaId === p.id && a.acceso === "S")}
                                          onChange={() => handleAccesoChange(p.id)}
                                          id={`pantalla-${p.id}`}
                                          disabled={saving}
                                          style={{ margin: 0 }}
                                        />
                                      </Label>
                                    </td>
                                    <td className="align-middle">
                                      <Label
                                        for={`pantalla-${p.id}`}
                                        className="mb-0"
                                        style={{ cursor: "pointer", width: "100%" }}
                                      >
                                        <strong>{p.nombre}</strong>
                                      </Label>
                                    </td>
                                    <td className="align-middle">
                                      <span className="text-muted" style={{ fontSize: 13 }}>{p.descripcion}</span>
                                    </td>
                                  </tr>
                                ))
                            )}
                            </tbody>
                          </Table>
                          {totalPagesPantallas > 1 && (
                            <Pagination className="justify-content-center mt-2">
                              <PaginationItem disabled={currentPagePantallas === 1}>
                                <PaginationLink first onClick={() => setCurrentPagePantallas(1)} />
                              </PaginationItem>
                              <PaginationItem disabled={currentPagePantallas === 1}>
                                <PaginationLink previous onClick={() => setCurrentPagePantallas(currentPagePantallas - 1)} />
                              </PaginationItem>
                              {Array.from({ length: totalPagesPantallas }, (_, i) => (
                                <PaginationItem active={currentPagePantallas === i + 1} key={i}>
                                  <PaginationLink onClick={() => setCurrentPagePantallas(i + 1)}>
                                    {i + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem disabled={currentPagePantallas === totalPagesPantallas}>
                                <PaginationLink next onClick={() => setCurrentPagePantallas(currentPagePantallas + 1)} />
                              </PaginationItem>
                              <PaginationItem disabled={currentPagePantallas === totalPagesPantallas}>
                                <PaginationLink last onClick={() => setCurrentPagePantallas(totalPagesPantallas)} />
                              </PaginationItem>
                            </Pagination>
                          )}
                        </div>
                      </FormGroup>
                      <div className="d-flex justify-content-end">
                        <Button color="success" className="mr-2" onClick={handleGuardar} disabled={saving}>
                          {saving ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button color="secondary" onClick={handleCancelar} disabled={saving}>
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  ) : selectedRole ? (
                    <>
                      <h5 className="mb-2">{form.nombre}</h5>
                      <p className="mb-2">{form.descripcion}</p>
                      <h6 className="mt-3 mb-2" style={{ color: "#4A628A" }}>Pantallas con acceso:</h6>
                      <ul>
                        {pantallas
                          .filter(p => form.accesos.find(a => a.pantallaId === p.id && a.acceso === "S"))
                          .map(p => (
                            <li key={p.id}>
                              <strong>{p.nombre}</strong>
                              <span className="text-muted ml-2" style={{ fontSize: 13 }}>{p.descripcion}</span>
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <div className="text-muted">Selecciona un rol para ver detalles o haz clic en "Nuevo" para crear uno.</div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RoleManagement;