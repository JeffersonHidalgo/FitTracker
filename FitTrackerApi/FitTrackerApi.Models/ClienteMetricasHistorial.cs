using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ClienteMetricasHistorial
    {
        public int MetricaId { get; set; }
        public DateTime FechaRegistro { get; set; }

        public decimal? IMC { get; set; }
        public decimal? GrasaCorporal { get; set; }
        public decimal? MasaMuscular { get; set; }

        public decimal? RmPress { get; set; }
        public decimal? RmSentadilla { get; set; }
        public decimal? RmPesoMuerto { get; set; }

        public decimal? TestCooper { get; set; }
        public int? FcReposo { get; set; }

        public decimal? TestFlexibilidad { get; set; }
        public decimal? SaltoVertical { get; set; }

        public decimal? Rpe { get; set; }
    }
}
