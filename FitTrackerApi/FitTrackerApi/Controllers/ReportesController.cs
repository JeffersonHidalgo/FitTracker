using Data.Repos;
using Data.Utils;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Reportes;

namespace FitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/reportes")]
    public class ReportesController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IClienteRepository _clienteRepo;
        private readonly IEmailService _emailService;

        public ReportesController(IReportService reportService,
                                  IClienteRepository clienteRepo,
                                  IEmailService emailService)
        {
            _reportService = reportService;
            _clienteRepo = clienteRepo;
            _emailService = emailService;
        }

       

        [HttpGet("reporte-metricas/{codigoCliente}")]
        public async Task<IActionResult> GenerarReporteMetricas(int codigoCliente)
        {
            if (codigoCliente <= 0)
                return BadRequest("Código de cliente inválido.");

            try
            {
                var pdfBytes = await _reportService.GenerarReporteMetricasConGraficos(codigoCliente);

                return File(pdfBytes, "application/pdf", "reporte_metricas_cliente.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al generar el reporte: {ex.Message}");
            }
        }

        [HttpGet("reporte-historial/{codigoCliente}")]
        public async Task<IActionResult> GenerarReporteHistorial(int codigoCliente)
        {
            try
            {
                var pdf = await _reportService.GenerarReporteHistorialDetalladoAsync(codigoCliente);

                return File(pdf, "application/pdf", $"Historial_Metricas_Cliente_{codigoCliente}.pdf");
            }
            catch (Exception ex)
            {
                // Opcional: log error
                return BadRequest($"Error al generar el reporte: {ex.Message}");
            }
        }

        [HttpPost("enviar-metricas/{codigoCliente}")]
        public async Task<IActionResult> EnviarReporteEmail(int codigoCliente)
        {
            if (codigoCliente <= 0)
                return BadRequest("Código de cliente inválido.");

            try
            {
                // Obtener información del cliente para personalizar el mensaje
                var cliente = await _clienteRepo.GetCliente(codigoCliente);
                if (cliente == null)
                    return NotFound($"No se encontró el cliente con código {codigoCliente}");

                // Generar el reporte
                var pdfBytes = await _reportService.GenerarReporteMetricasConGraficos(codigoCliente);

                // Construir asunto personalizado
                string asunto =  $"Reporte de Métricas Fitness - {cliente.NombreCompleto} - {DateTime.Now:dd/MM/yyyy}";

                // Construir mensaje personalizado y profesional
                string mensaje = $@"
            <p>Es un placer para nosotros compartir con usted el informe detallado de sus métricas fitness, 
            que refleja su desempeño y progreso en su programa de entrenamiento.</p>
            
            <p>Este reporte incluye:</p>
            <ul>
                <li>Análisis comparativo de sus indicadores clave</li>
                <li>Métricas corporales actualizadas</li>
                <li>Evaluación de rendimiento físico</li>
                <li>Recomendaciones personalizadas</li>
            </ul>
            
            <p>Lo invitamos a revisar el documento adjunto y programar una sesión 
            con su entrenador para analizar los resultados y ajustar su plan de entrenamiento.</p>
            
            <p>¡Felicitaciones por su compromiso con la salud y el bienestar!</p>";

                // Enviar por correo
                bool enviado = await _emailService.EnviarReporteClienteAsync(
                    codigoCliente,
                    asunto,
                    mensaje,
                    pdfBytes);

                if (!enviado)
                    return StatusCode(500, "No se pudo enviar el correo electrónico. Verifique la configuración de email.");

                return Ok(new
                {
                    message = $"Reporte enviado exitosamente por correo a {cliente.NombreCompleto}.",
                    emailDestino = cliente.Emails?.FirstOrDefault(e => e.Principal == "S")?.Email ?? cliente.Emails?.FirstOrDefault()?.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al enviar el reporte: {ex.Message}");
            }
        }

        [HttpPost("enviar-historial/{codigoCliente}")]
        public async Task<IActionResult> EnviarReporteHistorialEmail(int codigoCliente)
        {
            if (codigoCliente <= 0)
                return BadRequest("Código de cliente inválido.");

            try
            {
                // Obtener información del cliente para personalizar el mensaje
                var cliente = await _clienteRepo.GetCliente(codigoCliente);
                if (cliente == null)
                    return NotFound($"No se encontró el cliente con código {codigoCliente}");

                // Generar el reporte de historial
                var pdfBytes = await _reportService.GenerarReporteHistorialDetalladoAsync(codigoCliente);

                // Construir asunto personalizado
                string asunto = $"Historial Completo de Métricas - {cliente.NombreCompleto} - {DateTime.Now:dd/MM/yyyy}";

                // Construir mensaje personalizado y profesional
                string mensaje = $@"
        <p>Estimado/a <strong>{cliente.NombreCompleto}</strong>,</p>

        <p>Adjunto encontrará su historial completo de métricas fitness, que muestra su evolución y 
        progreso a lo largo del tiempo en nuestro programa de entrenamiento.</p>
        
        <p>Este informe histórico incluye:</p>
        <ul>
            <li>Todos sus registros de métricas ordenados cronológicamente</li>
            <li>Datos antropométricos de cada medición</li>
            <li>Indicadores de fuerza y resistencia</li>
            <li>Métricas de cardio y flexibilidad</li>
            <li>Análisis por sección para cada registro</li>
            <li>Gráficos de tendencias que muestran su evolución</li>
        </ul>
        
        <p>Este historial le permitirá visualizar claramente su progreso y las áreas 
        donde ha tenido mayor desarrollo. Le recomendamos revisarlo junto con su entrenador 
        para evaluar su trayectoria y planificar objetivos futuros.</p>
        
        <p>¡Gracias por confiar en nosotros para acompañarlo en su camino hacia un estilo de vida más saludable!</p>";

                // Enviar por correo
                bool enviado = await _emailService.EnviarReporteClienteAsync(
                    codigoCliente,
                    asunto,
                    mensaje,
                    pdfBytes);

                if (!enviado)
                    return StatusCode(500, "No se pudo enviar el correo electrónico. Verifique la configuración de email.");

                return Ok(new
                {
                    message = $"Historial completo enviado exitosamente por correo a {cliente.NombreCompleto}.",
                    emailDestino = cliente.Emails?.FirstOrDefault(e => e.Principal == "S")?.Email ?? cliente.Emails?.FirstOrDefault()?.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al enviar el historial: {ex.Message}");
            }
        }

    }

}
