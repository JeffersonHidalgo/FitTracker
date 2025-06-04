using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class RolAcceso
    {
        public int RolId { get; set; }
        public int PantallaId { get; set; }
        public string Acceso { get; set; } // 'S' o 'N'
    }
}
