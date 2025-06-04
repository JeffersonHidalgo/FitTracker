import { request } from "./apiClient";

// Obtener todas las recomendaciones
export const obtenerRecomendaciones = () =>
  request("get", "/recomendacion/lista");

// Obtener detalle de una recomendación por id
export const obtenerDetalleRecomendacion = (id) =>
  request("get", `/recomendacion/detalle/${id}`);

// Crear una nueva recomendación
export const crearRecomendacion = (recomendacion) =>
  request("post", "/recomendacion/insertar", recomendacion);

// Actualizar una recomendación existente
export const actualizarRecomendacion = (recomendacion) =>
  request("put", "/recomendacion/actualizar", recomendacion);