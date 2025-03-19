using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

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
        public async Task<Cliente> GetCliente(int id)
        {
            Cliente? cliente = null;
            using (var connection = GetConnection())
            {
                await connection.OpenAsync();
                using (var command = new MySqlCommand("SCliente", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("prm_Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            cliente = new Cliente
                            {
                                CodigoCli = reader.GetInt32("codigo_cli"),
                                NombreCompleto = reader.GetString("nombre_completo"),
                                Estado = reader.GetString("estado"),
                                FechaNacimiento = reader.GetDateTime("fecha_nacimiento"),
                                Genero = reader.GetString("genero"),
                                Calle = reader.GetString("calle"),
                                Ciudad = reader.GetString("ciudad"),
                                Provincia = reader.GetString("provincia"),
                                CodigoPostal = reader.GetString("codigo_postal"),
                                TipoMembresia = reader.GetString("tipo_membresia"),
                                FechaInicio = reader.GetDateTime("fecha_inicio"),
                                FotoPerfil = reader.GetString("foto_perfil"),
                                ContactoEmergencia = reader.GetString("contacto_emergencia"),
                                FechaCrea = reader.GetDateTime("fecha_crea"),
                                FechaModifica = reader.GetDateTime("fecha_modifica"),
                                UsuModifica = reader.GetInt32("usu_modifica")
                            };
                        }
                    }
                }
            }
            return cliente;
        }

        // Método para insertar un cliente mediante un procedimiento almacenado
        public async Task<bool> InsertCliente(Cliente cliente)
        {
            int rowsAffected = 0;
            using (var connection = GetConnection())
            {
                await connection.OpenAsync();
                using (var command = new MySqlCommand("InsertarCliente", connection))
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
                    command.Parameters.AddWithValue("prm_FechaModifica", cliente.FechaModifica);
                    command.Parameters.AddWithValue("prm_UsuModifica", cliente.UsuModifica);

                    rowsAffected = await command.ExecuteNonQueryAsync();
                }
            }
            return rowsAffected > 0;
        }

        // Método para listar todos los clientes mediante un procedimiento almacenado
        public async Task<IEnumerable<Cliente>> SlistaClientes()
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
                                FechaNacimiento = reader.GetDateTime("fecha_nacimiento"),
                                Genero = reader.GetString("genero"),
                                Calle = reader.GetString("calle"),
                                Ciudad = reader.GetString("ciudad"),
                                Provincia = reader.GetString("provincia"),
                                CodigoPostal = reader.GetString("codigo_postal"),
                                TipoMembresia = reader.GetString("tipo_membresia"),
                                FechaInicio = reader.GetDateTime("fecha_inicio"),
                                FotoPerfil = reader.GetString("foto_perfil"),
                                ContactoEmergencia = reader.GetString("contacto_emergencia"),
                                FechaCrea = reader.GetDateTime("fecha_crea"),
                                FechaModifica = reader.GetDateTime("fecha_modifica"),
                                UsuModifica = reader.GetInt32("usu_modifica")
                            };
                            clientes.Add(cliente);
                        }
                    }
                }
            }
            return clientes;
        }

        // Método para actualizar un cliente mediante un procedimiento almacenado
        public async Task<bool> UpdateCliente(Cliente cliente)
        {
            int rowsAffected = 0;
            using (var connection = GetConnection())
            {
                await connection.OpenAsync();
                using (var command = new MySqlCommand("UpdateCliente", connection))
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
                }
            }
            return rowsAffected > 0;
        }
    }
}
