using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class Cliente
    {
        public int CodigoCli { get; set; }
        public string NombreCompleto { get; set; }
        public string Estado { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Calle { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string CodigoPostal { get; set; }
        public string TipoMembresia { get; set; }
        public DateTime FechaInicio { get; set; }
        public string FotoPerfil { get; set; }
        public string ContactoEmergencia { get; set; }
        public DateTime FechaCrea { get; set; }
        public DateTime FechaModifica { get; set; }
        public int UsuModifica { get; set; }

        public List<ClienteEmail> Emails { get; set; }
        public List<ClienteTelefono> Telefonos { get; set; }
    }
}



