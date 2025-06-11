using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Utils;

namespace Data.Repos
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly MysqlConfig _config;

        public UsuarioRepository(MysqlConfig config) => _config = config;
        protected MySqlConnection GetConnection() => new MySqlConnection(_config.ConnectionString);

        public async Task<IEnumerable<Usuario>> SlistaUsuarios()
        {
            try
            {
                var list = new List<Usuario>();
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SlistaUsuarios", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    list.Add(new Usuario
                    {
                        Id = reader.GetInt32("id"),
                        Username = reader.GetString("username"),
                        Nombre = reader.GetString("nombre"),
                        Email = reader.GetString("email"),
                        RolId = reader.GetInt32("rol_id")
                    });
                return list;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SlistaUsuarios), ex);
                return Enumerable.Empty<Usuario>();
            }
        }

        public async Task<Usuario> GetUsuarioConAccesos(int id)
        {
            try
            {
                Usuario usuario = null;
                using var conn = GetConnection();
                await conn.OpenAsync();

                // 1. Obtener datos del usuario
                using (var cmdUsuario = new MySqlCommand("SUsuario", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmdUsuario.Parameters.AddWithValue("prm_Id", id);
                    using var reader = await cmdUsuario.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        usuario = new Usuario
                        {
                            Id = reader.GetInt32("id"),
                            Username = reader.GetString("username"),
                            Nombre = reader.GetString("nombre"),
                            Password = reader.GetString("password"),
                            Email = reader.GetString("email"),
                            RolId = reader.GetInt32("rol_id"),
                            Accesos = new List<RolAcceso>()
                        };
                    }
                    await reader.CloseAsync(); // Necesario para liberar la conexión
                }

                if (usuario == null)
                    return null;

                // 2. Obtener accesos del rol del usuario
                using (var cmdAccesos = new MySqlCommand("SAccesosPorRol", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmdAccesos.Parameters.AddWithValue("prm_RolId", usuario.RolId);
                    using var readerAccesos = await cmdAccesos.ExecuteReaderAsync();

                    while (await readerAccesos.ReadAsync())
                    {
                        usuario.Accesos.Add(new RolAcceso
                        {
                            RolId = usuario.RolId,
                            PantallaId = readerAccesos.GetInt32("pantalla_id"),
                            Acceso = readerAccesos.GetString("acceso")
                        });
                    }
                }

                return usuario;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(GetUsuarioConAccesos), ex);
                return null;
            }
        }


        public async Task<int> InsertUsuario(Usuario usuario)
        {
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var transaction = await conn.BeginTransactionAsync();
            try
            {
                int codigoGenerado = 0;

                using (var cmd = new MySqlCommand("InsertarUsuario", conn, (MySqlTransaction)transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
                    cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
                    cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
                    cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
                    cmd.Parameters.AddWithValue("prm_RolId", usuario.RolId);

                    using (var reader = await cmd.ExecuteReaderAsync())
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
                await transaction.CommitAsync();
                return codigoGenerado;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(InsertUsuario), ex);
                await transaction.RollbackAsync();
                return 0;
            }
        }

        public async Task<int> UpdateUsuario(Usuario usuario)
        {
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var transaction = await conn.BeginTransactionAsync();
            try
            {
                int affected = 0;

                using (var cmd = new MySqlCommand("UpdateUsuario", conn, (MySqlTransaction)transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("prm_Id", usuario.Id);
                    cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
                    cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
                    cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
                    cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
                    cmd.Parameters.AddWithValue("prm_RolId", usuario.RolId);
                    affected = await cmd.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
                return affected;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(UpdateUsuario), ex);
                await transaction.RollbackAsync();
                return 0;
            }
        }

        public Task<Usuario> GetUsuario(int id)
        {
            try
            {
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(GetUsuario), ex);
                return Task.FromResult<Usuario>(null);
            }
        }

        public async Task<IEnumerable<Pantalla>> SlistaPantallas()
        {
            try
            {
                var list = new List<Pantalla>();
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SlistaPantallas", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    list.Add(new Pantalla
                    {
                        Id = reader.GetInt32("id"),
                        nombre = reader.GetString("nombre"),
                        descripcion = reader.GetString("descripcion"),
                        nivel = reader.GetString("nivel")
                    });
                return list;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SlistaPantallas), ex);
                return Enumerable.Empty<Pantalla>();
            }
        }

        public async Task<Usuario> ValidarCredenciales(string username, string password)
        {
            try
            {
                int? userId = null;
                using var conn = GetConnection();
                await conn.OpenAsync();

                // Validar credenciales y obtener el ID del usuario usando procedimiento almacenado
                using (var cmdLogin = new MySqlCommand("ValidarUsuario", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmdLogin.Parameters.AddWithValue("p_username", username);
                    cmdLogin.Parameters.AddWithValue("p_password", password);
                    
                    var result = await cmdLogin.ExecuteScalarAsync();
                    if (result != null && result != DBNull.Value)
                    {
                        userId = Convert.ToInt32(result);
                    }
                }

                // Si encontramos un usuario válido, obtener sus datos completos con accesos
                if (userId.HasValue)
                {
                    return await GetUsuarioConAccesos(userId.Value);
                }

                return null; // Credenciales inválidas
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ValidarCredenciales), ex);
                return null;
            }
        }
    }
}
