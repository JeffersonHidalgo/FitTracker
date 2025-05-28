using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace Data.Repos
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> SlistaClientes();
        Task<Cliente> GetCliente(int id);
        Task<int> InsertCliente(Cliente cliente);
        Task<int> UpdateCliente(Cliente cliente);
    }
}
