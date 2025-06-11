using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IEmailService
    {

        Task<bool> EnviarCorreoAsync(string destinatario, string asunto, string contenido,
            EmailPrioridad prioridad = EmailPrioridad.Normal);

        Task<bool> EnviarCorreoConAdjuntoAsync(string destinatario, string asunto, string contenido,
            byte[] archivoAdjunto, string nombreArchivo, EmailPrioridad prioridad = EmailPrioridad.Normal);


        Task<bool> EnviarReporteClienteAsync(int codigoCliente, string asunto, string mensaje, byte[] reportePdf);
    }
    public enum EmailPrioridad
    {
        Baja,
        Normal,
        Alta
    }
}
