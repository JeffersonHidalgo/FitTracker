import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import ProtectedRoute from "./contexts/ProtectedRoute";
// Importar el componente AccesoDenegado
import AccesoDenegado from "./views/AccesoDenegado.js";

// Importaciones CSS
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <EmpresaProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          {/* Ruta para página de acceso denegado */}
          <Route path="/admin/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </EmpresaProvider>
);
