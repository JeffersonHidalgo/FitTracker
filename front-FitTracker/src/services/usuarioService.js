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

export const login = async (username, password) => {
  try {
    // Eliminar el timeout personalizado - usar el predeterminado
    const response = await request("post", "/usuario/login", {
      username,
      password,
    });

    // Verifica que la respuesta exista y tenga el formato esperado
    if (!response) {
      throw new Error("Respuesta vacía del servidor");
    }

    console.log("Respuesta del servidor:", response);
    return response;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    if (error.response) {
      // El servidor respondió con un código de error
      const errorMsg = error.response.data || "Error de autenticación";
      throw new Error(errorMsg);
    } else if (error.request) {
      console.error("No se recibió respuesta:", error.request);
      throw new Error("Tiempo de espera agotado. Intente nuevamente.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const verificarSesion = () => {
  // Implementar verificación de sesión usando el token almacenado
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData && userData.sesionValida;
};

export const logout = () => {
  localStorage.removeItem("user");
  // Opcionalmente, llamar al endpoint de logout en el backend
};
