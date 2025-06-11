import { Link, useNavigate } from "react-router-dom";
import { useEmpresa } from "../../contexts/EmpresaContext";
import { useAuth } from "../../contexts/AuthContext"; // Importar el contexto de autenticación

// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Spinner
} from "reactstrap";

const AdminNavbar = (props) => {
  const { empresaConfig, loading } = useEmpresa();
  const { currentUser } = useAuth(); // Obtener el usuario actual
  const navigate = useNavigate(); // Hook para navegación
  
  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar datos de usuario del localStorage
    localStorage.removeItem('user');
    // Redirigir al login
    navigate("/auth/login");
    // Opcional: recargar la página para reiniciar todos los estados
    window.location.reload();
  };
  
  // Determinar el nombre a mostrar
  const nombreUsuario = currentUser?.nombre || 
                      currentUser?.username || 
                      "Usuario";
  
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {loading ? (
              <><small><Spinner size="sm" color="light" className="mr-1" /></small> Cargando...</>
            ) : (
              empresaConfig.nombreEmpresa
            )}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/ejemplo-foto.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {nombreUsuario}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Cerrar Sesión</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
