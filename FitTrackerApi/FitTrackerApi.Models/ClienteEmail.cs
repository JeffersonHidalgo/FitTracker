using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ClienteEmail
    {
        public int Id { get; set; }
        public int CodigoCli { get; set; }
        public string Email { get; set; }
        public string Descripcion { get; set; }
        public string Principal { get; set; }
    }
}
