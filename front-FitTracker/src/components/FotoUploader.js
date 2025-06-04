import React, { useRef } from "react";
import ejemploImg from "../assets/img/ejemplo-foto.png"; // Usa tu imagen de ejemplo

const API_ROOT = "https://localhost:44323"; // Declarada una sola vez aquí

const FotoUploader = ({ nombreCliente, fechaNacimiento, value, onChange, disabled }) => {
  const inputRef = useRef();

  // Genera el nombre del archivo según la fecha y nombre del cliente
  const generarNombreArchivo = (file) => {
    if (value?.codigoCli) {
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return `cliente_${value.codigoCli}${extension}`;
    }
    return file.name;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const nombreArchivo = generarNombreArchivo(file);
      onChange({
        file,
        preview: ev.target.result,
        nombreArchivo
      });
    };
    reader.readAsDataURL(file);
  };

  // Decide qué imagen mostrar
  const [imagenSrc, setImagenSrc] = React.useState(() => {
    if (value?.preview) return value.preview;
    if (value?.url) {
      if (value.url.startsWith("http")) return value.url;
      return `${API_ROOT}${value.url.startsWith("/") ? "" : "/"}${value.url}`;
    }
    return ejemploImg;
  });

  // Si cambian los props, actualiza la imagen
  React.useEffect(() => {
    if (value?.preview) setImagenSrc(value.preview);
    else if (value?.url) {
      if (value.url.startsWith("http")) setImagenSrc(value.url);
      else setImagenSrc(`${API_ROOT}${value.url.startsWith("/") ? "" : "/"}${value.url}`);
    } else {
      setImagenSrc(ejemploImg);
    }
  }, [value]);

  // Si la imagen no carga, muestra la de ejemplo
  const handleImgError = () => {
    setImagenSrc(ejemploImg);
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
        onClick={() => !disabled && inputRef.current && inputRef.current.click()}
        title={disabled ? "" : "Haz click para cargar foto"}
      >
        <img
          src={imagenSrc}
          alt="Foto del cliente"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={handleImgError} // <-- Esto asegura que si hay error, se muestra la imagen de ejemplo
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: "#888" }}>
        {value?.file && value?.nombreArchivo ? value.nombreArchivo : null}
      </div>
    </div>
  );
};

export default FotoUploader;