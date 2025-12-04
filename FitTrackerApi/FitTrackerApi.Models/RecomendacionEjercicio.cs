using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class RecomendacionEjercicio
    {
        public int Id { get; set; }
        public string Seccion { get; set; }
        public string Condicion { get; set; }
        public string Recomendacion { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCrea { get; set; }
    }
}
