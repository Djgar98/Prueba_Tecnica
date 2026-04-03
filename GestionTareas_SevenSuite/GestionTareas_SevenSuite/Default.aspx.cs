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
            if (!IsPostBack)
            {
                // Revisamos si existe la cookie que creaste en el Login
                HttpCookie authCookie = Request.Cookies["UserAuth"];

                if (authCookie == null || string.IsNullOrEmpty(authCookie["UserId"]))
                {
                    // Si no hay cookie, ¡fuera! al Login
                    Response.Redirect("Login.aspx");
                }
            }
        }

        // Función para mostrar el nombre en el HTML
        public string GetUserName()
        {
            HttpCookie authCookie = Request.Cookies["UserAuth"];
            return authCookie != null ? authCookie["FullName"] : "Invitado";
        }

        [WebMethod]
        public static void Logout()
        {
            if (HttpContext.Current.Request.Cookies["UserAuth"] != null)
            {
                HttpCookie myCookie = new HttpCookie("UserAuth");
                myCookie.Expires = DateTime.Now.AddDays(-1d); // Fecha pasada para borrarla
                HttpContext.Current.Response.Cookies.Add(myCookie);
            }
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

        // --- MÉTODOS DE TAREAS 
        [WebMethod]
        public static List<TaskItem> GetTasksList(int? projectId, string filter) => new TaskBLL().GetTasks(projectId, filter);

        [WebMethod]
        public static bool SaveTask(TaskItem task)
        {
            return new TaskBLL().SaveTask(task);
        }

        [WebMethod]
        public static TaskItem GetTaskById(int id)
        {
            return new TaskBLL().GetTaskById(id);
        }

        [WebMethod]
        public static bool DeleteTask(int id)
        {
            try { return new TaskBLL().DeleteTask(id); }
            catch { return false; }
        }

        [WebMethod]
        public static List<Comment> GetTaskComments(int idTask) => new TaskBLL().GetComments(idTask);

        [WebMethod]
        public static bool SaveComment(int idTask, string text)
        {
            try
            {
                // 1. Buscamos la Cookie de autenticación
                HttpCookie authCookie = HttpContext.Current.Request.Cookies["UserAuth"];

                if (authCookie == null) return false;

                // 2. Sacamos el ID del usuario de la Cookie
                int idUser = int.Parse(authCookie["UserId"]);

                return new TaskBLL().AddComment(idTask, idUser, text);
            }
            catch
            {
                return false;
            }
        }

    }
}