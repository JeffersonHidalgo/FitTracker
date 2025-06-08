using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Dashboard
{
    public class DashboardSummaryDto
    {
        public int TotalClients { get; set; }
        public int ActiveClients { get; set; }
        public int InactiveClients { get; set; }
        public int ActivePercentage { get; set; }
        public int InactivePercentage { get; set; }
        public int NewLast30 { get; set; }
        public int NewLast7 { get; set; }
    }
}
