using Models;
using Models.Reportes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IReportService
    {
        Task<byte[]> GenerarReporteMetricasConGraficos(int codigoCliente);
        Task<byte[]> GenerarReporteHistorialDetalladoAsync(int codigoCliente);
    }
}
