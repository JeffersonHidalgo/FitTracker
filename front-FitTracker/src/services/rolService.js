import { request } from "./apiClient";

const rolService = {
  listar: () => request("get", "/rol/lista"),
  detalle: (id) => request("get", `/rol/detalle/${id}`),
  insertar: (data) => request("post", "/rol/insertar", data),
  actualizar: (data) => request("put", "/rol/actualizar", data),
  listarPantallas: () => request("get", "/usuario/listaPantallas"),
};

export default rolService;