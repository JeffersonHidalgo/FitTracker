import { request } from "./apiClient";


// Obtener lista de clientes
export const obtenerClientes = () =>
  request("get", "cliente/lista");

// Obtener detalle de un cliente por ID
export const obtenerDetalleCliente = (id) =>
  request("get", `cliente/detalle/${id}`);

// Insertar un nuevo cliente
export const insertarCliente = (cliente) =>
  request("post", "cliente/insertar", cliente);

// Actualizar un cliente existente
export const actualizarCliente = (cliente) =>
  request("put", "cliente/actualizar", cliente);

export const subirFotoCliente = async (clienteId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Usa la función request, pasando el método, url, data y config
  return request(
    "post",
    `cliente/subir-foto/${clienteId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Analizar métricas del cliente
export const analizarMetricasCliente = (datos) =>
  request("post", "cliente/metricas/analizar", datos);

// Obtener historial de métricas de un cliente
export const obtenerHistorialMetricasCliente = (codigoCli) =>
  request("get", `cliente/metricas/historial/${codigoCli}`);

// Obtener historial completo de métricas de un cliente (nuevo endpoint)
export const obtenerHistorialCompletoCliente = (codigoCli) =>
  request("get", `cliente/historial-completo/${codigoCli}`);