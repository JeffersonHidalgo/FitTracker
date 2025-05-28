using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
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
                                    Estado = reader.GetString("estado")
                                  
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

                // Transacción para asegurar consistencia
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

                    // Actualizar o insertar emails
                    if (cliente.Emails != null)
                    {
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

                    // Actualizar o insertar teléfonos
                    if (cliente.Telefonos != null)
                    {
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

    }
}
