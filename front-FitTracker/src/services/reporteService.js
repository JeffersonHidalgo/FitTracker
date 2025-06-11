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