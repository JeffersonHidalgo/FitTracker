using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
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
                        Nivel = reader.GetString("nivel")[0]
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
                    using var readerUsuario = await cmdUsuario.ExecuteReaderAsync();

                    if (await readerUsuario.ReadAsync())
                    {
                        usuario = new Usuario
                        {
                            Id = readerUsuario.GetInt32("id"),
                            Username = readerUsuario.GetString("username"),
                            Nombre = readerUsuario.GetString("nombre"),
                            Password = readerUsuario.GetString("password"),
                            Email = readerUsuario.GetString("email"),
                            Nivel = readerUsuario.GetString("nivel")[0],
                            Accesos = new List<UsuarioAcceso>()
                        };
                    }
                }

                // 2. Obtener accesos del usuario
                if (usuario != null)
                {
                    using (var cmdAccesos = new MySqlCommand("SUsuarioConAccesos", conn) { CommandType = CommandType.StoredProcedure })
                    {
                        cmdAccesos.Parameters.AddWithValue("prm_Id", id);
                        using var readerAccesos = await cmdAccesos.ExecuteReaderAsync();

                        while (await readerAccesos.ReadAsync())
                        {
                            usuario.Accesos.Add(new UsuarioAcceso
                            {
                                UsuarioId = readerAccesos.GetInt32(readerAccesos.GetOrdinal("usuario_id")),
                                PantallaId = readerAccesos.GetInt32(readerAccesos.GetOrdinal("pantalla_id")),
                                Acceso = readerAccesos.GetString(readerAccesos.GetOrdinal("acceso"))[0]
                            });
                        }
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

        public async Task<bool> InsertUsuario(Usuario usuario)
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("InsertarUsuario", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
                cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
                cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
                cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
                cmd.Parameters.AddWithValue("prm_Nivel", usuario.Nivel);

                cmd.Parameters.Add(new MySqlParameter("id", MySqlDbType.Int32)
                {
                    Direction = ParameterDirection.Output
                });

                await cmd.ExecuteNonQueryAsync();

                usuario.Id = Convert.ToInt32(cmd.Parameters["id"].Value);
                return usuario.Id > 0;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(InsertUsuario), ex);
                return false;
            }
        }

        public async Task<bool> UpdateUsuario(Usuario usuario)
        {
            try
            {
                int affected;
                using var conn = GetConnection();
                await conn.OpenAsync();

                // Actualizar datos del usuario
                using (var cmd = new MySqlCommand("UpdateUsuario", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddWithValue("prm_Id", usuario.Id);
                    cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
                    cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
                    cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
                    cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
                    cmd.Parameters.AddWithValue("prm_Nivel", usuario.Nivel);
                    affected = await cmd.ExecuteNonQueryAsync();
                }

                // Actualizar accesos
                foreach (var acceso in usuario.Accesos)
                {
                    using var cmdAcceso = new MySqlCommand("UpdateUsuarioAcceso", conn) { CommandType = CommandType.StoredProcedure };
                    cmdAcceso.Parameters.AddWithValue("prm_UsuarioId", usuario.Id);
                    cmdAcceso.Parameters.AddWithValue("prm_PantallaId", acceso.PantallaId);
                    cmdAcceso.Parameters.AddWithValue("prm_Acceso", acceso.Acceso);
                    await cmdAcceso.ExecuteNonQueryAsync();
                }

                return affected > 0;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(UpdateUsuario), ex);
                return false;
            }
        }

        public async Task<bool> InsertUsuarioAcceso(UsuarioAcceso acceso)
        {
            try
            {
                int affected;
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("InsertarUsuarioAcceso", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.AddWithValue("prm_UsuarioId", acceso.UsuarioId);
                cmd.Parameters.AddWithValue("prm_PantallaId", acceso.PantallaId);
                cmd.Parameters.AddWithValue("prm_Acceso", acceso.Acceso);
                affected = await cmd.ExecuteNonQueryAsync();
                return affected > 0;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(InsertUsuarioAcceso), ex);
                return false;
            }
        }

        public async Task<bool> DeleteUsuarioAcceso(int usuarioId, int pantallaId)
        {
            try
            {
                int affected;
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("DeleteUsuarioAcceso", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.AddWithValue("prm_UsuarioId", usuarioId);
                cmd.Parameters.AddWithValue("prm_PantallaId", pantallaId);
                affected = await cmd.ExecuteNonQueryAsync();
                return affected > 0;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(DeleteUsuarioAcceso), ex);
                return false;
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
                    });
                return list;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SlistaPantallas), ex);
                return Enumerable.Empty<Pantalla>();
            }
        }
    }
}
