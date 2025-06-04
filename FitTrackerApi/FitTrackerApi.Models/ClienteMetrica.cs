using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ClienteMetrica
    {
        public int CodigoCli { get; set; }
        public string SistemaMetrico { get; set; } = "M";
        public decimal? Peso { get; set; }
        public decimal? Altura { get; set; }
        public decimal? IMC { get; set; }
        public decimal? GrasaCorporal { get; set; }
        public decimal? MasaMuscular { get; set; }
        public decimal? Cintura { get; set; }
        public decimal? Caderas { get; set; }
        public decimal? Brazos { get; set; }
        public decimal? RmPress { get; set; }
        public decimal? RmSentadilla { get; set; }
        public decimal? RmPesoMuerto { get; set; }
        public int? Repeticiones { get; set; }
        public decimal? VelocidadEjecucion { get; set; }
        public decimal? TestCooper { get; set; }
        public int? FcReposo { get; set; }
        public int? FcRecuperacion { get; set; }
        public decimal? DuracionAerobica { get; set; }
        public decimal? TestFlexibilidad { get; set; }
        public decimal? RangoMovimiento { get; set; }
        public decimal? SaltoVertical { get; set; }
        public decimal? VelocidadSprint { get; set; }
        public decimal? PruebaAgilidad { get; set; }
        public decimal? Rpe { get; set; }
    }

}
