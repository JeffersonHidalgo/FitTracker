using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Dashboard
{
    public class DashboardSaludDto
    {
        public decimal Bmi { get; set; }
        public decimal BodyFat { get; set; }
        public decimal MuscleMass { get; set; }
        public List<TrendDto> BmiTrend { get; set; }
    }
    public class TrendDto
    {
        public string Month { get; set; }
        public decimal Value { get; set; }
    }

}
