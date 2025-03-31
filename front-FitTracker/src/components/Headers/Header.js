 

// reactstrap components
import { Container } from "reactstrap";

const Header = () => {
  return (
    <>
      <div
        className="header-wrapper"
        style={{
          paddingTop: "100px", // Add a buffer zone above the header
        }}
      >
        <div
          className="header bg-gradient-info pb-8 pt-5 pt-md-8"
          style={{
            position: "absolute", // Allow components to overlap
            top: 0,
            width: "100%",
            zIndex: -1, // Ensure it stays behind other components
          }}
        >
          <Container fluid>
            <div className="header-body">
              {/* Aquí se eliminó el contenido de los gráficos */}
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Header;
