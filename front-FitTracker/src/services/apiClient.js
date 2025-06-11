import axios from 'axios';

export const API_ROOT = 'https://localhost:44323'; // Solo dominio/base
const API_BASE_URL = `${API_ROOT}/api/`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar tokens aquí si es necesario
  },
});

// Método para solicitudes dinámicas
export const request = async (method, endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} ${endpoint} error:`, error);
    // Lanzar el error original, no solo la respuesta
    throw error; // Cambiado de "throw error.response || error"
  }
};
