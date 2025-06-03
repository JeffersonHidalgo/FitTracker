import React from "react";
import { Alert } from "reactstrap";

const CustomAlert = ({ isOpen, color, message, toggle }) => (
  <div
    style={{
      position: "fixed",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 3000,
      minWidth: 320,
      maxWidth: "90vw",
    }}
  >
    <Alert color={color} isOpen={isOpen} toggle={toggle} fade>
      {message}
    </Alert>
  </div>
);

export default CustomAlert;