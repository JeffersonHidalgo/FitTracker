import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage o sessionStorage al iniciar
    const loadUser = () => {
      try {
        // Intentar cargar desde localStorage primero
        const savedUser = JSON.parse(localStorage.getItem('user'));
        // Si no existe en localStorage, intentar con sessionStorage
        const sessionUser = !savedUser ? JSON.parse(sessionStorage.getItem('user')) : null;
        
        if (savedUser) {
          // Si tiene estructura anidada usuario, extraerla
          setCurrentUser(savedUser.usuario || savedUser);
        } else if (sessionUser) {
          setCurrentUser(sessionUser.usuario || sessionUser);
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Función para actualizar el usuario en el estado y almacenamiento
  const setUser = (userData) => {
    console.log("Actualizando usuario en contexto:", userData);
    // Actualizar el estado del contexto
    setCurrentUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Actualizar la constante PANTALLA_ID_TO_ROUTE
  const PANTALLA_ID_TO_ROUTE = {
    1: "index",                            // Dashboard
    2: "client-form",                      // Gestión de Clientes
    3: "metrics-registration",             // Registro de Métricas
    4: "clientes/historial-metricas",      // Historial
    5: "empresa-config",                   // Configuración de Empresa
    6: "user-permissions",                 // Gestión de Usuarios
    7: "usuarios/roles",                   // Roles
    8: "recomendaciones",                  // Recomendaciones
    9: "reportes/clientes-por-estado",     // Reporte Clientes por Estado
    10: "reportes/clientes-nuevos",        // Reporte Clientes Nuevos
    11: "reportes/clientes-sin-actividad", // Reporte Clientes Sin Actividad
    12: "reportes/clientes-por-ubicacion", // Reporte Distribución Geográfica
    13: "reportes/clientes-imc-categorias", // Reporte Categorías IMC
    14: "reportes/clientes-riesgo",        // Reporte Clientes en Riesgo
    15: "reportes/clientes-reduccion-imc", // Reporte Reducción de IMC
    16: "reportes/clientes-ganancia-fuerza", // Reporte Ganancia de Fuerza
    17: "reportes/clientes-progreso-aerobico" // Reporte Progreso Aeróbico
  };

  // Verificar si el usuario tiene acceso a una pantalla específica
  const tieneAccesoAPantalla = (path) => {
    if (!currentUser) {
      console.log("No hay usuario autenticado");
      return false;
    }
    
    if (!currentUser.accesos || !Array.isArray(currentUser.accesos)) {
      console.log("Usuario no tiene accesos o no es un array:", currentUser.accesos);
      return false;
    }
    
    const simplePath = path.replace('/admin/', '').split('/')[0];
    console.log("Verificando acceso a:", simplePath);
    console.log("Accesos del usuario:", currentUser.accesos);
    
    // Verificar acceso a index (dashboard) para todos
    if (simplePath === "index") {
      return true;
    }
    
    // Verificar acceso usando los IDs de pantalla
    const tieneAcceso = currentUser.accesos.some(acceso => {
      // Verificar si tiene el ID de pantalla correcto y acceso 'S'
      const rutaParaEsteID = PANTALLA_ID_TO_ROUTE[acceso.pantallaId];
      
      // Comprobar si la ruta de esta pantalla coincide con la ruta solicitada
      const coincideRuta = 
        rutaParaEsteID === simplePath || 
        (rutaParaEsteID && rutaParaEsteID.includes(simplePath));
      
      const tienePermiso = acceso.acceso === 'S';
      
      const resultado = coincideRuta && tienePermiso;
      
      if (resultado) {
        console.log(`Acceso permitido por pantallaId: ${acceso.pantallaId}, ruta: ${rutaParaEsteID}`);
      }
      
      return resultado;
    });
    
    console.log("Resultado final:", tieneAcceso ? "ACCESO PERMITIDO" : "ACCESO DENEGADO");
    return tieneAcceso;
  };

  const value = {
    currentUser,
    loading,
    tieneAccesoAPantalla,
    setUser,  
    login: setUser,  // Alias para compatibilidad
    logout  
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);