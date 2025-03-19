import React, { useState } from "react";
import { 
  FaHashtag, 
  FaUser, 
  FaToggleOn, 
  FaBirthdayCake, 
  FaVenusMars, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaExclamationTriangle 
} from "react-icons/fa";

const ClientForm = () => {
  const [activeTab, setActiveTab] = useState("basica");

  // Estados para teléfonos y correos (mínimo 1)
  const [phones, setPhones] = useState([{ number: "", type: "", description: "" }]);
  const [emails, setEmails] = useState([{ email: "", description: "" }]);

  const addPhone = () => {
    setPhones([...phones, { number: "", type: "", description: "" }]);
  };

  const removePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  const addEmail = () => {
    setEmails([...emails, { email: "", description: "" }]);
  };

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header con título y botones fuera del contenedor */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#4A628A" }}>
          Gestión de Cliente
        </h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 rounded-md transition-colors text-base"
            style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4A628A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#7AB2D3")
            }
          >
            Nuevo
          </button>
          <button
            className="px-4 py-2 rounded-md transition-colors text-base"
            style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4A628A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#7AB2D3")
            }
          >
            Modificar
          </button>
        </div>
      </div>

      {/* Contenedor del formulario (card) con fondo de la paleta */}
      <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#DFF2EB" }}>
        {/* Tabs Header */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("basica")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "basica" ? "border-b-2" : ""
              }`}
              style={{
                color: activeTab === "basica" ? "#4A628A" : "#7AB2D3",
                borderColor: activeTab === "basica" ? "#7AB2D3" : "transparent",
              }}
            >
              Información básica
            </button>
            <button
              onClick={() => setActiveTab("contacto")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "contacto" ? "border-b-2" : ""
              }`}
              style={{
                color: activeTab === "contacto" ? "#4A628A" : "#7AB2D3",
                borderColor: activeTab === "contacto" ? "#7AB2D3" : "transparent",
              }}
            >
              Contacto
            </button>
            <button
              onClick={() => setActiveTab("extras")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "extras" ? "border-b-2" : ""
              }`}
              style={{
                color: activeTab === "extras" ? "#4A628A" : "#7AB2D3",
                borderColor: activeTab === "extras" ? "#7AB2D3" : "transparent",
              }}
            >
              Extras
            </button>
          </nav>
        </div>

        {/* Contenido de la tab "Información básica" */}
        {activeTab === "basica" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identificador único (solo lectura) */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaHashtag className="inline mr-1" /> Codigo
              </label>
              <input
                type="text"
                readOnly
                value="001"
                className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              />
            </div>
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaUser className="inline mr-1" /> Nombre completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              />
            </div>
            {/* Estado del cliente */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaToggleOn className="inline mr-1" /> Estado del cliente
              </label>
              <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]">
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaBirthdayCake className="inline mr-1" /> Fecha de nacimiento
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              />
            </div>
            {/* Género */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaVenusMars className="inline mr-1" /> Género
              </label>
              <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]">
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
        )}

        {/* Contenido de la tab "Contacto" */}
        {activeTab === "contacto" && (
          <div>
            {/* Sección de Correos electrónicos */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#4A628A" }}>
                <FaEnvelope className="inline mr-1" /> Correos electrónicos
              </h2>
              {emails.map((email, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="email"
                    value={email.email}
                    onChange={(e) => handleEmailChange(index, "email", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Correo electrónico"
                  />
                  <input
                    type="text"
                    value={email.description}
                    onChange={(e) => handleEmailChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Descripción"
                  />
                  <button
                    className="px-2 py-1 rounded transition-colors"
                    style={{ backgroundColor: "#FFB6B6", color: "#4A628A" }}
                    onClick={() => removeEmail(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 rounded transition-colors mt-2"
                style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
                onClick={addEmail}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4A628A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7AB2D3")
                }
              >
                Agregar Correo
              </button>
            </div>
            {/* Sección de Teléfonos */}
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#4A628A" }}>
                <FaPhone className="inline mr-1" /> Teléfonos
              </h2>
              {phones.map((phone, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <input
                    type="tel"
                    value={phone.number}
                    onChange={(e) => handlePhoneChange(index, "number", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Número de teléfono"
                  />
                  <select
                    value={phone.type}
                    onChange={(e) => handlePhoneChange(index, "type", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Tipo</option>
                    <option value="Móvil">Móvil</option>
                    <option value="Casa">Casa</option>
                    <option value="Trabajo">Trabajo</option>
                  </select>
                  <input
                    type="text"
                    value={phone.description}
                    onChange={(e) => handlePhoneChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Descripción"
                  />
                  <button
                    className="px-2 py-1 rounded transition-colors"
                    style={{ backgroundColor: "#FFB6B6", color: "#4A628A" }}
                    onClick={() => removePhone(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 rounded transition-colors mt-2"
                style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
                onClick={addPhone}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4A628A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7AB2D3")
                }
              >
                Agregar Teléfono
              </button>
            </div>
          </div>
        )}

        {/* Contenido de la tab "Extras" */}
        {activeTab === "extras" && (
          <div className="space-y-6">
            {/* Sección Dirección (ahora en Extras) */}
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#4A628A" }}>
                <FaMapMarkerAlt className="inline mr-1" /> Dirección
              </h2>
              <input
                type="text"
                placeholder="Calle"
                className="w-full mb-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
                <input
                  type="text"
                  placeholder="Estado/Provincia"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
              </div>
            </div>
            {/* Sección Datos de membresía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                  <FaClipboardList className="inline mr-1" /> Tipo de membresía / plan contratado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Premium"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                  <FaCalendarAlt className="inline mr-1" /> Fecha de inicio de la membresía
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
              </div>
            </div>
            {/* Sección Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                  <FaUserCircle className="inline mr-1" /> Foto de perfil
                </label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                  <FaExclamationTriangle className="inline mr-1" /> Contacto de emergencia
                </label>
                <input
                  type="text"
                  placeholder="Nombre y teléfono"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientForm;
