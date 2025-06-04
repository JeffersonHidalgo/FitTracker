using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models;
using System.Threading.Tasks;

namespace FitTrackerApi.Controllers
{
    [Route("api/recomendacion")]
    [ApiController]
    public class RecomendacionController : ControllerBase
    {
        private readonly IRecomendacionRepository _repo;
        public RecomendacionController(IRecomendacionRepository repo) => _repo = repo;

        // GET api/recomendacion/lista
        [HttpGet("lista")]
        public async Task<IActionResult> SlistaRecomendaciones()
        {
            var items = await _repo.SListaRecomendacionesAsync();
            return Ok(items);
        }

        // GET api/recomendacion/detalle/{id}
        [HttpGet("detalle/{id}")]
        public async Task<IActionResult> GetRecomendacion(int id)
        {
            var item = await _repo.GetRecomendacionPorIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        // POST api/recomendacion/insertar
        [HttpPost("insertar")]
        public async Task<IActionResult> InsertRecomendacion([FromBody] RecomendacionEjercicio model)
        {
            if (model == null ||
                string.IsNullOrWhiteSpace(model.Seccion) ||
                string.IsNullOrWhiteSpace(model.Condicion) ||
                string.IsNullOrWhiteSpace(model.Recomendacion))
            {
                return BadRequest("Seccion, condicion y recomendacion son obligatorios.");
            }

            var newId = await _repo.InsertarRecomendacionAsync(model);
            if (newId == 0)
                return StatusCode(500, "Error al insertar la recomendación.");

            return CreatedAtAction(nameof(GetRecomendacion), new { id = newId }, new { id = newId });
        }

        // PUT api/recomendacion/actualizar
        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateRecomendacion([FromBody] RecomendacionEjercicio model)
        {
            if (model == null || model.Id <= 0)
                return BadRequest("Datos inválidos.");

            var ok = await _repo.UpdateRecomendacionAsync(model);
            return ok ? Ok("Recomendación actualizada.") : NotFound("No se encontró esa recomendación.");
        }
    }
}
