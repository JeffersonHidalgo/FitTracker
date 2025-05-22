using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly MysqlConfig _config;
        public UsuarioRepository(MysqlConfig config) => _config = config;
        protected MySqlConnection GetConnection() => new MySqlConnection(_config.ConnectionString);

        public async Task<IEnumerable<Usuario>> SlistaUsuarios()
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

        public async Task<Usuario> GetUsuarioConAccesos(int id)
        {
            Usuario usuario = null;
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var cmd = new MySqlCommand("SUsuarioConAccesos", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("prm_Id", id);
            using var reader = await cmd.ExecuteReaderAsync();

            // Primer resultset: usuario
            if (await reader.ReadAsync())
            {
                usuario = new Usuario
                {
                    Id = reader.GetInt32("id"),
                    Username = reader.GetString("username"),
                    Nombre = reader.GetString("nombre"),
                    Email = reader.GetString("email"),
                    Nivel = reader.GetString("nivel")[0],
                    Accesos = new List<UsuarioAcceso>()
                };
            }

            // Segundo resultset: accesos
            if (usuario != null && await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    usuario.Accesos.Add(new UsuarioAcceso
                    {
                        UsuarioId = reader.GetInt32("usuario_id"),
                        PantallaId = reader.GetInt32("pantalla_id"),
                        Acceso = reader.GetString("acceso")[0]
                    });
                }
            }

            return usuario;
        }

        public async Task<bool> InsertUsuario(Usuario usuario)
        {
            int affected;
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var cmd = new MySqlCommand("InsertarUsuario", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
            cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
            cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
            cmd.Parameters.AddWithValue("prm_Nivel", usuario.Nivel);
            affected = await cmd.ExecuteNonQueryAsync();
            return affected > 0;
        }

        public async Task<bool> UpdateUsuario(Usuario usuario)
        {
            int affected;
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var cmd = new MySqlCommand("UpdateUsuario", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("prm_Id", usuario.Id);
            cmd.Parameters.AddWithValue("prm_Username", usuario.Username);
            cmd.Parameters.AddWithValue("prm_Nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("prm_Password", usuario.Password);
            cmd.Parameters.AddWithValue("prm_Email", usuario.Email);
            cmd.Parameters.AddWithValue("prm_Nivel", usuario.Nivel);
            affected = await cmd.ExecuteNonQueryAsync();
            return affected > 0;
        }

        public async Task<bool> InsertUsuarioAcceso(UsuarioAcceso acceso)
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

        public async Task<bool> DeleteUsuarioAcceso(int usuarioId, int pantallaId)
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

        public Task<Usuario> GetUsuario(int id)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<Pantalla>> SlistaPantallas()
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
    }
}
