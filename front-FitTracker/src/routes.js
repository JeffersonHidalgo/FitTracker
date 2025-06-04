import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import UserPermissionsNew from "views/user-permissons.js";
import ClientForm from "views/ClientForm.js";
import MetricsRegistration from "views/examples/MetricsRegistration.js";
import ClienteHistorialMetricas from "views/ClienteHistorialMetricas";
import RoleManagement from "views/RoleManagement";
import RecomendacionAdmin from "views/RecomendacionAdmin";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
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
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
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
    name: "Gestión de Cliente",
    icon: "ni ni-single-02 text-green",
    component: <ClientForm />,
    layout: "/admin",
  },
  {
    path: "/metrics-registration",
    name: "Metrics Registration",
    icon: "ni ni-ruler-pencil text-green",
    component: <MetricsRegistration />,
    layout: "/admin",
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
