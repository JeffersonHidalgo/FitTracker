using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repos
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> SlistaUsuarios();
        Task<Usuario> GetUsuarioConAccesos(int id);
        Task<int> InsertUsuario(Usuario usuario);
        Task<int> UpdateUsuario(Usuario usuario);
        Task<IEnumerable<Pantalla>> SlistaPantallas();

    }
}
