using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Models;
using Utils;

namespace FitTrackerApi.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private static Dictionary<string, (int Count, DateTime LastAttempt)> _loginAttempts =
    new Dictionary<string, (int Count, DateTime LastAttempt)>();
        private const int MAX_ATTEMPTS = 5;
        private const int LOCKOUT_MINUTES = 15;
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

    


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Validación de entrada
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("El nombre de usuario y la contraseña son obligatorios.");
            }
            
            // Verificar bloqueo por intentos
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            string attemptKey = $"{request.Username}_{ipAddress}";
            
            if (_loginAttempts.ContainsKey(attemptKey))
            {
                var (attempts, lastTime) = _loginAttempts[attemptKey];
                
                // Si está bloqueado y no ha pasado el tiempo
                if (attempts >= MAX_ATTEMPTS && DateTime.Now.Subtract(lastTime).TotalMinutes < LOCKOUT_MINUTES)
                {
                    int minutesLeft = LOCKOUT_MINUTES - (int)DateTime.Now.Subtract(lastTime).TotalMinutes;
                    return StatusCode(429, $"Demasiados intentos fallidos. Intente nuevamente en {minutesLeft} minutos.");
                }
                
                // Si ha pasado el tiempo de bloqueo, reiniciar contador
                if (DateTime.Now.Subtract(lastTime).TotalMinutes >= LOCKOUT_MINUTES)
                {
                    _loginAttempts[attemptKey] = (1, DateTime.Now);
                }
            }
            
            try
            {
                // Validar credenciales
                var usuario = await _usuarioRepository.ValidarCredenciales(request.Username, request.Password);
                
                if (usuario == null)
                {
                    // Incrementar contador de intentos fallidos
                    if (_loginAttempts.ContainsKey(attemptKey))
                    {
                        var (attempts, _) = _loginAttempts[attemptKey];
                        _loginAttempts[attemptKey] = (attempts + 1, DateTime.Now);
                    }
                    else
                    {
                        _loginAttempts[attemptKey] = (1, DateTime.Now);
                    }
                    
                    return StatusCode(401,  "Nombre de usuario o contraseña incorrectos." );
                }
                
                // Éxito - reiniciar contador
                _loginAttempts.Remove(attemptKey);
                
                // Por seguridad, no devolver la contraseña al cliente
                usuario.Password = null;
                
                // Devolver el usuario con sus accesos
                return Ok(new {
                    message = "Inicio de sesión exitoso",
                    usuario = usuario,
                    timestamp = DateTime.Now,
                    sesionValida = true,
                    ultimoAcceso = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                // Registrar el error pero no exponer detalles al cliente
                LogHelper.LogError(nameof(Login), ex);
                return StatusCode(500, "Error interno del servidor al procesar la solicitud.");
            }
        }
    }
}
