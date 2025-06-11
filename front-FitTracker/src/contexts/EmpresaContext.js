import React, { createContext, useState, useEffect, useContext } from 'react';
import { obtenerConfiguracion } from '../services/configuracionService';

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
  const [empresaConfig, setEmpresaConfig] = useState({
    nombreEmpresa: 'FitTrack Admin', // Valor por defecto
    logo: null,
    direccion: '',
    telefono: '',
    email: '',
    // Otros datos relevantes
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        setLoading(true);
        const config = await obtenerConfiguracion();
        setEmpresaConfig({
          nombreEmpresa: config.nombreEmpresa || 'FitTrack Admin',
          logo: config.logo || null,
          direccion: config.direccion || '',
          telefono: config.telefonoEmpresa || '',
          email: config.emailEmpresa || '',
          // Otros campos que necesites
        });
      } catch (err) {
        console.error('Error al cargar configuración de empresa:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarConfiguracion();
  }, []);

  return (
    <EmpresaContext.Provider value={{ empresaConfig, loading }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresaContext);