using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Reportes
{
    public class ClienteEstadoDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime FechaInicio { get; set; }
        public string EmailPrincipal { get; set; }
        public string TelefonoPrincipal { get; set; }
        public string Estado { get; set; }
    }

    public class ClienteNuevoDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
    }

    public class ClienteSinActividadDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime? UltimaMetrica { get; set; }
        public string EmailPrincipal { get; set; }
        public string TelefonoPrincipal { get; set; }
    }
    public class ClienteImcCategoriaDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public decimal ImcActual { get; set; }
        public DateTime FechaUltimaMedicion { get; set; }
        public string Categoria { get; set; }
    }

    public class ClienteRiesgoDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public decimal Imc { get; set; }
        public int FcReposo { get; set; }
        public decimal TestCooper { get; set; }
        public int Edad { get; set; }
    }

    public class ClienteCambioImcDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public decimal ImcInicial { get; set; }
        public decimal ImcActual { get; set; }
        public decimal Diferencia { get; set; }
        public decimal PorcentajeCambio { get; set; }
    }

    public class ClienteProgresoFuerzaDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public decimal RmInicial { get; set; }
        public decimal RmActual { get; set; }
        public decimal Diferencia { get; set; }
        public decimal PorcentajeIncremento { get; set; }
        public string Ejercicio { get; set; }
    }

    public class ClienteProgresoCardioDto
    {
        public int ClienteId { get; set; }
        public string NombreCompleto { get; set; }
        public decimal TestCooperInicial { get; set; }
        public decimal TestCooperActual { get; set; }
        public decimal Diferencia { get; set; }
        public decimal PorcentajeMejora { get; set; }
    }
}
