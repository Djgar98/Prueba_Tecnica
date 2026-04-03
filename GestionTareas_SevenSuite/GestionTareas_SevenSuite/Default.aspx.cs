using GestionTareas_SevenSuite.BLL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GestionTareas_SevenSuite
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Validar si la cookie existe
            if (Request.Cookies["UserAuth"] == null)
            {
                // Si no existe, mandarlo al Login de inmediato
                Response.Redirect("Login.aspx");
            }
        }

        // Función para mostrar el nombre en el HTML
        public string GetUserName()
        {
            if (Request.Cookies["UserAuth"] != null)
            {
                return Request.Cookies["UserAuth"]["FullName"];
            }
            return "Invitado";
        }

        [System.Web.Services.WebMethod]
        public static string Logout()
        {
            if (HttpContext.Current.Request.Cookies["UserAuth"] != null)
            {
                HttpCookie myCookie = new HttpCookie("UserAuth");
                myCookie.Path = "/"; // <--- MISMO PATH QUE EN EL LOGIN
                myCookie.Expires = DateTime.Now.AddDays(-1d); // FECHA PASADA
                HttpContext.Current.Response.Cookies.Add(myCookie);
            }
            return "success";
        }

        // --- MÉTODOS DE USUARIOS ---
        [WebMethod]
        public static List<User> GetUsersList(string filter) => new UserBLL().GetAllUsers(filter);

        [WebMethod]
        public static object GetCatalogs() => new UserBLL().GetFormCatalogs();

        [WebMethod]
        public static string SaveUser(User user)
        {
            new UserBLL().Save(user);
            return "success";
        }

        [WebMethod]
        public static User GetUserById(int id) => new UserBLL().GetUserById(id);

        [WebMethod]
        public static bool DeleteUser(int id) => new UserBLL().Delete(id);

        [WebMethod]
        public static bool ReactivateUser(int id) => new UserBLL().Reactivate(id);

        // --- MÉTODOS DE PROYECTOS ---
        [WebMethod]
        public static List<Project> GetProjectsList(string filter) => new ProjectBLL().GetProjects(filter);

        [WebMethod]
        public static bool SaveProject(Project project) => new ProjectBLL().SaveProject(project);

        [WebMethod]
        public static Project GetProjectById(int id) => new ProjectBLL().GetProjectById(id);

        [WebMethod]
        public static bool DeleteProject(int id) => new ProjectBLL().DeleteProject(id);

        [WebMethod]
        public static bool ReactivateProject(int id) => new ProjectBLL().ReactivateProject(id);

        // --- MÉTODOS DE TAREAS (Aquí agregué el que faltaba) ---
        [WebMethod]
        public static List<TaskItem> GetTasksList(int? projectId, string filter) => new TaskBLL().GetTasks(projectId, filter);

        [WebMethod]
        public static bool SaveTask(TaskItem task) => new TaskBLL().SaveTask(task);

        [WebMethod]
        public static TaskItem GetTaskById(int id)
        {
            try { return new TaskBLL().GetTaskById(id); }
            catch { return null; }
        }

        // ESTE ES EL QUE TE FALTABA PARA QUE FUNCIONARA EL BOTÓN DE BORRAR
        [WebMethod]
        public static bool DeleteTask(int id)
        {
            try { return new TaskBLL().DeleteTask(id); }
            catch { return false; }
        }

        [WebMethod]
        public static List<Comment> GetTaskComments(int idTask) => new TaskBLL().GetComments(idTask);

        [WebMethod(EnableSession = true)]
        public static bool SaveComment(int idTask, string text)
        {
            try
            {
                // Prioridad 1: Session (Más segura para WebMethods)
                object userIdSession = HttpContext.Current.Session["UserId"];

                if (userIdSession == null) return false;

                int idUser = Convert.ToInt32(userIdSession);
                return new TaskBLL().AddComment(idTask, idUser, text);
            }
            catch { return false; }
        }

    }
}