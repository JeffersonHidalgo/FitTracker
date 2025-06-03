using Microsoft.AspNetCore.Mvc;
using Data;
using Data.Repos;
using Models;

namespace FitTrackerApi.Controllers
{
    [Route("api/cliente")]
    [ApiController]
    public class ClienteController : Controller
    {
        private readonly IClienteRepository _clienteRepository;

        public ClienteController(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        // GET api/cliente/lista
        [HttpGet("lista")]
        public async Task<IActionResult> SlistaClientes()
        {
            var clientes = await _clienteRepository.SlistaClientes();
            return Ok(clientes);
        }

        // GET api/cliente/detalle/5
        [HttpGet("detalle/{id}")]
        public async Task<IActionResult> GetCliente(int id)
        {
            var cliente = await _clienteRepository.GetCliente(id);
            return Ok(cliente);
        }

        // POST api/cliente/insertar
        [HttpPost("insertar")]
        public async Task<IActionResult> InsertCliente([FromBody] Cliente cliente)
        {
            if (cliente == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            // InsertCliente devuelve el ID generado o 0 si falla
            var newId = await _clienteRepository.InsertCliente(cliente);
            if (newId == 0)
                return StatusCode(500, "Error inserting the client.");

            // Devuelve 201 Created con Location y el ID
            return CreatedAtAction(
                nameof(GetCliente),
                new { id = newId },
                new { codigoCli = newId }
            );
        }

        // PUT api/cliente/actualizar
        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateCliente([FromBody] Cliente cliente)
        {
            if (cliente == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            // UpdateCliente devuelve el mismo ID o 0 si falla
            var updatedId = await _clienteRepository.UpdateCliente(cliente);
            if (updatedId == 0)
                return NotFound("Client not found or error updating.");

            // Devuelve 200 OK con el ID
            return Ok(new { codigoCli = updatedId });

        }

        [HttpPost("subir-foto/{clienteId}")]
        public async Task<IActionResult> SubirFotoCliente(int clienteId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se envió ningún archivo.");

            if (clienteId <= 0)
                return BadRequest("ID de cliente inválido.");

            try
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var permitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                if (!permitidas.Contains(extension))
                    return BadRequest("Tipo de archivo no permitido.");

                // Nombre generado automáticamente
                var nombreArchivo = $"cliente_{clienteId}{extension}";

                var carpeta = Path.Combine(Directory.GetCurrentDirectory(), "imagen-cliente");
                if (!Directory.Exists(carpeta))
                    Directory.CreateDirectory(carpeta);

                var ruta = Path.Combine(carpeta, nombreArchivo);

                using var stream = new FileStream(ruta, FileMode.Create);
                await file.CopyToAsync(stream);

                return Ok(new
                {
                    mensaje = "Imagen subida correctamente.",
                    nombreArchivo = nombreArchivo,
                    rutaRelativa = $"imagen-cliente/{nombreArchivo}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar la imagen: {ex.Message}");
            }
        }

        [HttpPost("metricas/analizar")]
        public async Task<IActionResult> InsertarMetricas([FromBody] ClienteMetrica metricas)
        {
            if (metricas == null || metricas.CodigoCli <= 0)
                return BadRequest("Datos inválidos");

            int codigoCli = metricas.CodigoCli;
            var (metricaId, resumenAnalisis, recomendaciones) = await _clienteRepository.InsertarMetricasConAnalisisAsync(metricas);

            if (metricaId == 0)
                return StatusCode(500, "No se pudieron registrar las métricas.");

            return Ok(new
            {
                codigoCli,
                metricaId,
                resumenAnalisis,
                recomendaciones
            });
        }

        [HttpGet("metricas/historial/{codigoCli}")]
        public async Task<IActionResult> ObtenerHistorialMetricas(int codigoCli)
        {
            var historial = await _clienteRepository.ObtenerHistorialMetricas(codigoCli);
            return Ok(historial);
        }


    }
}
