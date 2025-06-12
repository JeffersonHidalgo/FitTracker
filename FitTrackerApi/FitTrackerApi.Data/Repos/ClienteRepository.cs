using Models;
using Models.Dashboard;
using Models.Reportes;
using MySql.Data.MySqlClient;
using System.Data;
using Utils;

namespace Data.Repos
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly MysqlConfig _config;

        public ClienteRepository(MysqlConfig config)
        {
            _config = config;
        }

        // Método para obtener la conexión
        protected MySqlConnection GetConnection()
        {
            return new MySqlConnection(_config.ConnectionString);
        }

        // Método para obtener un cliente por id mediante un procedimiento almacenado
        public async Task<Cliente?> GetCliente(int id)
        {
            try
            {
                Cliente? cliente = null;
                using var connection = GetConnection();
                await connection.OpenAsync();

                // 1) Datos del cliente
                using (var cmdCliente = new MySqlCommand("SCliente", connection))
                {
                    cmdCliente.CommandType = CommandType.StoredProcedure;
                    cmdCliente.Parameters.AddWithValue("prm_Id", id);

                    using var reader = await cmdCliente.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        cliente = new Cliente
                        {
                            CodigoCli = Convertidor.ToInt(reader["codigo_cli"]),
                            NombreCompleto = Convertidor.ToStringSafe(reader["nombre_completo"]),
                            Estado = Convertidor.ToStringSafe(reader["estado"]),
                            FechaNacimiento = Convertidor.ToDateTime(reader["fecha_nacimiento"]),
                            Genero = Convertidor.ToStringSafe(reader["genero"]),
                            Calle = Convertidor.ToStringSafe(reader["calle"]),
                            Ciudad = Convertidor.ToStringSafe(reader["ciudad"]),
                            Provincia = Convertidor.ToStringSafe(reader["provincia"]),
                            CodigoPostal = Convertidor.ToStringSafe(reader["codigo_postal"]),
                            TipoMembresia = Convertidor.ToStringSafe(reader["tipo_membresia"]),
                            FechaInicio = Convertidor.ToDateTime(reader["fecha_inicio"]),
                            FotoPerfil = Convertidor.ToStringSafe(reader["foto_perfil"]),
                            ContactoEmergencia = Convertidor.ToStringSafe(reader["contacto_emergencia"]),
                            FechaCrea = Convertidor.ToDateTime(reader["fecha_crea"]),
                            FechaModifica = Convertidor.ToDateTime(reader["fecha_modifica"]),
                            UsuModifica = Convertidor.ToInt(reader["usu_modifica"]),
                            Emails = new List<ClienteEmail>(),
                            Telefonos = new List<ClienteTelefono>()
                        };
                    }
                }

                if (cliente == null)
                    return null;

                // 2) Emails
                using (var cmdEmails = new MySqlCommand("SClienteEmails", connection))
                {
                    cmdEmails.CommandType = CommandType.StoredProcedure;
                    cmdEmails.Parameters.AddWithValue("prm_CodigoCli", id);

                    using var reader = await cmdEmails.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        cliente.Emails.Add(new ClienteEmail
                        {
                            Id = Convertidor.ToInt(reader["id"]),
                            CodigoCli = id,
                            Email = Convertidor.ToStringSafe(reader["email"]),
                            Descripcion = Convertidor.ToStringSafe(reader["descripcion"]),
                            Principal = Convertidor.ToStringSafe(reader["principal"])
                        });
                    }
                }

                // 3) Teléfonos
                using (var cmdTelefonos = new MySqlCommand("SClienteTelefonos", connection))
                {
                    cmdTelefonos.CommandType = CommandType.StoredProcedure;
                    cmdTelefonos.Parameters.AddWithValue("prm_CodigoCli", id);

                    using var reader = await cmdTelefonos.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        cliente.Telefonos.Add(new ClienteTelefono
                        {
                            Id = Convertidor.ToInt(reader["id"]),
                            CodigoCli = id,
                            Numero = Convertidor.ToStringSafe(reader["numero"]),
                            Tipo = Convertidor.ToStringSafe(reader["tipo"]),
                            Descripcion = Convertidor.ToStringSafe(reader["descripcion"]),
                            Principal = Convertidor.ToStringSafe(reader["principal"])
                        });
                    }
                }

                return cliente;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(GetCliente), ex);
                return null;
            }
        }


        // Método para insertar un cliente mediante un procedimiento almacenado
        public async Task<int> InsertCliente(Cliente cliente)
        {
            using var connection = GetConnection();
            await connection.OpenAsync();
            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                int codigoGenerado = 0;

                // Insertar cliente principal
                using (var command = new MySqlCommand("InsertarCliente", connection, (MySqlTransaction)transaction))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("prm_Nombre", cliente.NombreCompleto);
                    command.Parameters.AddWithValue("prm_Estado", cliente.Estado);
                    command.Parameters.AddWithValue("prm_FechaNacimiento", cliente.FechaNacimiento);
                    command.Parameters.AddWithValue("prm_Genero", cliente.Genero);
                    command.Parameters.AddWithValue("prm_Calle", cliente.Calle);
                    command.Parameters.AddWithValue("prm_Ciudad", cliente.Ciudad);
                    command.Parameters.AddWithValue("prm_Provincia", cliente.Provincia);
                    command.Parameters.AddWithValue("prm_CodigoPostal", cliente.CodigoPostal);
                    command.Parameters.AddWithValue("prm_TipoMembresia", cliente.TipoMembresia);
                    command.Parameters.AddWithValue("prm_FechaInicio", cliente.FechaInicio);
                    command.Parameters.AddWithValue("prm_FotoPerfil", cliente.FotoPerfil);
                    command.Parameters.AddWithValue("prm_ContactoEmergencia", cliente.ContactoEmergencia);
                    command.Parameters.AddWithValue("prm_FechaCrea", cliente.FechaCrea);

                    // Parámetro de salida para obtener el código generado

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            codigoGenerado = reader.GetInt32("codigo_generado");
                        }
                    }
                }

                if (codigoGenerado <= 0)
                {
                    await transaction.RollbackAsync();
                    return 0;
                }

                // Insertar correos electrónicos
                if (cliente.Emails != null)
                {
                    foreach (var email in cliente.Emails)
                    {
                        using var cmdEmail = new MySqlCommand("InsertarClienteEmail", connection, (MySqlTransaction)transaction);
                        cmdEmail.CommandType = CommandType.StoredProcedure;
                        cmdEmail.Parameters.AddWithValue("prm_CodigoCli", codigoGenerado);
                        cmdEmail.Parameters.AddWithValue("prm_Email", email.Email);
                        cmdEmail.Parameters.AddWithValue("prm_Descripcion", email.Descripcion);
                        cmdEmail.Parameters.AddWithValue("prm_Principal", email.Principal);
                        await cmdEmail.ExecuteNonQueryAsync();
                    }
                }

                // Insertar teléfonos
                if (cliente.Telefonos != null)
                {
                    foreach (var tel in cliente.Telefonos)
                    {
                        using var cmdTel = new MySqlCommand("InsertarClienteTelefono", connection, (MySqlTransaction)transaction);
                        cmdTel.CommandType = CommandType.StoredProcedure;
                        cmdTel.Parameters.AddWithValue("prm_CodigoCli", codigoGenerado);
                        cmdTel.Parameters.AddWithValue("prm_Numero", tel.Numero);
                        cmdTel.Parameters.AddWithValue("prm_Tipo", tel.Tipo);
                        cmdTel.Parameters.AddWithValue("prm_Descripcion", tel.Descripcion);
                        cmdTel.Parameters.AddWithValue("prm_Principal", tel.Principal);
                        await cmdTel.ExecuteNonQueryAsync();
                    }
                }

                await transaction.CommitAsync();
                return codigoGenerado;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                LogHelper.LogError(nameof(InsertCliente), ex);
                return 0;
            }
        }


        // Método para listar todos los clientes mediante un procedimiento almacenado
        public async Task<IEnumerable<Cliente>> SlistaClientes()
        {
            try
            {
                var clientes = new List<Cliente>();
                using (var connection = GetConnection())
                {
                    await connection.OpenAsync();
                    using (var command = new MySqlCommand("SlistaClientes", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var cliente = new Cliente
                                {
                                    CodigoCli = reader.GetInt32("codigo_cli"),
                                    NombreCompleto = reader.GetString("nombre_completo"),
                                    Estado = reader.GetString("estado"),
                                    Provincia = reader.GetString("provincia"),
                                    Ciudad = reader.GetString("ciudad")

                                };
                                clientes.Add(cliente);
                            }
                        }
                    }
                }
                return clientes;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SlistaClientes), ex);
                return new List<Cliente>();
            }
        }

        // Método para actualizar un cliente mediante un procedimiento almacenado
        public async Task<int> UpdateCliente(Cliente cliente)
        {
            try
            {
                int rowsAffected = 0;
                using var connection = GetConnection();
                await connection.OpenAsync();

                using var transaction = await connection.BeginTransactionAsync();

                try
                {
                    // Actualizar datos del cliente
                    using (var command = new MySqlCommand("UpdateCliente", connection, (MySqlTransaction)transaction))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("prm_codigo", cliente.CodigoCli);
                        command.Parameters.AddWithValue("prm_Nombre", cliente.NombreCompleto);
                        command.Parameters.AddWithValue("prm_Estado", cliente.Estado);
                        command.Parameters.AddWithValue("prm_FechaNacimiento", cliente.FechaNacimiento);
                        command.Parameters.AddWithValue("prm_Genero", cliente.Genero);
                        command.Parameters.AddWithValue("prm_Calle", cliente.Calle);
                        command.Parameters.AddWithValue("prm_Ciudad", cliente.Ciudad);
                        command.Parameters.AddWithValue("prm_Provincia", cliente.Provincia);
                        command.Parameters.AddWithValue("prm_CodigoPostal", cliente.CodigoPostal);
                        command.Parameters.AddWithValue("prm_TipoMembresia", cliente.TipoMembresia);
                        command.Parameters.AddWithValue("prm_FechaInicio", cliente.FechaInicio);
                        command.Parameters.AddWithValue("prm_FotoPerfil", cliente.FotoPerfil);
                        command.Parameters.AddWithValue("prm_ContactoEmergencia", cliente.ContactoEmergencia);
                        command.Parameters.AddWithValue("prm_FechaCrea", cliente.FechaCrea);
                        command.Parameters.AddWithValue("prm_FechaModifica", cliente.FechaModifica);
                        command.Parameters.AddWithValue("prm_UsuModifica", cliente.UsuModifica);

                        rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected <= 0)
                        {
                            await transaction.RollbackAsync();
                            return 0;
                        }
                    }

                    // --- MANEJO DE EMAILS ---
                    if (cliente.Emails != null)
                    {
                        // Preparar lista de IDs de emails
                        var emailIds = cliente.Emails
                            .Where(e => e.Id > 0)
                            .Select(e => e.Id.ToString());
                        string emailIdsString = string.Join(",", emailIds);

                        // Eliminar emails que no están en la lista actual
                        using (var deleteCmd = new MySqlCommand("DeleteClienteEmailsNotInList", connection, (MySqlTransaction)transaction))
                        {
                            deleteCmd.CommandType = CommandType.StoredProcedure;
                            deleteCmd.Parameters.AddWithValue("prm_CodigoCli", cliente.CodigoCli);
                            deleteCmd.Parameters.AddWithValue("prm_EmailIds", emailIdsString);
                            await deleteCmd.ExecuteNonQueryAsync();
                        }

                        // Actualizar/insertar emails restantes
                        foreach (var email in cliente.Emails)
                        {
                            using var emailCmd = new MySqlCommand("UpdateClienteEmail", connection, (MySqlTransaction)transaction);
                            emailCmd.CommandType = CommandType.StoredProcedure;
                            emailCmd.Parameters.AddWithValue("prm_Id", email.Id);
                            emailCmd.Parameters.AddWithValue("prm_CodigoCli", cliente.CodigoCli);
                            emailCmd.Parameters.AddWithValue("prm_Email", email.Email);
                            emailCmd.Parameters.AddWithValue("prm_Descripcion", email.Descripcion);
                            emailCmd.Parameters.AddWithValue("prm_Principal", email.Principal);
                            await emailCmd.ExecuteNonQueryAsync();
                        }
                    }
                    else
                    {
                        // Si no hay emails, eliminar todos los existentes
                        using var deleteAllCmd = new MySqlCommand("DELETE FROM cliente_email WHERE codigo_cli = @codigoCli", 
                            connection, (MySqlTransaction)transaction);
                        deleteAllCmd.Parameters.AddWithValue("@codigoCli", cliente.CodigoCli);
                        await deleteAllCmd.ExecuteNonQueryAsync();
                    }

                    // --- MANEJO DE TELÉFONOS ---
                    if (cliente.Telefonos != null)
                    {
                        // Preparar lista de IDs de teléfonos
                        var telefonoIds = cliente.Telefonos
                            .Where(t => t.Id > 0)
                            .Select(t => t.Id.ToString());
                        string telefonoIdsString = string.Join(",", telefonoIds);

                        // Eliminar teléfonos que no están en la lista actual
                        using (var deleteCmd = new MySqlCommand("DeleteClienteTelefonosNotInList", connection, (MySqlTransaction)transaction))
                        {
                            deleteCmd.CommandType = CommandType.StoredProcedure;
                            deleteCmd.Parameters.AddWithValue("prm_CodigoCli", cliente.CodigoCli);
                            deleteCmd.Parameters.AddWithValue("prm_TelefonoIds", telefonoIdsString);
                            await deleteCmd.ExecuteNonQueryAsync();
                        }

                        // Actualizar/insertar teléfonos restantes
                        foreach (var tel in cliente.Telefonos)
                        {
                            using var telCmd = new MySqlCommand("UpdateClienteTelefono", connection, (MySqlTransaction)transaction);
                            telCmd.CommandType = CommandType.StoredProcedure;
                            telCmd.Parameters.AddWithValue("prm_Id", tel.Id);
                            telCmd.Parameters.AddWithValue("prm_CodigoCli", cliente.CodigoCli);
                            telCmd.Parameters.AddWithValue("prm_Numero", tel.Numero);
                            telCmd.Parameters.AddWithValue("prm_Tipo", tel.Tipo);
                            telCmd.Parameters.AddWithValue("prm_Descripcion", tel.Descripcion);
                            telCmd.Parameters.AddWithValue("prm_Principal", tel.Principal);
                            await telCmd.ExecuteNonQueryAsync();
                        }
                    }
                    else
                    {
                        // Si no hay teléfonos, eliminar todos los existentes
                        using var deleteAllCmd = new MySqlCommand("DELETE FROM cliente_telefono WHERE codigo_cli = @codigoCli", 
                            connection, (MySqlTransaction)transaction);
                        deleteAllCmd.Parameters.AddWithValue("@codigoCli", cliente.CodigoCli);
                        await deleteAllCmd.ExecuteNonQueryAsync();
                    }

                    await transaction.CommitAsync();
                    return cliente.CodigoCli;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    LogHelper.LogError("UpdateCliente (rollback)", ex);
                    return 0;
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(UpdateCliente), ex);
                return 0;
            }
        }
        public async Task<(int metricaId, Dictionary<string, string> seccionAnalisis, List<string> recomendaciones)> InsertarMetricasConAnalisisAsync(ClienteMetrica metricas)
        {
            int metricaId = 0;
            var seccionAnalisis = AnalizarMetricas(metricas);
            var recomendaciones = new List<string>();

            using var connection = GetConnection();
            await connection.OpenAsync();
            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                if (metricas.Peso.HasValue && metricas.Altura.HasValue && metricas.Altura > 0)
                {
                    decimal alturaEnMetros = metricas.Altura.Value / 100.0m;
                    metricas.IMC = Math.Round(metricas.Peso.Value / (alturaEnMetros * alturaEnMetros), 2);
                }
                else
                {
                    metricas.IMC = null;
                }
                // 1. Insertar métricas del cliente
                using (var cmd = new MySqlCommand("InsertarClienteMetricas", connection, (MySqlTransaction)transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("prm_CodigoCli", metricas.CodigoCli);
                    cmd.Parameters.AddWithValue("prm_SistemaMetrico", metricas.SistemaMetrico ?? "M"); // Default a métrico si es null
                    cmd.Parameters.AddWithValue("prm_Peso", metricas.Peso ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Altura", metricas.Altura ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Imc", metricas.IMC ?? 0m);
                    cmd.Parameters.AddWithValue("prm_GrasaCorporal", metricas.GrasaCorporal ?? 0m);
                    cmd.Parameters.AddWithValue("prm_MasaMuscular", metricas.MasaMuscular ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Cintura", metricas.Cintura ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Caderas", metricas.Caderas ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Brazos", metricas.Brazos ?? 0m);
                    cmd.Parameters.AddWithValue("prm_RmPress", metricas.RmPress ?? 0m);
                    cmd.Parameters.AddWithValue("prm_RmSentadilla", metricas.RmSentadilla ?? 0m);
                    cmd.Parameters.AddWithValue("prm_RmPesoMuerto", metricas.RmPesoMuerto ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Repeticiones", metricas.Repeticiones ?? 0);
                    cmd.Parameters.AddWithValue("prm_VelocidadEjecucion", metricas.VelocidadEjecucion ?? 0m);
                    cmd.Parameters.AddWithValue("prm_TestCooper", metricas.TestCooper ?? 0m);
                    cmd.Parameters.AddWithValue("prm_FcReposo", metricas.FcReposo ?? 0);
                    cmd.Parameters.AddWithValue("prm_FcRecuperacion", metricas.FcRecuperacion ?? 0);
                    cmd.Parameters.AddWithValue("prm_DuracionAerobica", metricas.DuracionAerobica ?? 0m);
                    cmd.Parameters.AddWithValue("prm_TestFlexibilidad", metricas.TestFlexibilidad ?? 0m);
                    cmd.Parameters.AddWithValue("prm_RangoMovimiento", metricas.RangoMovimiento ?? 0m);
                    cmd.Parameters.AddWithValue("prm_SaltoVertical", metricas.SaltoVertical ?? 0m);
                    cmd.Parameters.AddWithValue("prm_VelocidadSprint", metricas.VelocidadSprint ?? 0m);
                    cmd.Parameters.AddWithValue("prm_PruebaAgilidad", metricas.PruebaAgilidad ?? 0m);
                    cmd.Parameters.AddWithValue("prm_Rpe", metricas.Rpe ?? 0m);

                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                        metricaId = Convert.ToInt32(reader["metrica_id"]);
                    await reader.CloseAsync();
                }

                // 2. Insertar resumen del análisis
                using (var cmd = new MySqlCommand("InsertarRespuestasAnalisis", connection, (MySqlTransaction)transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("prm_CodigoCli", metricas.CodigoCli);
                    cmd.Parameters.AddWithValue("prm_MetricaId", metricaId);
                    
                    // Evitar valores nulos usando string vacío como valor por defecto
                    cmd.Parameters.AddWithValue("prm_Antropometria", 
                        seccionAnalisis.GetValueOrDefault("Antropometria") ?? string.Empty);
                    cmd.Parameters.AddWithValue("prm_FuerzaResistencia", 
                        seccionAnalisis.GetValueOrDefault("FuerzaResistencia") ?? string.Empty);
                    cmd.Parameters.AddWithValue("prm_Cardio", 
                        seccionAnalisis.GetValueOrDefault("Cardio") ?? string.Empty);
                    cmd.Parameters.AddWithValue("prm_Flexibilidad", 
                        seccionAnalisis.GetValueOrDefault("Flexibilidad") ?? string.Empty);
                    cmd.Parameters.AddWithValue("prm_PotenciaAgilidad", 
                        seccionAnalisis.GetValueOrDefault("PotenciaAgilidad") ?? string.Empty);
                    cmd.Parameters.AddWithValue("prm_EsfuerzoPercibido", 
                        seccionAnalisis.GetValueOrDefault("EsfuerzoPercibido") ?? string.Empty);

                    await cmd.ExecuteNonQueryAsync();
                }

                // 3. Obtener recomendaciones
                foreach (var (seccion, texto) in seccionAnalisis)
                {
                    using var recCmd = new MySqlCommand("SRecomendacionesPorCondicion", connection, (MySqlTransaction)transaction);
                    recCmd.CommandType = CommandType.StoredProcedure;
                    recCmd.Parameters.AddWithValue("prm_Seccion", seccion);
                    recCmd.Parameters.AddWithValue("prm_Texto", texto);

                    using var recReader = await recCmd.ExecuteReaderAsync();
                    while (await recReader.ReadAsync())
                    {
                        recomendaciones.Add(recReader.GetString("recomendacion"));
                    }
                    await recReader.CloseAsync();
                }

                await transaction.CommitAsync();
                return (metricaId, seccionAnalisis, recomendaciones);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                LogHelper.LogError("InsertarMetricasConAnalisisAsync", ex);
                return (0, new Dictionary<string, string>(), new List<string>());
            }
        }

        private Dictionary<string, string> AnalizarMetricas(ClienteMetrica m)
        {
            var result = new Dictionary<string, string>();

            // ANTROPOMETRÍA
            if (m.Peso.HasValue && m.Altura.HasValue && m.Altura > 0)
            {
                var imc = (double)m.Peso / Math.Pow((double)m.Altura / 100, 2); // altura en cm
                if (imc < 18.5)
                    result["Antropometria"] = "Bajo peso";
                else if (imc < 25)
                    result["Antropometria"] = "IMC normal";
                else if (imc < 30)
                    result["Antropometria"] = "Sobrepeso";
                else
                    result["Antropometria"] = "Obesidad";
            }

            // FUERZA Y RESISTENCIA
            if (m.RmPress > 0 || m.RmSentadilla > 0 || m.RmPesoMuerto > 0)
            {
                if ((m.RmPress ?? 0) < 40 || (m.RmSentadilla ?? 0) < 60)
                    result["FuerzaResistencia"] = "Baja fuerza";
                else if ((m.RmPress ?? 0) > 80 || (m.RmSentadilla ?? 0) > 100)
                    result["FuerzaResistencia"] = "Progreso en fuerza";
                else
                    result["FuerzaResistencia"] = "Fuerza promedio";
            }

            // CARDIO
            if (m.FcReposo.HasValue && m.FcRecuperacion.HasValue)
            {
                if (m.FcReposo > 85)
                    result["Cardio"] = "Alta frecuencia cardiaca";
                else if (m.FcRecuperacion - m.FcReposo < -30)
                    result["Cardio"] = "Buena recuperación";
                else
                    result["Cardio"] = "Baja resistencia";
            }

            // FLEXIBILIDAD
            if (m.TestFlexibilidad.HasValue || m.RangoMovimiento.HasValue)
            {
                double total = 0;
                int count = 0;

                if (m.TestFlexibilidad.HasValue)
                {
                    total += Convertidor.ToDouble(m.TestFlexibilidad.Value);
                    count++;
                }

                if (m.RangoMovimiento.HasValue)
                {
                    total += Convertidor.ToDouble(m.RangoMovimiento.Value);
                    count++;
                }

                double promedio = total / count;

                if (promedio < 15)
                    result["Flexibilidad"] = "Flexibilidad limitada";
                else if (promedio <= 25)
                    result["Flexibilidad"] = "Flexibilidad aceptable";
                else
                    result["Flexibilidad"] = "Flexibilidad óptima";
            }


            // POTENCIA Y AGILIDAD
            if (m.SaltoVertical.HasValue || m.VelocidadSprint.HasValue)
            {
                if ((m.SaltoVertical ?? 0) > 50m && (m.VelocidadSprint ?? 0) < 4.5m)
                    result["PotenciaAgilidad"] = "Buena potencia y agilidad";
                else
                    result["PotenciaAgilidad"] = "Potencia mejorable";
            }

            // ESFUERZO PERCIBIDO
            if (m.Rpe.HasValue)
            {
                if (m.Rpe >= 8)
                    result["EsfuerzoPercibido"] = "Esfuerzo excesivo";
                else if (m.Rpe <= 4)
                    result["EsfuerzoPercibido"] = "Esfuerzo insuficiente";
                else
                    result["EsfuerzoPercibido"] = "Carga manejable";
            }

            return result;
        }

        public async Task<IEnumerable<ClienteMetricasHistorial>> ObtenerHistorialMetricas(int codigoCli)
        {
            var historial = new List<ClienteMetricasHistorial>();

            try
            {
                using var connection = GetConnection();
                await connection.OpenAsync();

                using var command = new MySqlCommand("SClienteHistorialMetricas", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("prm_CodigoCli", codigoCli);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    historial.Add(new ClienteMetricasHistorial
                    {
                        MetricaId =  reader.GetInt32("id"),
                        FechaRegistro =  reader.GetDateTime("fecha_registro"),
                        IMC = Convertidor.ToDecimal(reader.GetDecimal("imc")),
                        GrasaCorporal = Convertidor.ToDecimal(reader.GetDecimal("grasa_corporal")),
                        MasaMuscular = Convertidor.ToDecimal(reader.GetDecimal("masa_muscular")),
                        RmPress = Convertidor.ToDecimal(reader.GetDecimal("rm_press")),
                        RmSentadilla = Convertidor.ToDecimal(reader.GetDecimal("rm_sentadilla")),
                        RmPesoMuerto = Convertidor.ToDecimal(reader.GetDecimal("rm_peso_muerto")),
                        TestCooper = Convertidor.ToDecimal(reader.GetDecimal("test_cooper")),
                        FcReposo = reader.GetInt32("fc_reposo"),
                        TestFlexibilidad = Convertidor.ToDecimal(reader.GetDecimal("test_flexibilidad")),
                        SaltoVertical = Convertidor.ToDecimal(reader.GetDecimal("salto_vertical")),
                        Rpe = Convertidor.ToDecimal(reader.GetDecimal("rpe"))
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerHistorialMetricas), ex);
            }

            return historial;
        }
        public async Task<IEnumerable<ClienteMetricasHistorial>> ObtenerHistorialCompletoAsync(int codigoCli)
        {
            var historial = new List<ClienteMetricasHistorial>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using (var cmd = new MySqlCommand("SClienteHistorialMetricasCompleto", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddWithValue("prm_CodigoCli", codigoCli);
                    using var reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        var metricaId = reader.GetInt32("metrica_id");

                        var item = new ClienteMetricasHistorial
                        {
                            MetricaId = metricaId,
                            FechaRegistro = reader.GetDateTime("fecha_registro"),
                            IMC = reader["imc"] as decimal?,
                            GrasaCorporal = reader["grasa_corporal"] as decimal?,
                            MasaMuscular = reader["masa_muscular"] as decimal?,
                            RmPress = reader["rm_press"] as decimal?,
                            RmSentadilla = reader["rm_sentadilla"] as decimal?,
                            RmPesoMuerto = reader["rm_peso_muerto"] as decimal?,
                            TestCooper = reader["test_cooper"] as decimal?,
                            FcReposo = reader["fc_reposo"] as int?,
                            TestFlexibilidad = reader["test_flexibilidad"] as decimal?,
                            SaltoVertical = reader["salto_vertical"] as decimal?,
                            Rpe = reader["rpe"] as decimal?,
                            ResumenPorSeccion = new Dictionary<string, string>
                            {
                                ["Antropometria"] = Convertidor.ToStringSafe(reader["antropometria"]),
                                ["FuerzaResistencia"] = Convertidor.ToStringSafe(reader["fuerza_resistencia"]),
                                ["Cardio"] = Convertidor.ToStringSafe(reader["cardio"]),
                                ["Flexibilidad"] = Convertidor.ToStringSafe(reader["flexibilidad"]),
                                ["PotenciaAgilidad"] = Convertidor.ToStringSafe(reader["potencia_agilidad"]),
                                ["EsfuerzoPercibido"] = Convertidor.ToStringSafe(reader["esfuerzo_percibido"])
                            },
                            Recomendaciones = new List<string>()
                        };

                        historial.Add(item);
                    }
                }

                foreach (var h in historial)
                {
                    foreach (var (seccion, texto) in h.ResumenPorSeccion)
                    {
                        using var cmdRec = new MySqlCommand("SRecomendacionesPorCondicion", conn)
                        {
                            CommandType = CommandType.StoredProcedure
                        };

                        cmdRec.Parameters.AddWithValue("prm_Seccion", seccion);
                        cmdRec.Parameters.AddWithValue("prm_Texto", texto);

                        using var readerRec = await cmdRec.ExecuteReaderAsync();
                        while (await readerRec.ReadAsync())
                        {
                            h.Recomendaciones.Add(readerRec.GetString("recomendacion"));
                        }

                        await readerRec.CloseAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerHistorialCompletoAsync), ex);
            }

            return historial;
        }
        public async Task<MetricasAnalisisDto> ObtenerMetricasConAnalisisAsync(int codigoCli)
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SMetricas_Con_Analisis", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_codigoCli", codigoCli);

                using var reader = await cmd.ExecuteReaderAsync(CommandBehavior.Default);

                MetricasAnalisisDto result = null;

                // Primer resultset: datos de métricas + análisis
                if (await reader.ReadAsync())
                {
                    result = new MetricasAnalisisDto
                    {
                        MetricaId = reader.GetInt32("metricaId"),
                        CodigoCli = reader.GetInt32("codigoCli"),
                        FechaRegistro = reader.GetDateTime("fecha_registro"),
                        Imc = reader.GetDecimal("imc"),
                        GrasaCorporal = reader.GetDecimal("grasa_corporal"),
                        MasaMuscular = reader.GetDecimal("masa_muscular"),
                        RmPress = reader.GetDecimal("rm_press"),
                        RmSentadilla = reader.GetDecimal("rm_sentadilla"),
                        RmPesoMuerto = reader.GetDecimal("rm_peso_muerto"),
                        TestCooper = reader.GetDecimal("test_cooper"),
                        FcReposo = reader.GetInt32("fc_reposo"),
                        Flexibilidad = reader.GetDecimal("test_flexibilidad"),
                        SaltoVertical = reader.GetDecimal("salto_vertical"),
                        Rpe = reader.GetDecimal("rpe"),
                        ResumenAnalisis = new Dictionary<string, string>(),
                        Recomendaciones = new List<string>()
                    };
                }
                else
                {
                    return null; // No encontró métricas
                }

                // Segundo resultset: análisis por sección
                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        string seccion = reader.GetString("seccion");
                        string texto = reader.GetString("analisis");

                        result.ResumenAnalisis[seccion] = texto;
                    }
                }

                // Para cada análisis, obtener recomendaciones
                foreach (var (seccion, texto) in result.ResumenAnalisis)
                {
                    using var connRec = GetConnection(); // NUEVA conexión
                    await connRec.OpenAsync();

                    using var cmdRec = new MySqlCommand("SRecomendacionesPorCondicion", connRec)
                    {
                        CommandType = CommandType.StoredProcedure
                    };

                    cmdRec.Parameters.AddWithValue("prm_Seccion", seccion);
                    cmdRec.Parameters.AddWithValue("prm_Texto", texto);

                    using var readerRec = await cmdRec.ExecuteReaderAsync();
                    while (await readerRec.ReadAsync())
                    {
                        result.Recomendaciones.Add(readerRec.GetString("recomendacion"));
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerMetricasConAnalisisAsync), ex);
                return null;
            }
        }


        public async Task<DashboardSummaryDto> ObtenerResumenDashboardAsync()
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SResumenClientes", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync()) return null;

                return new DashboardSummaryDto
                {
                    TotalClients = reader.GetInt32("totalClients"),
                    ActiveClients = reader.GetInt32("activeClients"),
                    InactiveClients = reader.GetInt32("inactiveClients"),
                    ActivePercentage = reader.GetInt32("activePercentage"),
                    InactivePercentage = reader.GetInt32("inactivePercentage"),
                    NewLast30 = reader.GetInt32("newLast30"),
                    NewLast7 = reader.GetInt32("newLast7")
                };
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerResumenDashboardAsync), ex);
                return null;
            }
        }

        public async Task<DashboardDemografiaDto> ObtenerDemografiaDashboardAsync()
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SDemografiaClientes", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();

                // 1º resultset: género
                await reader.ReadAsync();
                var dem = new DashboardDemografiaDto
                {
                    Female = reader.GetInt32("female"),
                    Male = reader.GetInt32("male"),
                    Other = reader.GetInt32("other")
                };

                // 2º resultset: edades
                await reader.NextResultAsync();
                await reader.ReadAsync();
                dem.Age18_25 = reader.GetInt32("18-25");
                dem.Age26_35 = reader.GetInt32("26-35");
                dem.Age36_45 = reader.GetInt32("36-45");
                dem.Age46Plus = reader.GetInt32("46+");
                dem.AverageAge = reader.GetInt32("average");

                // 3º resultset: ubicación
                dem.Location = new List<LocationDto>();
                await reader.NextResultAsync();
                while (await reader.ReadAsync())
                {
                    dem.Location.Add(new LocationDto
                    {
                        City = reader.GetString("city"),
                        Clients = reader.GetInt32("clients")
                    });
                }

                return dem;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerDemografiaDashboardAsync), ex);
                return null;
            }
        }

        public async Task<DashboardSaludDto> ObtenerIndicadoresSaludAsync()
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SIndicadoresSalud", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();

                // 1º resultset: promedios
                await reader.ReadAsync();
                var dto = new DashboardSaludDto
                {
                    Bmi = reader.GetDecimal("bmi"),
                    BodyFat = reader.GetDecimal("bodyFat"),
                    MuscleMass = reader.GetDecimal("muscleMass"),
                    BmiTrend = new List<TrendDto>()
                };

                // 2º resultset: tendencia
                await reader.NextResultAsync();
                while (await reader.ReadAsync())
                {
                    dto.BmiTrend.Add(new TrendDto
                    {
                        Month = reader.GetString("month"),
                        Value = reader.GetDecimal("value")
                    });
                }
                return dto;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerIndicadoresSaludAsync), ex);
                return null;
            }
        }

        public async Task<IEnumerable<CumpleanosDto>> ObtenerCumpleanosProximosAsync()
        {
            try
            {
                var list = new List<CumpleanosDto>();
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SCumpleanosProximos", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new CumpleanosDto
                    {
                        Name = reader.GetString("name"),
                        Date = reader.GetString("date")
                    });
                }
                return list;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerCumpleanosProximosAsync), ex);
                return Enumerable.Empty<CumpleanosDto>();
            }
        }
        public async Task<IEnumerable<ClienteEstadoDto>> ObtenerClientesPorEstadoAsync()
        {
            var lista = new List<ClienteEstadoDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesPorEstado", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteEstadoDto
                    {
                        ClienteId = reader.IsDBNull(reader.GetOrdinal("codigo_cli")) ? 0 : reader.GetInt32("codigo_cli"),
                        NombreCompleto = reader.IsDBNull(reader.GetOrdinal("nombre_completo")) ? string.Empty : reader.GetString("nombre_completo"),
                        FechaInicio = (DateTime)(reader.IsDBNull(reader.GetOrdinal("fecha_inicio")) ? (DateTime?)null : reader.GetDateTime("fecha_inicio")),
                        EmailPrincipal = reader.IsDBNull(reader.GetOrdinal("email")) ? string.Empty : reader.GetString("email"),
                        TelefonoPrincipal = reader.IsDBNull(reader.GetOrdinal("numero")) ? string.Empty : reader.GetString("numero"),
                        Estado = reader.IsDBNull(reader.GetOrdinal("estado")) ? null : reader.GetString("estado")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesPorEstadoAsync), ex);
            }

            return lista;
        }

        public async Task<IEnumerable<ClienteNuevoDto>> ObtenerNuevosClientesAsync(int dias)
        {
            var lista = new List<ClienteNuevoDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesNuevosPorDias", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.AddWithValue("prm_dias", dias);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteNuevoDto
                    {
                        ClienteId = reader.GetInt32("codigo_cli"),
                        NombreCompleto = reader.GetString("nombre_completo"),
                        FechaRegistro = reader.GetDateTime("fecha_crea"),
                        Ciudad = reader.GetString("ciudad"),
                        Provincia = reader.GetString("provincia")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerNuevosClientesAsync), ex);
            }

            return lista;
        }

        public async Task<IEnumerable<ClienteSinActividadDto>> ObtenerClientesSinActividadAsync(int dias)
        {
            var lista = new List<ClienteSinActividadDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesSinActividad", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_dias", dias);

                using var reader = await cmd.ExecuteReaderAsync();

                // Get column ordinals once before reading rows
                int ordinalCodigo = reader.GetOrdinal("codigo_cli");
                int ordinalNombre = reader.GetOrdinal("nombre_completo");
                int ordinalUltimaMetrica = reader.GetOrdinal("UltimaMetrica");
                int ordinalEmail = reader.GetOrdinal("email");
                int ordinalTelefono = reader.GetOrdinal("numero");

                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteSinActividadDto
                    {
                        // Handle potential NULL for integer
                        ClienteId = reader.IsDBNull(ordinalCodigo)
                            ? 0
                            : reader.GetInt32(ordinalCodigo),

                        // Handle potential NULL for string
                        NombreCompleto = reader.IsDBNull(ordinalNombre)
                            ? string.Empty
                            : reader.GetString(ordinalNombre),

                        // Handle potential NULL for DateTime
                        UltimaMetrica = reader.IsDBNull(ordinalUltimaMetrica)
                            ? (DateTime?)null
                            : reader.GetDateTime(ordinalUltimaMetrica),

                        // Safe handling for string columns
                        EmailPrincipal = reader.IsDBNull(ordinalEmail)
                            ? string.Empty
                            : Convertidor.ToStringSafe(reader.GetString(ordinalEmail)),

                        TelefonoPrincipal = reader.IsDBNull(ordinalTelefono)
                            ? string.Empty
                            : Convertidor.ToStringSafe(reader.GetString(ordinalTelefono))
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesSinActividadAsync), ex);
            }

            return lista;
        }
        public async Task<IEnumerable<ClienteImcCategoriaDto>> ObtenerClientesPorCategoriaImcAsync()
        {
            var lista = new List<ClienteImcCategoriaDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesPorCategoriaIMC", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteImcCategoriaDto
                    {
                        ClienteId = reader.GetInt32("ClienteId"),
                        NombreCompleto = reader.GetString("NombreCompleto"),
                        ImcActual = reader.GetDecimal("IMC"),
                        Categoria = reader.GetString("CategoriaIMC"),
                        FechaUltimaMedicion = reader.GetDateTime("FechaUltimaMedicion")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesPorCategoriaImcAsync), ex);
            }

            return lista;
        }
        public async Task<IEnumerable<ClienteRiesgoDto>> ObtenerClientesConFactoresRiesgoAsync()
        {
            var lista = new List<ClienteRiesgoDto>();
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesConFactoresRiesgo", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteRiesgoDto
                    {
                        ClienteId = reader.GetInt32("ClienteId"),
                        NombreCompleto = reader.GetString("NombreCompleto"),
                        Imc = (decimal)(reader["imc"] as decimal?),
                        FcReposo = (int)(reader["fc_reposo"] as int?),
                        TestCooper = (decimal)(reader["test_cooper"] as decimal?),
                        Edad = reader.GetInt32("Edad")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesConFactoresRiesgoAsync), ex);
            }
            return lista;
        }
        public async Task<IEnumerable<ClienteCambioImcDto>> ObtenerClientesConReduccionImcAsync(int meses)
        {
            var lista = new List<ClienteCambioImcDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesReduccionImc", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_meses", meses);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteCambioImcDto
                    {
                        ClienteId = reader.GetInt32("ClienteId"),
                        NombreCompleto = reader.GetString("NombreCompleto"),
                        ImcInicial = reader.GetDecimal("ImcInicial"),
                        ImcActual = reader.GetDecimal("ImcActual"),
                        Diferencia = reader.GetDecimal("Diferencia"),
                        PorcentajeCambio = reader.GetDecimal("PorcentajeCambio")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesConReduccionImcAsync), ex);
            }

            return lista;
        }
        public async Task<IEnumerable<ClienteProgresoFuerzaDto>> ObtenerClientesConGananciaFuerzaAsync()
        {
            var lista = new List<ClienteProgresoFuerzaDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesGananciaFuerza", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteProgresoFuerzaDto
                    {
                        ClienteId = reader.GetInt32("ClienteId"),
                        NombreCompleto = reader.GetString("NombreCompleto"),
                        RmInicial = reader.GetDecimal("RmInicial"),
                        RmActual = reader.GetDecimal("RmActual"),
                        Diferencia = reader.GetDecimal("Diferencia"),
                        PorcentajeIncremento = reader.GetDecimal("PorcentajeIncremento")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerClientesConGananciaFuerzaAsync), ex);
            }

            return lista;
        }
        public async Task<IEnumerable<ClienteProgresoCardioDto>> ObtenerProgresoCapacidadAerobicaAsync()
        {
            var lista = new List<ClienteProgresoCardioDto>();

            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SClientesProgresoAerobico", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    lista.Add(new ClienteProgresoCardioDto
                    {
                        ClienteId = reader.GetInt32("ClienteId"),
                        NombreCompleto = reader.GetString("NombreCompleto"),
                        TestCooperInicial = reader.GetDecimal("TestInicial"),
                        TestCooperActual = reader.GetDecimal("TestActual"),
                        Diferencia = reader.GetDecimal("Diferencia"),
                        PorcentajeMejora = reader.GetDecimal("PorcentajeCambio")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerProgresoCapacidadAerobicaAsync), ex);
            }

            return lista;
        }


    }
}
