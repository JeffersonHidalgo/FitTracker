import { request } from "./apiClient";

// Obtener configuración de empresa
export const obtenerConfiguracion = () =>
  request("get", "empresa/configuracion");

// Actualizar datos de empresa
export const actualizarConfiguracion = (datos) =>
  request("put", "empresa/actualizar", datos);

export const SubirLogoEmpresa = async (empresaId, file) => {
  const formData = new FormData();
  formData.append("file", file); // Cambiado a "file" para coincidir con el backend

  return request(
    "post",
    `empresa/subir-logo/${empresaId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};