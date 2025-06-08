using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models;
using System.Threading.Tasks;

namespace FitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/empresa")]
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaRepository _empresaRepository;

        public EmpresaController(IEmpresaRepository empresaRepository)
        {
            _empresaRepository = empresaRepository;
        }

        [HttpGet("configuracion")]
        public async Task<IActionResult> GetConfiguracion()
        {
            var config = await _empresaRepository.ObtenerConfiguracionAsync();
            return config != null ? Ok(config) : NotFound("Configuración no encontrada.");
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarConfiguracion([FromBody] EmpresaConfiguracion config)
        {
            if (config == null || config.Id <= 0)
                return BadRequest("Datos inválidos.");

            var result = await _empresaRepository.ActualizarConfiguracionAsync(config);
            return result ? Ok("Configuración actualizada.") : StatusCode(500, "Error al actualizar.");
        }

        [HttpPost("subir-logo/{empresaId}")]
        public async Task<IActionResult> SubirLogoEmpresa(int empresaId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se envió ningún archivo.");

            if (empresaId <= 0)
                return BadRequest("ID de empresa inválido.");

            try
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var permitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                if (!permitidas.Contains(extension))
                    return BadRequest("Tipo de archivo no permitido.");

                // Nombre de archivo con prefijo
                var nombreArchivo = $"empresa_{empresaId}{extension}";

                var carpeta = Path.Combine(Directory.GetCurrentDirectory(), "logo-empresa");
                if (!Directory.Exists(carpeta))
                    Directory.CreateDirectory(carpeta);

                var ruta = Path.Combine(carpeta, nombreArchivo);

                using var stream = new FileStream(ruta, FileMode.Create);
                await file.CopyToAsync(stream);

                return Ok(new
                {
                    mensaje = "Logo subido correctamente.",
                    nombreArchivo = nombreArchivo,
                    rutaRelativa = $"logo-empresa/{nombreArchivo}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar el logo: {ex.Message}");
            }
        }

    }
}
