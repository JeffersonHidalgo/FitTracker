import React, { useState } from 'react';
import {
  FaUserCircle,
  FaIdBadge,
  FaClipboardList,
  FaWeight,
  FaRulerVertical,
  FaCalculator,
  FaPercentage,
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaClock,
  FaStopwatch,
  FaArrowsAltH,
  FaArrowUp,
  FaTachometerAlt,
  FaSmile,
  FaBirthdayCake,
  FaSearch,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const MetricsRegistration = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');

  const calculateMetrics = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBmi);

      // Example calculations for body fat and muscle mass
      const calculatedBodyFat = (1.2 * calculatedBmi + 0.23 * 30 - 5.4).toFixed(2); // Example formula
      setBodyFat(calculatedBodyFat);

      const calculatedMuscleMass = (weight * (1 - calculatedBodyFat / 100)).toFixed(2); // Example formula
      setMuscleMass(calculatedMuscleMass);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6" style={{ backgroundColor: "#F8F8F8" }}>
      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4 mb-6">
        <button 
          className="px-4 py-2 rounded-md transition-colors" 
          style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
          onClick={calculateMetrics}
        >
          Calcular
        </button>
        <button 
          className="px-4 py-2 rounded-md transition-colors" 
          style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
        >
          Guardar
        </button>
        <button 
          className="px-4 py-2 rounded-md transition-colors" 
          style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
        >
          Recalcular
        </button>
        <button 
          className="px-4 py-2 rounded-md transition-colors" 
          style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
        >
          Cancelar
        </button>
      </div>

      {/* Encabezado – Consulta de Cliente */}
      <div className="flex items-center space-x-4 p-4 rounded-lg shadow-lg mb-6" style={{ backgroundColor: "#B9E5E8" }}>
        <img src="https://via.placeholder.com/80" alt="Perfil" className="w-20 h-20 rounded-full" />
        <div className="flex-grow">
        <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Cliente
          </h4>
          <div className="flex items-center space-x-2 mb-2">
            
            <input
              type="text"
              placeholder="Código"
              className="w-20 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <button 
              className="px-2 py-1 rounded-md transition-colors flex items-center" 
              style={{ backgroundColor: "#7AB2D3", color: "#DFF2EB" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4A628A"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7AB2D3"}
            >
              <FaSearch className="mr-1" /> Buscar Cliente
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaUserCircle className="inline mr-1" /> Nombre
              </label>
              <input
                type="text"
                value="Juan Pérez"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
                style={{ backgroundColor: "#E0E0E0" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaClipboardList className="inline mr-1" /> Membresía
              </label>
              <input
                type="text"
                value="Premium"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
                style={{ backgroundColor: "#E0E0E0" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaBirthdayCake className="inline mr-1" /> Fecha de Nacimiento
              </label>
              <input
                type="text"
                value="01/01/1990"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
                style={{ backgroundColor: "#E0E0E0" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaPhone className="inline mr-1" /> Teléfono
              </label>
              <input
                type="text"
                value="+123456789"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
                style={{ backgroundColor: "#E0E0E0" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaEnvelope className="inline mr-1" /> Correo
              </label>
              <input
                type="text"
                value="juan.perez@example.com"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]"
                style={{ backgroundColor: "#E0E0E0" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Ingreso de Métricas */}
      <div className="p-6 rounded-lg shadow-lg mb-6" style={{ backgroundColor: "#DFF2EB" }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: "#4A628A" }}>Registro de Métricas</h3>

        {/* 1. Datos Antropométricos y Composición Corporal */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Datos Antropométricos y Composición Corporal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Peso corporal */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaWeight className="inline mr-1" /> Peso (kg)
              </label>
              <input 
                type="number" 
                placeholder="70" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
            {/* Altura */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaRulerVertical className="inline mr-1" /> Altura (cm)
              </label>
              <input 
                type="number" 
                placeholder="175" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
            {/* IMC */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaCalculator className="inline mr-1" /> IMC
              </label>
              <input 
                type="number" 
                placeholder="22.9" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" 
                value={bmi}
                readOnly
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
            {/* % Grasa corporal */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaPercentage className="inline mr-1" /> % Grasa
              </label>
              <input 
                type="number" 
                placeholder="15" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" 
                value={bodyFat}
                readOnly
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
            {/* Masa muscular estimada */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                <FaDumbbell className="inline mr-1" /> Masa muscular (kg)
              </label>
              <input 
                type="number" 
                placeholder="50" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" 
                value={muscleMass}
                readOnly
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
            {/* Medidas de circunferencia */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Medidas de circunferencia (cintura, caderas, brazos en cm)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="number" placeholder="Cintura" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
                <input type="number" placeholder="Caderas" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
                <input type="number" placeholder="Brazos" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Indicadores de Fuerza y Resistencia */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Indicadores de Fuerza y Resistencia
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1RM - Press de banca */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                1RM Press de banca (kg)
              </label>
              <input type="number" placeholder="80" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* 1RM - Sentadilla */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                1RM Sentadilla (kg)
              </label>
              <input type="number" placeholder="100" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* 1RM - Peso muerto */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                1RM Peso muerto (kg)
              </label>
              <input type="number" placeholder="120" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Número de repeticiones */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Repeticiones (resistencia)
              </label>
              <input type="number" placeholder="10" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Velocidad de ejecución */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Velocidad de ejecución (s)
              </label>
              <input type="number" placeholder="2.5" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        {/* 3. Capacidad Aeróbica y Función Cardiovascular */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Capacidad Aeróbica y Función Cardiovascular
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test de resistencia (Cooper) */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Test de Cooper (m)
              </label>
              <input type="number" placeholder="Resultado" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Frecuencia cardíaca en reposo */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Frecuencia cardíaca en reposo (ppm)
              </label>
              <input type="number" placeholder="70" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Frecuencia de recuperación post-ejercicio */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Frecuencia de recuperación (ppm)
              </label>
              <input type="number" placeholder="90" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Duración de actividad aeróbica */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Duración de actividad (min)
              </label>
              <input type="number" placeholder="30" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        {/* 4. Flexibilidad y Movilidad */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Flexibilidad y Movilidad
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test de flexibilidad */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Test de flexibilidad (cm)
              </label>
              <input type="number" placeholder="Resultado" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Rango de movimiento */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Rango de movimiento (°)
              </label>
              <input type="number" placeholder="Medida" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        {/* 5. Potencia y Agilidad */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Potencia y Agilidad
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Salto vertical */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Salto vertical (cm)
              </label>
              <input type="number" placeholder="Resultado" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Velocidad en sprints */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Velocidad en sprints (s)
              </label>
              <input type="number" placeholder="Resultado" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            {/* Prueba de agilidad */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4A628A" }}>
                Prueba de agilidad
              </label>
              <input type="number" placeholder="Resultado" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        {/* 6. Percepción del Esfuerzo */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3" style={{ color: "#4A628A" }}>
            Percepción del Esfuerzo (RPE)
          </h4>
          <input type="number" placeholder="Escala de 1 a 10" className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7AB2D3]" style={{ backgroundColor: "#FFFFFF" }} />
        </div>
      </div>

      {/* Sección de Resultados y Cálculos */}
      <div className="p-6 rounded-lg shadow-lg mb-6" style={{ backgroundColor: "#B9E5E8" }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: "#4A628A" }}>Resultados y Cálculos</h3>
        <p className="text-sm" style={{ color: "#4A628A" }}>
          Aquí se mostrarán gráficos e indicadores visuales que evidencian tendencias y comparativas con registros anteriores.
        </p>
      </div>
    </div>
  );
};

export default MetricsRegistration;
