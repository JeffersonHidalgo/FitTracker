using Data.Repos;
using Models;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Utils;  // Agregar esta referencia para usar LogHelper

namespace Data.Utils
{
    public class EmailService : IEmailService
    {
        private readonly IEmpresaRepository _empresaRepository;
        private readonly IClienteRepository _clienteRepository;

        public EmailService(
            IEmpresaRepository empresaRepository,
            IClienteRepository clienteRepository)
        {
            _empresaRepository = empresaRepository;
            _clienteRepository = clienteRepository;
        }

        public async Task<bool> EnviarCorreoAsync(string destinatario, string asunto, string contenido,
            EmailPrioridad prioridad = EmailPrioridad.Normal)
        {
            try
            {
                ValidarParametros(destinatario, asunto);

                var configuracion = await _empresaRepository.ObtenerConfiguracionAsync();
                if (configuracion == null)
                {
                    LogHelper.LogError(nameof(EnviarCorreoAsync), 
                        new Exception("No se pudo obtener la configuración de la empresa para enviar correo"));
                    return false;
                }

                using var mensaje = CrearMensaje(configuracion, destinatario, asunto, contenido, prioridad);
                await EnviarMensajeAsync(configuracion, mensaje);

                // No hay equivalente para LogInformation en LogHelper, así que lo omitimos
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(EnviarCorreoAsync), 
                    new Exception($"Error al enviar correo a {destinatario}: {ex.Message}", ex));
                return false;
            }
        }

        public async Task<bool> EnviarCorreoConAdjuntoAsync(string destinatario, string asunto, string contenido,
            byte[] archivoAdjunto, string nombreArchivo, EmailPrioridad prioridad = EmailPrioridad.Normal)
        {
            try
            {
                ValidarParametros(destinatario, asunto);

                if (archivoAdjunto == null || archivoAdjunto.Length == 0)
                {
                    LogHelper.LogError(nameof(EnviarCorreoConAdjuntoAsync), 
                        new Exception("Se intentó enviar un correo con un archivo adjunto vacío"));
                    return false;
                }

                var configuracion = await _empresaRepository.ObtenerConfiguracionAsync();
                if (configuracion == null)
                {
                    LogHelper.LogError(nameof(EnviarCorreoConAdjuntoAsync), 
                        new Exception("No se pudo obtener la configuración de la empresa para enviar correo"));
                    return false;
                }

                using var mensaje = CrearMensaje(configuracion, destinatario, asunto, contenido, prioridad);

                // Agregar archivo adjunto
                using var streamAdjunto = new MemoryStream(archivoAdjunto);
                var adjunto = new Attachment(streamAdjunto, nombreArchivo);
                mensaje.Attachments.Add(adjunto);

                await EnviarMensajeAsync(configuracion, mensaje);

                // No hay equivalente para LogInformation en LogHelper, así que lo omitimos
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(EnviarCorreoConAdjuntoAsync), 
                    new Exception($"Error al enviar correo con adjunto a {destinatario}: {ex.Message}", ex));
                return false;
            }
        }

        public async Task<bool> EnviarReporteClienteAsync(int codigoCliente, string asunto, string mensaje, byte[] reportePdf)
        {
            try
            {
                var cliente = await _clienteRepository.GetCliente(codigoCliente);
                if (cliente == null)
                {
                    LogHelper.LogError(nameof(EnviarReporteClienteAsync), 
                        new Exception($"No se encontró el cliente con código {codigoCliente} para enviar reporte"));
                    return false;
                }

                // Obtener email principal del cliente
                string emailCliente = null;
                if (cliente.Emails != null && cliente.Emails.Count > 0)
                {
                    var emailPrincipal = cliente.Emails.Find(e => e.Principal == "S");
                    emailCliente = emailPrincipal?.Email ?? cliente.Emails[0].Email;
                }

                if (string.IsNullOrEmpty(emailCliente))
                {
                    LogHelper.LogError(nameof(EnviarReporteClienteAsync), 
                        new Exception($"El cliente con código {codigoCliente} no tiene un email registrado"));
                    return false;
                }

                string nombreArchivo = $"Reporte_{cliente.NombreCompleto.Replace(" ", "_")}_{DateTime.Now:yyyyMMdd}.pdf";
                string contenidoPersonalizado = $"Estimado/a {cliente.NombreCompleto},<br><br>" +
                    $"{mensaje}<br><br>" +
                    "Adjunto encontrará su reporte detallado en formato PDF.<br><br>" +
                    "Gracias por confiar en nosotros para su seguimiento físico.";

                return await EnviarCorreoConAdjuntoAsync(
                    emailCliente,
                    asunto,
                    contenidoPersonalizado,
                    reportePdf,
                    nombreArchivo,
                    EmailPrioridad.Alta);
            }
            catch (Exception ex)
            {
                LogHelper.LogError(nameof(EnviarReporteClienteAsync), 
                    new Exception($"Error al enviar reporte al cliente {codigoCliente}: {ex.Message}", ex));
                return false;
            }
        }

        #region Métodos privados

        private void ValidarParametros(string destinatario, string asunto)
        {
            if (string.IsNullOrEmpty(destinatario))
                throw new ArgumentException("El destinatario del correo no puede estar vacío");

            if (string.IsNullOrEmpty(asunto))
                throw new ArgumentException("El asunto del correo no puede estar vacío");

            // Validar formato de email básico
            if (!destinatario.Contains("@") || !destinatario.Contains("."))
                throw new ArgumentException("El formato del email destinatario no es válido");
        }

        private MailMessage CrearMensaje(
            EmpresaConfiguracion config,
            string destinatario,
            string asunto,
            string contenidoPersonalizado,
            EmailPrioridad prioridad)
        {
            var from = new MailAddress(config.EmailEmpresa, config.NombreEmpresa);
            var to = new MailAddress(destinatario);

            var mensaje = new MailMessage(from, to)
            {
                Subject = asunto,
                IsBodyHtml = true,
                Body = ConstruirCuerpoHtml(config, contenidoPersonalizado)
            };

            // Establecer prioridad del mensaje
            mensaje.Priority = prioridad switch
            {
                EmailPrioridad.Alta => MailPriority.High,
                EmailPrioridad.Baja => MailPriority.Low,
                _ => MailPriority.Normal
            };

            return mensaje;
        }

        private async Task EnviarMensajeAsync(EmpresaConfiguracion config, MailMessage mensaje)
        {
            using var smtp = new SmtpClient(config.ServidorSmtp, config.PuertoSmtp)
            {
                EnableSsl = config.UsarSsl,
                Credentials = new NetworkCredential(config.UsuarioSmtp, config.PasswordSmtp),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 30000 // 30 segundos de timeout
            };

            await smtp.SendMailAsync(mensaje);
        }

        private string ConstruirCuerpoHtml(EmpresaConfiguracion empresa, string contenidoPersonalizado)
        {
            var sb = new StringBuilder();

            // Contenedor principal
            sb.Append("<div style='font-family:Arial, sans-serif; color:#333; max-width:600px; margin:0 auto;'>");

            // Encabezado
            sb.Append("<div style='background-color:#2C3E50; padding:20px; color:white; text-align:center;'>");
            sb.Append($"<h1 style='margin:0;'>{empresa.NombreEmpresa}</h1>");
            sb.Append("</div>");

            if (!string.IsNullOrEmpty(empresa.Logo))
            {
                try
                {
                    string logoBase64 = empresa.Logo;

                    // Si el logo es una ruta de archivo, convertirlo a base64
                    if (File.Exists(empresa.Logo))
                    {
                        byte[] logoBytes = File.ReadAllBytes(empresa.Logo);
                        logoBase64 = Convert.ToBase64String(logoBytes);
                    }
                    
                    string contentType = "image/png"; // Por defecto
                    if (empresa.Logo.EndsWith(".jpg") || empresa.Logo.EndsWith(".jpeg"))
                        contentType = "image/jpeg";
                    else if (empresa.Logo.EndsWith(".gif"))
                        contentType = "image/gif";
                        
                    if (logoBase64.StartsWith("data:image"))
                    {
                        sb.Append("<div style='text-align:center; padding:15px;'>");
                        sb.Append($"<img src='{logoBase64}' alt='Logo' style='max-width:200px; max-height:100px;' />");
                        sb.Append("</div>");
                    }
                    else
                    {
                        // Añadir el prefijo data:image si no lo tiene
                        sb.Append("<div style='text-align:center; padding:15px;'>");
                        sb.Append($"<img src='data:{contentType};base64,{logoBase64}' alt='Logo' style='max-width:200px; max-height:100px;' />");
                        sb.Append("</div>");
                    }
                }
                catch (Exception ex)
                {
                    // Si hay error al procesar el logo, registrarlo pero continuar sin logo
                    LogHelper.LogError("ConstruirCuerpoHtml", 
                        new Exception($"Error al procesar el logo de la empresa: {ex.Message}", ex));
                    
                    // Opcionalmente incluir texto alternativo
                    sb.Append("<div style='text-align:center; padding:15px;'>");
                    sb.Append($"<p style='font-weight:bold;'>{empresa.NombreEmpresa}</p>");
                    sb.Append("</div>");
                }
            }

            // Contenido principal
            sb.Append("<div style='padding:20px; background-color:#f9f9f9;'>");
            sb.Append($"<div style='background-color:white; padding:20px; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);'>");
            sb.Append($"{contenidoPersonalizado}");
            sb.Append("</div>");
            sb.Append("</div>");

            // Información de contacto
            sb.Append("<div style='background-color:#eee; padding:15px; font-size:12px; color:#666;'>");
            sb.Append($"<p><strong>{empresa.NombreEmpresa}</strong><br>");
            sb.Append($"{empresa.Direccion}, {empresa.Ciudad}, {empresa.Provincia}, {empresa.Pais}<br>");
            sb.Append($"Tel: {empresa.TelefonoEmpresa} | Email: {empresa.EmailEmpresa}</p>");
            sb.Append("</div>");

            // Pie de página
            sb.Append("<div style='padding:10px; text-align:center; font-size:11px; color:#999;'>");
            sb.Append("<p>Este mensaje fue enviado automáticamente por el sistema. No responder directamente.</p>");
            sb.Append($"<p>&copy; {DateTime.Now.Year} {empresa.NombreEmpresa}. Todos los derechos reservados.</p>");
            sb.Append("</div>");

            sb.Append("</div>");

            return sb.ToString();
        }

        #endregion
    }
}