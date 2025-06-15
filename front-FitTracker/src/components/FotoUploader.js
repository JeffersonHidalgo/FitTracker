import React, { useRef } from "react";
import ejemploImg from "../assets/img/ejemplo-foto.png";

import { API_ROOT } from "../services/apiClient"; // Asegúrate de que esta ruta sea correct

const FotoUploader = ({ value, onChange, disabled }) => {
  const inputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          file: file, // Esta línea es crucial
          preview: e.target.result,
          nombreArchivo: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Obtener la URL de la imagen para mostrar
  const getImageSrc = () => {
    // Si no hay valor, mostrar imagen de ejemplo
    if (!value) {
      return ejemploImg;
    }

    // Si value es un objeto File
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    // Si value es un objeto con propiedades específicas
    if (typeof value === "object") {
      // Si tiene preview, usar eso
      if (value.preview) {
        return value.preview;
      }

      // Si tiene URL, usar eso
      if (value.url) {
        return value.url;
      }

      // Si tiene nombreArchivo, construir URL
      if (value.nombreArchivo) {
        return `${API_ROOT}/api/cliente/imagen/${value.nombreArchivo}`;
      }
    }

    // Si value es una cadena
    if (typeof value === "string" && value.trim() !== "") {
      // Si es una URL completa
      if (value.startsWith("http")) {
        return value;
      }

      // Si es una ruta relativa
      return `${API_ROOT}/api/cliente/imagen/${value}`;
    }

    // En cualquier otro caso, mostrar imagen de ejemplo
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
          background: "#f8f9fa",
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        title={disabled ? "" : "Haz click para cargar foto"}
      >
        <img
          src={getImageSrc()}
          alt="Logo de la empresa"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = ejemploImg;
          }}
        />
      </div>
    </div>
  );
};

export default FotoUploader;