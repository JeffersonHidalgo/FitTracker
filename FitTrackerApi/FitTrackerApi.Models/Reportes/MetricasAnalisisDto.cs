using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Reportes
{

    public class MetricasAnalisisDto
    {
        public int CodigoCli { get; set; }
        public int MetricaId { get; set; }
        public decimal Imc { get; set; }
        public decimal GrasaCorporal { get; set; }
        public decimal MasaMuscular { get; set; }
        public decimal RmPress { get; set; }
        public decimal RmSentadilla { get; set; }
        public decimal RmPesoMuerto { get; set; }
        public decimal TestCooper { get; set; }
        public decimal FcReposo { get; set; }
        public decimal Flexibilidad { get; set; }
        public decimal SaltoVertical { get; set; }
        public decimal Rpe { get; set; }

        public Dictionary<string, string> ResumenAnalisis { get; set; } = new();
        public List<string> Recomendaciones { get; set; } = new();
        public DateTime FechaRegistro { get; set; }
    }


}
