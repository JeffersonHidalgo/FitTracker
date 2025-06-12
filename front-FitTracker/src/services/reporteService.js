// Generar reporte de métricas en PDF para un cliente
import { request } from "./apiClient";


export const generarReporteMetricas = (clienteId) =>
  request("get", `reportes/reporte-metricas/${clienteId}`, null, {
    responseType: "blob",
    headers: { Accept: "application/pdf" }
  });

export const generarReorteHistorial = (clienteId) =>
  request("get", `reportes/reporte-historial/${clienteId}`, null, {
    responseType: "blob",
    headers: { Accept: "application/pdf" }
  });

export const enviarEmailMetricas = (clienteId) =>
  request("post", `reportes/enviar-metricas/${clienteId}`);

export const enviarHistorial = (clienteId) =>
  request("post", `reportes/enviar-historial/${clienteId}`);

// Nuevos endpoints de reportes de clientes
export const obtenerClientesPorEstado = () =>
  request("get", "cliente/clientes-por-estado");

export const obtenerClientesNuevos = (dias) =>
  request("get", `cliente/nuevos-clientes/${dias}`);

export const obtenerClientesSinActividad = (dias) =>
  request("get", `cliente/clientes-sin-actividad/${dias}`);

// Obtener clientes por categorías de IMC
export const obtenerClientesIMCCategorias = () =>
  request("get", "cliente/imc-categorias");

// Obtener clientes en situación de riesgo (obesidad + FC alta + baja capacidad)
export const obtenerClientesRiesgo = () =>
  request("get", "cliente/clientes-riesgo");

// Obtener clientes que han reducido su IMC en un período
export const obtenerClientesReduccionIMC = (meses) =>
  request("get", `cliente/reduccion-imc?meses=${meses}`);

// Obtener clientes con mejora en fuerza
export const obtenerClientesGananciaFuerza = () =>
  request("get", "cliente/ganancia-fuerza");

// Obtener clientes con mejora en capacidad aeróbica
export const obtenerClientesProgresoAerobico = () =>
  request("get", "cliente/progreso-aerobico");