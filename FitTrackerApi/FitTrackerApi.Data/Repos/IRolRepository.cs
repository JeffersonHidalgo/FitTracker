using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IRolRepository
    {
        Task<int> InsertRolAsync(Rol rol);       
        Task<bool> UpdateRolAsync(Rol rol);
        Task<Rol?> GetRolConAccesos(int id);
        Task<IEnumerable<Rol>> SListaRoles();

    }
}
