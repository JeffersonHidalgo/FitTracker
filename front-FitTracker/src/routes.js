import Index from "views/Index.js";
import EmpresaConfig from "views/examples/EmpresaConfig.js";
import Login from "views/examples/Login.js";
import UserPermissionsNew from "views/user-permissons.js";
import ClientForm from "views/ClientForm.js";
import MetricsRegistration from "views/examples/MetricsRegistration.js";
import ClienteHistorialMetricas from "views/ClienteHistorialMetricas";
import RoleManagement from "views/RoleManagement";
import RecomendacionAdmin from "views/RecomendacionAdmin";
// Importar nuevos reportes
import ClientesPorEstado from "views/reports/ClientesPorEstado";
import ClientesNuevos from "views/reports/ClientesNuevos";
import ClientesSinActividad from "views/reports/ClientesSinActividad";
import ClientesPorUbicacion from "views/reports/ClientesPorUbicacion";
// Importar los nuevos componentes de reportes
import ClientesIMCCategorias from "views/reports/ClientesIMCCategorias";
import ClientesRiesgo from "views/reports/ClientesRiesgo";
import ClientesReduccionIMC from "views/reports/ClientesReduccionIMC";
import ClientesGananciaFuerza from "views/reports/ClientesGananciaFuerza";
import ClientesProgresoAerobico from "views/reports/ClientesProgresoAerobico";

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
    name: "Usuarios",
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
  // Nuevas rutas de reportes
  {
    path: "/reportes/clientes-por-estado",
    name: "Clientes por Estado",
    icon: "ni ni-bullet-list-67 text-blue",
    component: <ClientesPorEstado />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-nuevos",
    name: "Clientes Nuevos",
    icon: "ni ni-user-run text-green",
    component: <ClientesNuevos />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-sin-actividad",
    name: "Clientes Sin Actividad",
    icon: "ni ni-time-alarm text-orange",
    component: <ClientesSinActividad />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-por-ubicacion",
    name: "Distribución Geográfica",
    icon: "ni ni-map-big text-blue",
    component: <ClientesPorUbicacion />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-imc-categorias",
    name: "Categorías IMC",
    icon: "ni ni-ruler-pencil text-info",
    component: <ClientesIMCCategorias />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-riesgo",
    name: "Clientes en Riesgo",
    icon: "ni ni-ambulance text-danger",
    component: <ClientesRiesgo />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-reduccion-imc",
    name: "Reducción de IMC",
    icon: "ni ni-chart-bar-32 text-success",
    component: <ClientesReduccionIMC />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-ganancia-fuerza",
    name: "Ganancia de Fuerza",
    icon: "ni ni-favourite-28 text-warning",
    component: <ClientesGananciaFuerza />,
    layout: "/admin",
  },
  {
    path: "/reportes/clientes-progreso-aerobico",
    name: "Progreso Aeróbico",
    icon: "ni ni-user-run text-purple",
    component: <ClientesProgresoAerobico />,
    layout: "/admin",
  },
];

export default routes;
