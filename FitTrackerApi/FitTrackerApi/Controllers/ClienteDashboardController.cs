using Data.Repos;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/cliente/dashboard")]
    public class ClienteDashboardController : ControllerBase
    {
        private readonly IClienteRepository _repo;
        public ClienteDashboardController(IClienteRepository repo) => _repo = repo;

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
            => Ok(await _repo.ObtenerResumenDashboardAsync());

        [HttpGet("demografia")]
        public async Task<IActionResult> GetDemografia()
            => Ok(await _repo.ObtenerDemografiaDashboardAsync());

        [HttpGet("salud")]
        public async Task<IActionResult> GetSalud()
            => Ok(await _repo.ObtenerIndicadoresSaludAsync());

        [HttpGet("cumpleanos")]
        public async Task<IActionResult> GetCumpleanos()
            => Ok(await _repo.ObtenerCumpleanosProximosAsync());
    }
}
