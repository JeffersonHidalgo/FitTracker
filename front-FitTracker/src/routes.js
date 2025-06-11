import Index from "views/Index.js";
import EmpresaConfig from "views/examples/EmpresaConfig.js";
import Login from "views/examples/Login.js";
import UserPermissionsNew from "views/user-permissons.js";
import ClientForm from "views/ClientForm.js";
import MetricsRegistration from "views/examples/MetricsRegistration.js";
import ClienteHistorialMetricas from "views/ClienteHistorialMetricas";
import RoleManagement from "views/RoleManagement";
import RecomendacionAdmin from "views/RecomendacionAdmin";

var routes = [
  {
    path: "/index",
    name: "Inicio",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    description: "Panel principal con estadísticas, gráficos e indicadores de rendimiento del sistema",
  },
  {
    path: "/empresa-config",
    name: "Configuración de Empresa",
    icon: "ni ni-building text-yellow",
    component: <EmpresaConfig />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/user-permissions",
    name: "usuarios",
    icon: "ni ni-circle-08 text-pink",
    component: <UserPermissionsNew />,
    layout: "/admin",
  },
  {
    path: "/client-form",
    name: "Gestión de Clientes",
    icon: "ni ni-single-02 text-green",
    component: <ClientForm />,
    layout: "/admin",
    description: "Administración completa de perfiles de clientes, datos personales y seguimiento",
  },
  {
    path: "/metrics-registration",
    name: "Registro de Métricas",
    icon: "ni ni-ruler-pencil text-green",
    component: <MetricsRegistration />,
    layout: "/admin",
    description: "Captura y análisis de mediciones físicas, rendimiento y progreso del cliente",
  },
  {
    path: "/clientes/historial-metricas",
    name: "Historial de Métricas",
    icon: "ni ni-chart-bar-32 text-purple",
    component: <ClienteHistorialMetricas />,
    layout: "/admin",
  },
  {
    path: "/usuarios/roles",
    name: "Roles",
    icon: "ni ni-settings-gear-65 text-blue",
    component: <RoleManagement />,
    layout: "/admin",
  },
  {
    path: "/recomendaciones",
    name: "Recomendaciones",
    icon: "fa fa-lightbulb",
    component: <RecomendacionAdmin />,
    layout: "/admin",
  },
];
export default routes;
