import React, { useRef } from "react";
import ejemploImg from "../assets/img/ejemplo-foto.png";

import { API_ROOT } from "../services/apiClient"; // Asegúrate de que esta ruta sea correct

const FotoUploader = ({ value, onChange, disabled }) => {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validación básica del archivo
    if (!file.name || !file.type) {
      console.error("Archivo inválido:", file);
      return;
    }

    // Pasar directamente el objeto File al componente padre
    onChange(file);
  };

  // Obtener la URL de la imagen para mostrar
  const getImageSrc = () => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    if (typeof value === "string" && value.trim() !== "") {
  return value.startsWith("http") ? value : `${API_ROOT}/${value.replace(/^\/?/, "")}`;}

    return ejemploImg;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div
        style={{
          display: "inline-block",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "1px solid #ccc",
          borderRadius: 8,
          width: 120,
          height: 120,
          overflow: "hidden",
          background: "#f8f9fa"
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        title={disabled ? "" : "Haz click para cargar foto"}
      >
        <img
          src={getImageSrc()}
          alt="Logo de la empresa"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = ejemploImg;
          }}
        />
      </div>
    </div>
  );
};

export default FotoUploader;