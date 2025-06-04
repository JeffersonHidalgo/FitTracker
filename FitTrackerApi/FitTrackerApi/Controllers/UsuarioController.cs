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

            var newId = await _usuarioRepository.InsertUsuario(usuario);
            if (newId == 0)
                return StatusCode(500, "Error al crear el usuario.");

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

        [HttpGet("listaPantallas")]
        public async Task<IActionResult> SlistaPantallas()
        {
            var pantallas = await _usuarioRepository.SlistaPantallas();
            return Ok(pantallas);
        }
    }
}
