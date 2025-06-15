# FitTracker - Sistema de Gestión para Centros de Fitness

![FitTracker Logo](public/fittracker-logo.jpg)

## Descripción

FitTracker es una aplicación web completa para la gestión de gimnasios y centros de fitness, enfocada en el seguimiento del progreso físico de los clientes. Permite registrar y monitorear métricas físicas, generar reportes detallados, y proporcionar recomendaciones personalizadas para mejorar la experiencia de los clientes.

## Tecnologías Utilizadas

- **Frontend**: React, Reactstrap, React Router
- **Estilos**: Bootstrap 4, CSS personalizado
- **Gráficos**: Chart.js, React-chartjs-2
- **Manipulación de datos**: XLSX para exportación a Excel
- **Peticiones HTTP**: Axios

## Características Principales

### 1. Gestión de Clientes
- Registro de nuevos clientes
- Modificación de información de clientes
- Consulta de información de clientes
- Activación/Desactivación de clientes

### 2. Métricas y Seguimiento
- Registro de métricas físicas (peso, altura, IMC, fuerza, capacidad aeróbica)
- Consulta de historial de métricas
- Visualización gráfica de la evolución de métricas
- Impresión y envío por email de informes de progreso

### 3. Reportes y Análisis
- Clientes por estado (activos/inactivos)
- Clientes nuevos
- Clientes sin actividad reciente
- Distribución geográfica de clientes
- Categorías de IMC
- Clientes en situación de riesgo
- Reducción de IMC
- Ganancia de fuerza
- Progreso aeróbico
- Exportación de todos los reportes a Excel

### 4. Recomendaciones Personalizadas
- Creación de recomendaciones basadas en métricas
- Asignación automática según condición física

### 5. Dashboard
- Resumen general de clientes
- Estadísticas demográficas
- Indicadores de salud
- Próximos cumpleaños

## Instalación y Configuración

### Requisitos Previos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd front-FitTracker
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo .env en la raíz del proyecto
   - Definir las variables necesarias:
     ```
     REACT_APP_API_URL=http://localhost:3001/api
     ```

4. **Iniciar la aplicación en modo desarrollo**
   ```bash
   npm start
   ```

5. **Crear build para producción**
   ```bash
   npm run build
   ```

## Estructura del Proyecto

```
front-FitTracker/
├── public/                  # Archivos públicos
├── src/                     # Código fuente
│   ├── components/          # Componentes reutilizables
│   ├── contexts/            # Contextos de React (AuthContext, etc.)
│   ├── services/            # Servicios API
│   ├── utils/               # Utilidades y funciones auxiliares
│   ├── views/               # Componentes de páginas
│   │   ├── examples/        # Vistas de ejemplo
│   │   └── reports/         # Vistas de reportes
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   └── routes.js            # Configuración de rutas
└── package.json             # Dependencias y scripts
```

## Guía de Uso

### Autenticación
- Utilice sus credenciales proporcionadas para iniciar sesión
- El sistema mostrará diferentes opciones según su rol (Administrador o Entrenador)

### Módulo de Clientes
1. Acceda a la sección "Gestión de Clientes"
2. Utilice los botones de acción para crear, modificar o consultar clientes
3. Complete los formularios con la información requerida

### Registro de Métricas
1. Acceda a "Registro de Métricas"
2. Seleccione un cliente
3. Complete las métricas físicas actuales
4. Guarde los cambios para actualizar el historial

### Reportes
1. Acceda a la sección "Reportes"
2. Seleccione el tipo de reporte deseado
3. Utilice los filtros disponibles para personalizar la información
4. Exporte a Excel si necesita trabajar con los datos externamente

## Soporte y Contacto

Para problemas o consultas, contacte al equipo de desarrollo en [email@ejemplo.com](mailto:email@ejemplo.com).

## Licencia

© 2023 FitTracker. Todos los derechos reservados.

---

*Desarrollado con ❤️ para mejorar la gestión de centros de fitness y el seguimiento del progreso de los clientes.*