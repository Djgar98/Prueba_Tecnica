using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.Entities
{
    public class TaskItem
    {
        public int IdTask { get; set; }
        public int IdProject { get; set; }
        public string ProjectName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int IdAssignedUser { get; set; }
        public string AssignedTo { get; set; }
        public string Status { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsActive { get; set; }
        public string DueDateString => DueDate?.ToString("yyyy-MM-dd") ?? "";
        public string Priority { get; set; } // Agregá esta línea
    }
}