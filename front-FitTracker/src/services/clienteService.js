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