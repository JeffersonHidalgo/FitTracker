using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models.Reportes;

namespace FitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/reportes")]
    public class ReportesController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IClienteRepository _clienteRepo;

        public ReportesController(IReportService reportService,
                                  IClienteRepository clienteRepo)
        {
            _reportService = reportService;
            _clienteRepo = clienteRepo;
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


    }

}
