using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.Entities
{
    public class Task
    {
        public int IdTask { get; set; }
        public int IdProject { get; set; }
        public string ProjectName { get; set; } // Para mostrar en el Grid
        public string Title { get; set; }
        public string Description { get; set; }
        public int IdAssignedUser { get; set; }
        public string AssignedTo { get; set; } // Para mostrar en el Grid
        public string Status { get; set; }
        public DateTime DueDate { get; set; }
    }
}