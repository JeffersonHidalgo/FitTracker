/*eslint-disable*/

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://www.fittracker.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FitTracker
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink
                    href="https://www.fittracker.com/about"
                    target="_blank"
                  >
                    Nosotros
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://www.fittracker.com/blog"
                    target="_blank"
                  >
                    Blogs
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://www.fittracker.com/contact"
                    target="_blank"
                  >
                    Contacto
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
