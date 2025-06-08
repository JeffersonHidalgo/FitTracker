using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class EmpresaConfiguracion
    {
        public int Id { get; set; }
        public string NombreEmpresa { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string CodigoPostal { get; set; }
        public string Pais { get; set; }
        public string TelefonoEmpresa { get; set; }
        public string EmailEmpresa { get; set; }
        public string ServidorSmtp { get; set; }
        public int PuertoSmtp { get; set; }
        public string UsuarioSmtp { get; set; }
        public string PasswordSmtp { get; set; }
        public bool UsarSsl { get; set; }
        public string Logo { get; set; }
    }
}
