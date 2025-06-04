using Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Utils;

namespace Data.Repos
{
    public class RecomendacionRepository : IRecomendacionRepository
    {
        private readonly MysqlConfig _config;
        public RecomendacionRepository(MysqlConfig config) => _config = config;
        protected MySqlConnection GetConnection() => new MySqlConnection(_config.ConnectionString);

        public async Task<int> InsertarRecomendacionAsync(RecomendacionEjercicio item)
        {
            int idGenerado = 0;
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("InsertarRecomendacionEjercicio", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Seccion", item.Seccion);
                cmd.Parameters.AddWithValue("prm_Condicion", item.Condicion);
                cmd.Parameters.AddWithValue("prm_Recomendacion", item.Recomendacion);
                cmd.Parameters.AddWithValue("prm_Activo", item.Activo ? 1 : 0);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    idGenerado = reader.GetInt32("id_generado");
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(InsertarRecomendacionAsync), ex);
                idGenerado = 0;
            }
            return idGenerado;
        }

        public async Task<bool> UpdateRecomendacionAsync(RecomendacionEjercicio item)
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("UpdateRecomendacionEjercicio", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Id", item.Id);
                cmd.Parameters.AddWithValue("prm_Seccion", item.Seccion);
                cmd.Parameters.AddWithValue("prm_Condicion", item.Condicion);
                cmd.Parameters.AddWithValue("prm_Recomendacion", item.Recomendacion);
                cmd.Parameters.AddWithValue("prm_Activo", item.Activo ? 1 : 0);

                var affected = await cmd.ExecuteNonQueryAsync();
                return affected > 0;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(UpdateRecomendacionAsync), ex);
                return false;
            }
        }

        public async Task<RecomendacionEjercicio> GetRecomendacionPorIdAsync(int id)
        {
            RecomendacionEjercicio result = null;
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SGetRecomendacionEjercicioPorId", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Id", id);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    result = new RecomendacionEjercicio
                    {
                        Id = reader.GetInt32("id"),
                        Seccion = reader.GetString("seccion"),
                        Condicion = reader.GetString("condicion"),
                        Recomendacion = reader.GetString("recomendacion"),
                        Activo = reader.GetBoolean("activo"),
                        FechaCrea = reader.GetDateTime("fecha_crea")
                    };
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(GetRecomendacionPorIdAsync), ex);
            }
            return result;
        }

        public async Task<IEnumerable<RecomendacionEjercicio>> SListaRecomendacionesAsync()
        {
            var list = new List<RecomendacionEjercicio>();
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();

                using var cmd = new MySqlCommand("SListaRecomendacionesEjercicio", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new RecomendacionEjercicio
                    {
                        Id = reader.GetInt32("id"),
                        Seccion = reader.GetString("seccion"),
                        Condicion = reader.GetString("condicion"),
                        Recomendacion = reader.GetString("recomendacion"),
                        Activo = reader.GetBoolean("activo"),
                        FechaCrea = reader.GetDateTime("fecha_crea")
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(SListaRecomendacionesAsync), ex);
            }
            return list;
        }
    }
}
