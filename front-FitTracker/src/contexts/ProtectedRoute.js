// Nuevo archivo: src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, tieneAccesoAPantalla } = useAuth();
  const location = useLocation();
  
  // Si está cargando, mostrar indicador o componente de carga
  if (loading) {
    return <div className="text-center p-5"><i className="fa fa-spinner fa-spin fa-3x"></i></div>;
  }

  // Si no hay usuario, redirigir al login
  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Excluir la ruta del dashboard de la verificación de permisos
  if (location.pathname === '/admin/index') {
    return children;
  }

  // Verificar si el usuario tiene acceso a esta ruta específica
  if (!tieneAccesoAPantalla(location.pathname)) {
    // Redirigir a una página de acceso denegado o al dashboard
    return <Navigate to="/admin/acceso-denegado" replace />;
  }

  // Si todo está bien, mostrar el componente protegido
  return children;
};

export default ProtectedRoute;