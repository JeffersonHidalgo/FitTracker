using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Dashboard
{
    public class DashboardDemografiaDto
    {
        public int Female { get; set; }
        public int Male { get; set; }
        public int Other { get; set; }

        public int Age18_25 { get; set; }
        public int Age26_35 { get; set; }
        public int Age36_45 { get; set; }
        public int Age46Plus { get; set; }
        public int AverageAge { get; set; }

        public List<LocationDto> Location { get; set; }
    }
    public class LocationDto
    {
        public string City { get; set; }
        public int Clients { get; set; }
    }
    public class CumpleanosDto
    {
        public string Name { get; set; }
        public string Date { get; set; }
    }
}
