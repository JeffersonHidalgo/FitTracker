using Models;
using Models.Dashboard;
using Models.Reportes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> SlistaClientes();
        Task<Cliente> GetCliente(int id);
        Task<int> InsertCliente(Cliente cliente);
        Task<int> UpdateCliente(Cliente cliente);
        Task<(int metricaId, Dictionary<string, string> seccionAnalisis, List<string> recomendaciones)> InsertarMetricasConAnalisisAsync(ClienteMetrica metricas);
        Task<IEnumerable<ClienteMetricasHistorial>> ObtenerHistorialMetricas(int codigoCli);
        Task<IEnumerable<ClienteMetricasHistorial>> ObtenerHistorialCompletoAsync(int codigoCli);
        Task<MetricasAnalisisDto> ObtenerMetricasConAnalisisAsync(int codigoCli);

        Task<DashboardSummaryDto> ObtenerResumenDashboardAsync();
        Task<DashboardDemografiaDto> ObtenerDemografiaDashboardAsync();
        Task<DashboardSaludDto> ObtenerIndicadoresSaludAsync();
        Task<IEnumerable<CumpleanosDto>> ObtenerCumpleanosProximosAsync();
    }
}
