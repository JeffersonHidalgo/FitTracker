-- Elimina las tablas si ya existen (para evitar conflictos al ejecutar el script)
DROP TABLE IF EXISTS cliente_emails;
DROP TABLE IF EXISTS cliente_telefonos;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS usuario_accesos;
DROP TABLE IF EXISTS pantallas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS registro_metricas;

-- Tabla principal: cliente
CREATE TABLE cliente (
    codigo_cli INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,  
    estado VARCHAR(1), 
    fecha_nacimiento DATE,                     
    genero VARCHAR(1),
    calle VARCHAR(255),                           
    ciudad VARCHAR(100),                           
    provincia VARCHAR(100),                  
    codigo_postal VARCHAR(20),                    
    tipo_membresia VARCHAR(100),                   
    fecha_inicio DATE,                  
    foto_perfil VARCHAR(255),                     
    contacto_emergencia VARCHAR(255),
	fecha_crea DATE,
	fecha_modifica DATE,
    usu_modifica int
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para almacenar teléfonos asociados al cliente
CREATE TABLE cliente_telefonos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_cli INT NOT NULL,                       
    numero VARCHAR(50) NOT NULL,                    
    tipo VARCHAR(50), 
    descripcion VARCHAR(255),                       
    FOREIGN KEY (codigo_cli) REFERENCES cliente(codigo_cli) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para almacenar correos electrónicos asociados al cliente
CREATE TABLE cliente_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_cli INT NOT NULL,                       
    email VARCHAR(255) NOT NULL,                    
    descripcion VARCHAR(255),                       
    FOREIGN KEY (codigo_cli) REFERENCES cliente(codigo_cli) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,              
    username VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nivel VARCHAR(1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de pantallas o módulos del sistema
CREATE TABLE pantallas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,             
    descripcion VARCHAR(255)                
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla intermedia para gestionar el acceso de cada usuario a las pantallas
CREATE TABLE usuario_accesos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,                 
    pantalla_id INT NOT NULL,           
    acceso Varchar(1),        
    UNIQUE KEY uq_usuario_pantalla (usuario_id, pantalla_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pantalla_id) REFERENCES pantallas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Tabla para registrar las métricas del cliente
CREATE TABLE registro_metricas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_cli INT NOT NULL,                      -- Relación con la tabla de clientes
    sistema_metrico Varchar(1) NOT NULL DEFAULT 'M', -- Sistema de unidades
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de registro

    -- Datos antropométricos y composición corporal
    peso DECIMAL(5,2) DEFAULT NULL,               -- Peso (kg o lb según sistema)
    altura DECIMAL(5,2) DEFAULT NULL,             -- Altura (cm o pulgadas)
    imc DECIMAL(4,2) DEFAULT NULL,                -- Índice de masa corporal (IMC)
    grasa_corporal DECIMAL(5,2) DEFAULT NULL,       -- % de grasa corporal
    masa_muscular DECIMAL(5,2) DEFAULT NULL,        -- Masa muscular estimada
    cintura DECIMAL(5,2) DEFAULT NULL,            -- Medida de la cintura
    caderas DECIMAL(5,2) DEFAULT NULL,            -- Medida de las caderas
    brazos DECIMAL(5,2) DEFAULT NULL,             -- Medida de los brazos

    -- Indicadores de fuerza y resistencia
    rm_press DECIMAL(5,2) DEFAULT NULL,           -- 1RM Press de banca
    rm_sentadilla DECIMAL(5,2) DEFAULT NULL,        -- 1RM Sentadilla
    rm_peso_muerto DECIMAL(5,2) DEFAULT NULL,       -- 1RM Peso muerto
    repeticiones INT DEFAULT NULL,                -- Número de repeticiones (resistencia)
    velocidad_ejecucion DECIMAL(5,2) DEFAULT NULL,  -- Velocidad de ejecución (s)

    -- Capacidad aeróbica y función cardiovascular
    test_cooper DECIMAL(6,2) DEFAULT NULL,         -- Resultado del test de Cooper (m)
    fc_reposo INT DEFAULT NULL,                   -- Frecuencia cardíaca en reposo (ppm)
    fc_recuperacion INT DEFAULT NULL,             -- Frecuencia de recuperación post-ejercicio (ppm)
    duracion_aerobica DECIMAL(5,2) DEFAULT NULL,    -- Duración de la actividad aeróbica (min)

    -- Flexibilidad y movilidad
    test_flexibilidad DECIMAL(5,2) DEFAULT NULL,    -- Resultado del test de flexibilidad (cm)
    rango_movimiento DECIMAL(5,2) DEFAULT NULL,     -- Rango de movimiento (°)

    -- Potencia y agilidad
    salto_vertical DECIMAL(5,2) DEFAULT NULL,       -- Salto vertical (cm)
    velocidad_sprint DECIMAL(5,2) DEFAULT NULL,     -- Velocidad en sprints (s)
    prueba_agilidad DECIMAL(5,2) DEFAULT NULL,      -- Resultado de la prueba de agilidad

    -- Percepción del esfuerzo
    rpe DECIMAL(3,1) DEFAULT NULL,                  -- Escala de percepción del esfuerzo (RPE)

    FOREIGN KEY (codigo_cli) REFERENCES cliente(codigo_cli) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `db_fittraker`.`cliente_telefonos` 
ADD COLUMN `principal` VARCHAR(1) NULL DEFAULT 'N';

