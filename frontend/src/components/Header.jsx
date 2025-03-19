import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Datos de ejemplo
  const username = "Charlie";
  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Lógica de logout aquí
  };

  // Paleta:
  // #DFF2EB - Texto principal (claro)
  // #B9E5E8 - Fondo de dropdowns
  // #7AB2D3 - Hover en botones y enlaces
  // #4A628A - Fondo principal del header

  const menuItems = [
    { name: "Inicio", path: "/", submenu: [] },
    { name: "Información Cliente", path: "/", submenu: [] },
    {
      name: "Registro",
      submenu: [
        { name: "Cliente", path: "/registro/cliente" },
        { name: "Métricas", path: "/registro/metricas" },
        { name: "Planes de Entrenamiento", path: "/registro/planes" },
        { name: "Dietas", path: "/registro/dietas" }
      ]
    },
    { name: "Informes",
      submenu: [
        { name: "Progreso", path: "/registro/progreso" },
        { name: "Recomendaciones", path: "/registro/recomendaciones" }
      ] },
    {
      name: "Configuración",
      submenu: [
        { name: "Empresa", path: "/configuracion/empresa" },
        { name: "Usuarios", path: "/gestion-usuarios" },
        { name: "Cambiar mi clave", path: "/configuracion/clave" }
      ]
    }
  ];

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: "#4A628A" }}>
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Sección izquierda: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img src="./src/logo.webp" alt="Logo" className="h-8" />
              <span className="text-2xl font-semibold" style={{ color: "#DFF2EB" }}>
                FitTracker
              </span>
            </Link>
          </div>

          {/* Sección central: Menú */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-6">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.submenu ? (
                    <>
                      <button
                        className="px-3 py-2 rounded transition"
                        style={{ color: "#DFF2EB" }}
                      >
                        {item.name}
                      </button>
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-48 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ backgroundColor: "#B9E5E8" }}
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-2 text-base transition"
                            style={{ color: "#4A628A" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#7AB2D3")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="px-3 py-2 rounded transition"
                      style={{ color: "#DFF2EB" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#7AB2D3")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sección derecha: Usuario y Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="font-medium" style={{ color: "#DFF2EB" }}>
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded transition hover:bg-[#7AB2D3]"
              style={{ color: "#DFF2EB" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
            </button>
          </div>

          {/* Botón para el menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded focus:outline-none"
              style={{ color: "#DFF2EB" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: "#4A628A" }}>
          <ul className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.submenu ? (
                  <>
                    <div className="font-semibold py-2" style={{ color: "#DFF2EB" }}>
                      {item.name}
                    </div>
                    <ul className="mt-1 pl-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className="block text-base px-3 py-2 rounded transition"
                            style={{ color: "#DFF2EB" }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#7AB2D3")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="block text-base px-3 py-2 rounded transition"
                    style={{ color: "#DFF2EB" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#7AB2D3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
            {/* Opción de cerrar sesión en móvil */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-base px-3 py-2 rounded transition flex items-center space-x-2"
                style={{ color: "#DFF2EB" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7AB2D3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span>Cerrar sesión</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
