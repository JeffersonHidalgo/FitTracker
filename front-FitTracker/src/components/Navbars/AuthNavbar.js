import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AuthNavbar = () => {
  // Estilos para hacer el logo más grande
  const logoStyle = {
    height: "60px", // Aumentar altura (ajusta según necesites)
    maxWidth: "100%",
    objectFit: "contain", // Mantener proporciones
  };

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="FitTracker"
              src={require("../../assets/img/brand/FitTracker.png")}
              style={logoStyle} // Aplicar estilos para hacer más grande
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <img
                    alt="FitTracker"
                    src={require("../../assets/img/brand/FitTracker.png")}
                    style={logoStyle} // Aplicar mismos estilos aquí también
                  />
                </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    id="navbar-collapse-main"
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AuthNavbar; // Corregir nombre del componente exportado
