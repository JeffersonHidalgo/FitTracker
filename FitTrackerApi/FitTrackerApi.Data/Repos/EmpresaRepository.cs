using Models;
using MySql.Data.MySqlClient;
using System.Data;
using System.Threading.Tasks;
using Utils;

namespace Data.Repos
{
    public class EmpresaRepository : IEmpresaRepository
    {
        private readonly MysqlConfig _config;
        public EmpresaRepository(MysqlConfig config) => _config = config;

        private MySqlConnection GetConnection() => new MySqlConnection(_config.ConnectionString);

        public async Task<EmpresaConfiguracion> ObtenerConfiguracionAsync()
        {
            EmpresaConfiguracion empresa = null;
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("SObtenerEmpresaConfiguracion", conn) { CommandType = CommandType.StoredProcedure };
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    empresa = new EmpresaConfiguracion
                    {
                        Id = reader.GetInt32("id"),
                        NombreEmpresa = reader.GetString("nombre_empresa"),
                        Direccion = reader.GetString("direccion"),
                        Ciudad = reader.GetString("ciudad"),
                        Provincia = reader.GetString("provincia"),
                        CodigoPostal = reader.GetString("codigo_postal"),
                        Pais = reader.GetString("pais"),
                        TelefonoEmpresa = reader.GetString("telefono_empresa"),
                        EmailEmpresa = reader.GetString("email_empresa"),
                        ServidorSmtp = reader.GetString("servidor_smtp"),
                        PuertoSmtp = reader.GetInt32("puerto_smtp"),
                        UsuarioSmtp = reader.GetString("usuario_smtp"),
                        PasswordSmtp = reader.GetString("password_smtp"),
                        UsarSsl = reader.GetBoolean("usar_ssl"),
                        Logo = reader.GetString("logo")
                    };
                }
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ObtenerConfiguracionAsync), ex);
            }

            return empresa;
        }

        public async Task<bool> ActualizarConfiguracionAsync(EmpresaConfiguracion config)
        {
            try
            {
                using var conn = GetConnection();
                await conn.OpenAsync();
                using var cmd = new MySqlCommand("UpdateEmpresaConfiguracion", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("prm_Id", config.Id);
                cmd.Parameters.AddWithValue("prm_Nombre", config.NombreEmpresa);
                cmd.Parameters.AddWithValue("prm_Direccion", config.Direccion);
                cmd.Parameters.AddWithValue("prm_Ciudad", config.Ciudad);
                cmd.Parameters.AddWithValue("prm_Provincia", config.Provincia);
                cmd.Parameters.AddWithValue("prm_CodigoPostal", config.CodigoPostal);
                cmd.Parameters.AddWithValue("prm_Pais", config.Pais);
                cmd.Parameters.AddWithValue("prm_Telefono", config.TelefonoEmpresa);
                cmd.Parameters.AddWithValue("prm_Email", config.EmailEmpresa);
                cmd.Parameters.AddWithValue("prm_Smtp", config.ServidorSmtp);
                cmd.Parameters.AddWithValue("prm_Puerto", config.PuertoSmtp);
                cmd.Parameters.AddWithValue("prm_Usuario", config.UsuarioSmtp);
                cmd.Parameters.AddWithValue("prm_Password", config.PasswordSmtp);
                cmd.Parameters.AddWithValue("prm_Ssl", config.UsarSsl);
                cmd.Parameters.AddWithValue("prm_Logo", config.Logo);


                return await cmd.ExecuteNonQueryAsync() > 0;

            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(ActualizarConfiguracionAsync), ex);
                return false;
            }
        }
    }
}
