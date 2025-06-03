using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ClienteMetricaRespuesta
    {
        public int Id { get; set; }
        public int CodigoCli { get; set; }
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public string Antropometria { get; set; }
        public string FuerzaResistencia { get; set; }
        public string Cardio { get; set; }
        public string Flexibilidad { get; set; }
        public string PotenciaAgilidad { get; set; }
        public string EsfuerzoPercibido { get; set; }
        public List<string> Recomendaciones { get; set; } = new();
    }
}
