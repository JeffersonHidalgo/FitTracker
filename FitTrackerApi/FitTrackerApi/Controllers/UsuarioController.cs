using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace FitTrackerApi.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        [HttpGet("lista")]
        public async Task<IActionResult> SlistaUsuarios()
        {
            var usuarios = await _usuarioRepository.SlistaUsuarios();
            return Ok(usuarios);
        }

        [HttpGet("detalle/{id}")]
        public async Task<IActionResult> GetUsuarioConAccesos(int id)
        {
            var usuario = await _usuarioRepository.GetUsuarioConAccesos(id);
            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [HttpPost("insertar")]
        public async Task<ActionResult<int>> InsertUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            // InsertUsuario devuelve el ID generado o 0 si falla
            var newId = await _usuarioRepository.InsertUsuario(usuario);
            if (newId == 0)
                return StatusCode(500, "Error al crear el usuario.");

            // Si hay accesos, los insertamos
            if (usuario.Accesos != null && usuario.Accesos.Count > 0)
            {
                foreach (var acceso in usuario.Accesos)
                {
                    acceso.UsuarioId = newId;
                    var ok = await _usuarioRepository.InsertUsuarioAcceso(acceso);
                    if (!ok)
                        return StatusCode(500, "Error al asignar accesos.");
                }
            }

            // Devuelve solo el ID generado como entero
            return Ok(newId);
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            var affected = await _usuarioRepository.UpdateUsuario(usuario);
            return affected > 0 ? Ok("Usuario actualizado.") : NotFound("Usuario no encontrado.");
        }

        [HttpPost("asignar-acceso")]
        public async Task<IActionResult> AsignarAcceso([FromBody] UsuarioAcceso acceso)
        {
            if (acceso == null || acceso.UsuarioId <= 0 || acceso.PantallaId <= 0)
                return BadRequest("Datos inválidos.");

            var ok = await _usuarioRepository.InsertUsuarioAcceso(acceso);
            return ok ? Ok("Acceso asignado.") : StatusCode(500, "Error al asignar acceso.");
        }

        [HttpDelete("eliminar-acceso")]
        public async Task<IActionResult> EliminarAcceso([FromQuery] int usuarioId, [FromQuery] int pantallaId)
        {
            if (usuarioId <= 0 || pantallaId <= 0)
                return BadRequest("IDs inválidos.");

            var ok = await _usuarioRepository.DeleteUsuarioAcceso(usuarioId, pantallaId);
            return ok ? Ok("Acceso eliminado.") : NotFound("Acceso no encontrado.");
        }

        [HttpGet("listaPantallas")]
        public async Task<IActionResult> SlistaPantallas()
        {
            var pantallas = await _usuarioRepository.SlistaPantallas();
            return Ok(pantallas);
        }
    }
}