using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace FitTrackerApi.Controllers
{
    [Route("api/rol")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolRepository _rolRepository;

        public RolController(IRolRepository rolRepository)
        {
            _rolRepository = rolRepository;
        }

        [HttpPost("insertar")]
        public async Task<IActionResult> InsertRol([FromBody] Rol rol)
        {
            if (rol == null || string.IsNullOrWhiteSpace(rol.Nombre))
                return BadRequest("Datos inválidos.");

            var newId = await _rolRepository.InsertRolAsync(rol);
            if (newId == 0)
                return StatusCode(500, "Error al insertar rol.");

            return CreatedAtAction(nameof(GetRol), new { id = newId }, new { id = newId });
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateRol([FromBody] Rol rol)
        {
            if (rol == null || rol.Id <= 0)
                return BadRequest("Datos inválidos.");

            var success = await _rolRepository.UpdateRolAsync(rol);
            if (!success)
                return NotFound("No se pudo actualizar el rol.");

            return Ok("Rol actualizado.");
        }

        [HttpGet("detalle/{id}")]
        public async Task<IActionResult> GetRol(int id)
        {
            var rol = await _rolRepository.GetRolConAccesos(id);
            return rol != null ? Ok(rol) : NotFound();
        }

        [HttpGet("lista")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _rolRepository.SListaRoles();
            return Ok(roles);
        }

    }

}
