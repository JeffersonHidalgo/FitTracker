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
import { useAuth } from "../../contexts/AuthContext"; // Añadir esta importación arriba

const Login = () => {
  const { empresaConfig, loading } = useEmpresa();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  
  // Construir la URL del logo
  const logoUrl = empresaConfig.logo 
    ? `${API_ROOT}/${empresaConfig.logo.replace(/^\/?/, "")}`
    : null;
  
  // Mejorar el manejo de la respuesta para almacenar datos consistentes
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Intentando iniciar sesión con:", username);
      
      const response = await login(username, password);
      
      console.log("Login exitoso, guardando datos del usuario");
      
      // Guardar datos del usuario
      const userData = {
        ...response.usuario,
        sesionValida: response.sesionValida,
        ultimoAcceso: response.ultimoAcceso
      };
      
      // Almacenar en localStorage independientemente de "Recordarme"
      // Solo cambia dónde se guarda como copia secundaria
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Si no quieren ser recordados, también ponerlo en sessionStorage
      // para que se borre al cerrar el navegador
      if (!rememberMe) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        // Y configurar un flag para que se borre de localStorage al cerrar sesión
        const enhancedData = {...userData, tempSession: true};
        localStorage.setItem('user', JSON.stringify(enhancedData));
      }
      
      // Actualizar el contexto de autenticación
      if (auth && typeof auth.setUser === 'function') {
        auth.setUser(userData);
      } else if (auth && typeof auth.login === 'function') {
        // Algunos contextos usan login en vez de setUser
        auth.login(userData);
      } else {
        console.warn("No se pudo actualizar el contexto de autenticación - función no disponible");
        // Continuar con la navegación de todos modos
      }
      
      // Añadir un pequeño retraso para asegurar que el estado se actualice
      setTimeout(() => {
        navigate("/admin/index");
      }, 100);
    } catch (err) {
      console.error("Error completo:", err);
      
      // Mensaje de error simplificado y más amigable
      setError(err.message || "No se pudo iniciar sesión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Agregar botón para reintentar
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    setError("");
    handleLogin({ preventDefault: () => {} });
  };
  
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleLogin} aria-labelledby="login-heading">
              <div id="login-heading" className="text-center mb-4">
                <h2 className="mb-3">Iniciar Sesión</h2>
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
              
              <FormGroup className="mb-3">
                <label htmlFor="username" className="sr-only">Usuario</label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" aria-hidden="true" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="username"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" aria-hidden="true" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="password"
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
              {error && error.includes("No se pudo conectar") && (
                <div className="text-center mt-2">
                  <Button color="warning" size="sm" onClick={handleRetry}>
                    Reintentar conexión
                  </Button>
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
