import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const loadUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser && savedUser.usuario) {
          setCurrentUser(savedUser.usuario);
        } else if (savedUser) {
          setCurrentUser(savedUser);
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Agregar este mapeo de IDs a rutas
  const PANTALLA_ID_TO_ROUTE = {
    1: "index",               // Dashboard
    2: "client-form",         // Gestión de Clientes
    3: "metrics-registration", // Registro de Métricas
    4: "clientes/historial-metricas", // Historial
    5: "empresa-config",      // Configuración de Empresa
    6: "user-permissions",    // Gestión de Usuarios
    7: "usuarios/roles",      // Roles
    8: "recomendaciones"      // Recomendaciones
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
    
    // Simplificar path para comparar (/admin/client-form -> client-form)
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
    tieneAccesoAPantalla
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);