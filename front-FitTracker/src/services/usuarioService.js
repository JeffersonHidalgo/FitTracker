import { request } from "./apiClient";

export const obtenerUsuarios = () => request("get", "/usuario/lista");

export const obtenerDetalleUsuario = (id) =>
  request("get", `/usuario/detalle/${id}`);

export const crearUsuario = (usuario) =>
  request("post", "/usuario/insertar", usuario);

export const actualizarUsuario = (usuario) =>
  request("put", "/usuario/actualizar", usuario);

export const obtenerPantallas = () => request("get", "/usuario/listaPantallas");

// Agregar a las funciones existentes

export const login = (username, password) =>
  request("post", "/usuario/login", { username, password });

export const verificarSesion = () => {
  // Implementar verificación de sesión usando el token almacenado
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData && userData.sesionValida;
};

export const logout = () => {
  localStorage.removeItem("user");
  // Opcionalmente, llamar al endpoint de logout en el backend
};
