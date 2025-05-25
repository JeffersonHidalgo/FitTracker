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
        public async Task<IActionResult> InsertarUsuarioConAccesos([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            var usuarioCreado = await _usuarioRepository.InsertUsuario(usuario);

            if (!usuarioCreado)
                return StatusCode(500, "Error al crear el usuario.");


            if (usuario.Accesos != null && usuario.Accesos.Count > 0)
            {
                foreach (var acceso in usuario.Accesos)
                {
                    acceso.UsuarioId = usuario.Id; 
                    var ok = await _usuarioRepository.InsertUsuarioAcceso(acceso);
                    if (!ok)
                        return StatusCode(500, "Error al asignar accesos.");
                }
            }

            return Ok("Usuario y accesos creados correctamente.");
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            var ok = await _usuarioRepository.UpdateUsuario(usuario);
            return ok ? Ok("Usuario actualizado.") : NotFound("Usuario no encontrado.");
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