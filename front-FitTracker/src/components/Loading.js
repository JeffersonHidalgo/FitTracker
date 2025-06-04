import React from "react";

const Loading = ({ show, text = "Cargando..." }) => {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(255,255,255,0.7)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <img
        src={require("../assets/img/loading.gif")}
        alt="Cargando..."
        style={{ width: 80, height: 80, marginBottom: 20 }}
      />
      <span style={{ fontSize: 18, color: "#4A628A" }}>{text}</span>
    </div>
  );
};

export default Loading;