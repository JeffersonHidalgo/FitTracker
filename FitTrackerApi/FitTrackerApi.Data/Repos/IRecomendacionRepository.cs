using Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IRecomendacionRepository
    {
        Task<int> InsertarRecomendacionAsync(RecomendacionEjercicio item);
        Task<bool> UpdateRecomendacionAsync(RecomendacionEjercicio item);
        Task<RecomendacionEjercicio> GetRecomendacionPorIdAsync(int id);
        Task<IEnumerable<RecomendacionEjercicio>> SListaRecomendacionesAsync();
    }
}
