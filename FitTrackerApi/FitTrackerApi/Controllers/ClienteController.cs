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
            if (cliente == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _clienteRepository.InsertCliente(cliente);
            return Created("created", created);
        }

        // PUT api/cliente/actualizar
        [HttpPut("actualizar")]
        public async Task<IActionResult> UpdateCliente([FromBody] Cliente cliente)
        {
            if (cliente == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _clienteRepository.UpdateCliente(cliente);
            return NoContent();
        }
    }
}
