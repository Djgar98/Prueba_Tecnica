using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.Entities
{
    public class Comment
    {
        public int IdComment { get; set; }
        public string Author { get; set; }
        public string CommentText { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DateString => CreatedAt.ToString("dd/MM/yyyy HH:mm");
    }
}