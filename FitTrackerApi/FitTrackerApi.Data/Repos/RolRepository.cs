using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace Data.Repos
{
    public class RolRepository : IRolRepository
    {
        private readonly MysqlConfig _config;
        public RolRepository(MysqlConfig config) => _config = config;
        protected MySqlConnection GetConnection() => new MySqlConnection(_config.ConnectionString);

        public async Task<int> InsertRolAsync(Rol rol)
        {
            int newId = 0;
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new MySqlCommand("InsertarRol", conn, (MySqlTransaction)transaction)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Nombre", rol.Nombre);
                cmd.Parameters.AddWithValue("prm_Descripcion", rol.Descripcion);

                var output = new MySqlParameter("prm_IdGenerado", MySqlDbType.Int32)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(output);

                await cmd.ExecuteNonQueryAsync();
                newId = Convert.ToInt32(output.Value);

                if (newId > 0 && rol.Accesos != null)
                {
                    foreach (var acceso in rol.Accesos)
                    {
                        using var cmdAcceso = new MySqlCommand("InsertarRolAcceso", conn, (MySqlTransaction)transaction)
                        {
                            CommandType = CommandType.StoredProcedure
                        };
                        cmdAcceso.Parameters.AddWithValue("prm_RolId", newId);
                        cmdAcceso.Parameters.AddWithValue("prm_PantallaId", acceso.PantallaId);
                        cmdAcceso.Parameters.AddWithValue("prm_Acceso", acceso.Acceso);
                        await cmdAcceso.ExecuteNonQueryAsync();
                    }
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                LogHelper.LogError(nameof(InsertRolAsync), ex);
                newId = 0;
            }

            return newId;
        }

        public async Task<bool> UpdateRolAsync(Rol rol)
        {
            bool success = false;
            using var conn = GetConnection();
            await conn.OpenAsync();
            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new MySqlCommand("ActualizarRol", conn, (MySqlTransaction)transaction)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Id", rol.Id);
                cmd.Parameters.AddWithValue("prm_Nombre", rol.Nombre);
                cmd.Parameters.AddWithValue("prm_Descripcion", rol.Descripcion);

                var affected = await cmd.ExecuteNonQueryAsync();
                if (affected <= 0) throw new Exception("No se actualizó el rol.");

                if (rol.Accesos != null)
                {
                    foreach (var acceso in rol.Accesos)
                    {
                        using var cmdAcceso = new MySqlCommand("ActualizarRolAcceso", conn, (MySqlTransaction)transaction)
                        {
                            CommandType = CommandType.StoredProcedure
                        };
                        cmdAcceso.Parameters.AddWithValue("prm_RolId", rol.Id);
                        cmdAcceso.Parameters.AddWithValue("prm_PantallaId", acceso.PantallaId);
                        cmdAcceso.Parameters.AddWithValue("prm_Acceso", acceso.Acceso);
                        await cmdAcceso.ExecuteNonQueryAsync();
                    }
                }

                await transaction.CommitAsync();
                success = true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                LogHelper.LogError(nameof(UpdateRolAsync), ex);
            }

            return success;
        }

        public async Task<Rol?> GetRolConAccesos(int id)
        {
            try
            {
                Rol? rol = null;

                using var conn = GetConnection();
                await conn.OpenAsync();

                // 1. Obtener datos del rol
                using (var cmdRol = new MySqlCommand("SGetRol", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmdRol.Parameters.AddWithValue("prm_Id", id);

                    using var reader = await cmdRol.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        rol = new Rol
                        {
                            Id = reader.GetInt32("id"),
                            Nombre = reader.GetString("nombre"),
                            Descripcion = reader.GetString("descripcion"),
                            Accesos = new List<RolAcceso>()
                        };
                    }
                }

                if (rol == null)
                    return null;

                // 2. Obtener accesos del rol
                using (var cmdAccesos = new MySqlCommand("SGetRolAccesos", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmdAccesos.Parameters.AddWithValue("prm_Id", id);

                    using var readerAcc = await cmdAccesos.ExecuteReaderAsync();
                    while (await readerAcc.ReadAsync())
                    {
                        rol.Accesos.Add(new RolAcceso
                        {
                            RolId = readerAcc.GetInt32("rol_id"),
                            PantallaId = readerAcc.GetInt32("pantalla_id"),
                            Acceso = readerAcc.GetString("acceso")
                        });
                    }
                }

                return rol;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(GetRolConAccesos), ex);
                return null;
            }
        }

        public async Task<IEnumerable<Rol>> SListaRoles()
        {
            var roles = new List<Rol>();
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SListaRoles", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    roles.Add(new Rol
                    {
                        Id = reader.GetInt32("id"),
                        Nombre = reader.GetString("nombre"),
                        Descripcion = reader.GetString("descripcion"),
                        Accesos = new List<RolAcceso>() // opcionalmente puedes omitir esto
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SListaRoles), ex);
            }

            return roles;
        }
    }
}
