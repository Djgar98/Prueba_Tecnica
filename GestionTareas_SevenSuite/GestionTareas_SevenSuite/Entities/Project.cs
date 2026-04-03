using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.Entities
{
    public class Project
    {
        public int IdProject { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }

        // El signo ? permite que C# acepte que la fecha venga vacía desde el JS
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int IdUserOwner { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }

        // Helpers para el Grid
        public string StartDateString => StartDate?.ToString("yyyy-MM-dd") ?? "";
        public string EndDateString => EndDate?.ToString("yyyy-MM-dd") ?? "";
        public string OwnerName { get; set; }
    }
}