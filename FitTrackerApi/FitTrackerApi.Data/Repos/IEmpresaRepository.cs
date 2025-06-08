using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IEmpresaRepository
    {
        Task<EmpresaConfiguracion> ObtenerConfiguracionAsync();
        Task<bool> ActualizarConfiguracionAsync(EmpresaConfiguracion config);
    }
}
