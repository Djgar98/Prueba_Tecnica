using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.Entities
{
    public class Project
    {
        public int IdProject { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}