// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Spinner
} from "reactstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/usuarioService";
import { useEmpresa } from "../../contexts/EmpresaContext";
import { API_ROOT } from "../../services/apiClient";

const Login = () => {
  const { empresaConfig, loading } = useEmpresa();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Construir la URL del logo
  const logoUrl = empresaConfig.logo 
    ? `${API_ROOT}/${empresaConfig.logo.replace(/^\/?/, "")}`
    : null;
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await login(username, password);
      // Guardar datos del usuario en localStorage
 if (response && response.usuario) {
    localStorage.setItem('user', JSON.stringify(response));
  } else {
    localStorage.setItem('user', JSON.stringify(response));
  }      navigate("/admin/index");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          setError(err.response.data || "Demasiados intentos fallidos. Intente más tarde.");
        } else if (err.response.status === 401) {
          setError(err.response.data || "Usuario o contraseña incorrectos");
        } else {
          setError("Error de autenticación. Intente nuevamente.");
        }
      } else {
        setError("No se pudo conectar al servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center mb-4">
              {loading ? (
                <Spinner color="primary" />
              ) : logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={empresaConfig.nombreEmpresa} 
                  style={{ 
                    maxHeight: '80px', 
                    maxWidth: '100%', 
                    marginBottom: '15px' 
                  }} 
                />
              ) : (
                <small className="text-muted">
                  Inicia sesión en {empresaConfig.nombreEmpresa || "FitTracker"}
                </small>
              )}
            </div>
            
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Recordarme</span>
                </label>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" color="light" /> : "Iniciar sesión"}
                </Button>
              </div>
              {!loading && empresaConfig.nombreEmpresa && (
                <div className="text-center text-muted">
                  <small>© {new Date().getFullYear()} {empresaConfig.nombreEmpresa}</small>
                </div>
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
