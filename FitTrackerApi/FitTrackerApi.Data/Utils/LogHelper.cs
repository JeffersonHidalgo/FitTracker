using System;
using System.IO;

namespace Utils
{
    public static class LogHelper
    {
        private static readonly string _logPath = "log_errores.txt";

        public static void LogError(string metodo, Exception ex)
        {
            try
            {
                var mensaje = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Error en {metodo}: {ex}\n";
                File.AppendAllText(_logPath, mensaje);
            }
            catch
            {
                // No lanzar excepción para no interrumpir el flujo de la app.
            }
        }
    }
}