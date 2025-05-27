using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class UsuarioAcceso
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int PantallaId { get; set; }
        public char Acceso { get; set; }
    }
}
