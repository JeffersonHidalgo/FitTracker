import 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaSearch, 
  FaUser, 
  FaDesktop, 
  FaHashtag, 
  FaLock, 
  FaEnvelope, 
  FaUserTie 
} from 'react-icons/fa';

const UserPermissions = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado con botones */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0" style={{ color: "#4A628A" }}>
          Gestión de Usuarios
        </h1>
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 rounded-md transition-colors text-base"
            style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
          >
            <FaPlus className="mr-1" />
            Nuevo
          </button>
          <button 
            className="flex items-center px-4 py-2 rounded-md transition-colors text-base"
            style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
          >
            <FaEdit className="mr-1" />
            Modificar
          </button>
        </div>
      </div>
      
      {/* Formulario de campos */}
      <div className="p-6 rounded-lg shadow-md mb-8" style={{ backgroundColor: "#DFF2EB" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaHashtag className="inline-block mr-1" />Código
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="Ingresa el código"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaUser className="inline-block mr-1" />Usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="Nombre de usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaUser className="inline-block mr-1" />Nombre
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaLock className="inline-block mr-1" />Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="Ingresa la contraseña"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaLock className="inline-block mr-1" />Repetir Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="Confirma la contraseña"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaEnvelope className="inline-block mr-1" />Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
              <FaUserTie className="inline-block mr-1" />Nivel
            </label>
            <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]">
              <option>Administrador</option>
              <option>Usuario Normal</option>
              <option>Invitado</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Sección de Tablas */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabla de Usuarios */}
        <div className="flex-1 rounded-lg shadow-md" style={{ backgroundColor: "#DFF2EB" }}>
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center" style={{ color: "#4A628A" }}>
              <FaUser className="mr-2" /> Lista de Usuarios
            </h2>
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-[#4A628A]" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#B9E5E8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Nivel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Ejemplo de fila */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#4A628A" }}>001</td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#4A628A" }}>admin</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}>
                      Administrador
                    </span>
                  </td>
                </tr>
                {/* Se pueden agregar más filas según sea necesario */}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tabla de Pantallas */}
        <div className="flex-1 rounded-lg shadow-md" style={{ backgroundColor: "#DFF2EB" }}>
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center" style={{ color: "#4A628A" }}>
              <FaDesktop className="mr-2" /> Acceso a Pantallas
            </h2>
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-[#4A628A]" />
              <input
                type="text"
                placeholder="Buscar pantallas..."
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#B9E5E8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Pantalla
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: "#4A628A" }}>
                    Acceso
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Ejemplo de fila */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#4A628A" }}>Dashboard</td>
                  <td className="px-6 py-4" style={{ color: "#4A628A" }}>Panel principal</td>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="h-5 w-5 text-[#7AB2D3] rounded" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#4A628A" }}>Reportes</td>
                  <td className="px-6 py-4" style={{ color: "#4A628A" }}>Generación de reportes</td>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="h-5 w-5 text-[#7AB2D3] rounded" />
                  </td>
                </tr>
                {/* Se pueden agregar más filas según sea necesario */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
