import { request } from "./apiClient";

export const obtenerResumenClientes = () => 
  request("get", "cliente/dashboard/summary");

export const obtenerDemografiaClientes = () => 
  request("get", "cliente/dashboard/demografia");

export const obtenerSaludClientes = () => 
  request("get", "cliente/dashboard/salud");

export const obtenerCumpleanios = () => 
  request("get", "cliente/dashboard/cumpleanos");