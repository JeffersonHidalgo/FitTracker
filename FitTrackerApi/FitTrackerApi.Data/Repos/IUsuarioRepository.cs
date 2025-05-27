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
        Task<bool> InsertUsuario(Usuario usuario);
        Task<bool> UpdateUsuario(Usuario usuario);
        Task<bool> InsertUsuarioAcceso(UsuarioAcceso acceso);
        Task<bool> DeleteUsuarioAcceso(int usuarioId, int pantallaId);
        Task<IEnumerable<Pantalla>> SlistaPantallas();

    }
}
