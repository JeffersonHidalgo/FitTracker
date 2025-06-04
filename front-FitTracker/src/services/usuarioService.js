import { request } from "./apiClient";

export const obtenerUsuarios = () => request("get", "/usuario/lista");

export const obtenerDetalleUsuario = (id) =>
  request("get", `/usuario/detalle/${id}`);

export const crearUsuario = (usuario) =>
  request("post", "/usuario/insertar", usuario);

export const actualizarUsuario = (usuario) =>
  request("put", "/usuario/actualizar", usuario);


export const obtenerPantallas = () => request("get", "/usuario/listaPantallas");
