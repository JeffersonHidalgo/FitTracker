/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useAuth } from "../../contexts/AuthContext"; // Importar contexto de autenticación

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { currentUser, tieneAccesoAPantalla } = useAuth();
  const navigate = useNavigate();
  
  // Agregar esta función para manejar el toggle del colapso
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };
  
  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate("/auth/login");
    window.location.reload();
  };
  
  // Determinar el nombre a mostrar
  const nombreUsuario = currentUser?.nombre || 
                      currentUser?.username || 
                      "Usuario";
  
  // Filtrar las rutas según los permisos del usuario
  const filteredRoutes = props.routes.filter(route => {
    // Siempre permitir el dashboard
    if (route.path === "/index") return true;
    
    // Siempre permitir la ruta de login
    if (route.layout === "/auth") return true;
    
    // Para otras rutas, verificar permisos
    const fullPath = `${route.layout}${route.path}`;
    return tieneAccesoAPantalla(fullPath);
  });
  
  // Modificar las categorías para incluir Reportes
  const categories = {
    dashboard: {
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      items: ["/index"]
    },
    clientes: {
      name: "Gestión Deportiva",
      icon: "ni ni-single-02 text-info",
      items: ["/client-form", "/metrics-registration", "/clientes/historial-metricas"]
    },
    reportes: {
      name: "Reportes",
      icon: "ni ni-chart-pie-35 text-danger",
      items: [
        "/reportes/clientes-por-estado", 
        "/reportes/clientes-nuevos", 
        "/reportes/clientes-sin-actividad",
        "/reportes/clientes-por-ubicacion",
        "/reportes/clientes-imc-categorias",
        "/reportes/clientes-riesgo",
        "/reportes/clientes-reduccion-imc",
        "/reportes/clientes-ganancia-fuerza", 
        "/reportes/clientes-progreso-aerobico"
      ]
    },
    configuracion: {
      name: "Configuración",
      icon: "ni ni-settings-gear-65 text-gray",
      items: ["/empresa-config", "/user-permissions", "/usuarios/roles"]
    },
    herramientas: {
      name: "Herramientas",
      icon: "ni ni-app text-orange",
      items: ["/recomendaciones"]
    }
  };

  // Estado para controlar qué categorías están expandidas
  const [expandedCategories, setExpandedCategories] = useState({
    dashboard: true,
    clientes: false,
    reportes: false,
    configuracion: false,
    herramientas: false
  });

  // Función para alternar la expansión de categorías
  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  // Función modificada para crear enlaces con categorías
  const createLinks = (routes) => {
    // Encontrar la ruta del dashboard (inicio)
    const dashboardRoute = filteredRoutes.find(
      route => route.path === "/index" && route.layout === "/admin"
    );
    
    // Filtrar y organizar rutas por categoría (excluyendo dashboard)
    const routesByCategory = {};
    
    // Inicializar categorías vacías
    Object.keys(categories).forEach(cat => {
      // Excluimos dashboard de las categorías
      if (cat !== "dashboard") {
        routesByCategory[cat] = [];
      }
    });
    
    // Agrupar rutas filtradas por categoría
    filteredRoutes.forEach(route => {
      if (route.layout !== "/admin" || route.path === "/index") return;
      
      // Encontrar a qué categoría pertenece esta ruta
      const categoryKey = Object.keys(categories).find(cat => 
        categories[cat].items.includes(route.path)
      );
      
      if (categoryKey) {
        routesByCategory[categoryKey].push(route);
      }
    });
    
    return (
      <>
        {/* Renderizar Dashboard directamente sin categoría */}
        {dashboardRoute && (
          <NavItem>
            <NavLinkRRD
              to={dashboardRoute.layout + dashboardRoute.path}
              className="nav-link"
              activeClassName="active"
            >
              <i className={dashboardRoute.icon}></i>
              <span className="nav-link-text">{dashboardRoute.name}</span>
            </NavLinkRRD>
          </NavItem>
        )}
        
        {/* Separador más sutil después del dashboard */}
        {dashboardRoute && <hr className="my-1" />} {/* Reducido de my-2 a my-1 */}
        
        {/* Renderizar categorías y sus rutas */}
        {Object.keys(categories).map((categoryKey) => {
          // Saltarse la categoría dashboard
          if (categoryKey === "dashboard") return null;
          
          const category = categories[categoryKey];
          const routes = routesByCategory[categoryKey] || [];
          
          // Mostrar categoría reportes aunque esté vacía
          if (routes.length === 0 && categoryKey !== "reportes") return null;
          
          return (
            <div key={categoryKey}>
              {/* Encabezado de categoría */}
              <NavItem
                className="category-header"
                onClick={() => toggleCategory(categoryKey)}
                style={{ cursor: 'pointer' }}
              >
                <NavLink className="nav-link-category">
                  <i className={category.icon}></i>
                  <span className="nav-link-text">{category.name}</span>
                  <i 
                    className={`ml-auto fa fa-chevron-${expandedCategories[categoryKey] ? 'down' : 'right'}`}
                    style={{ fontSize: '0.85rem' }}
                  ></i>
                </NavLink>
              </NavItem>
              
              {/* Enlaces de la categoría */}
              <Collapse isOpen={expandedCategories[categoryKey]}>
                {routes.length > 0 ? (
                  routes.map((prop, key) => (
                    <NavItem key={key} className="pl-3">
                      <NavLinkRRD
                        to={prop.layout + prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon}></i>
                        <span className="nav-link-text">{prop.name}</span>
                      </NavLinkRRD>
                    </NavItem>
                  ))
                ) : categoryKey === "reportes" ? (
                  <NavItem className="pl-3">
                    <span className="nav-link text-muted">
                      <small><i>No hay reportes disponibles</i></small>
                    </span>
                  </NavItem>
                ) : null}
              </Collapse>
            </div>
          );
        })}
      </>
    );
  };
  
  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt="FitTracker Logo"
              className="navbar-brand-img"
              src={require("../../assets/img/brand/FitTracker-t.png")}
              style={{ 
                maxHeight: "80px",   // Aumentado de 50px a 80px
                width: "auto",       // Asegura que el ancho se ajuste proporcionalmente
                objectFit: "contain" // Mantiene la proporción
              }}
            />
          </NavbarBrand>
        ) : null}
        {/* User - Actualizado para que coincida con AdminNavbar */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/ejemplo-foto.png")}
                  />
                </span>
                <Media className="ml-2">
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
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          
          {/* Navigation */}
          <Nav navbar>{createLinks(props.routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
