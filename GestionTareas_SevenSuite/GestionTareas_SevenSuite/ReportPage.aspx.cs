using GestionTareas_SevenSuite.BLL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GestionTareas_SevenSuite
{
    public partial class ReportPage : System.Web.UI.Page
    {
        // Propiedad para mostrar el nombre en el HTML del reporte
        public string UserName { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            // 1. LEER LA COOKIE DE AUTENTICACIÓN
            HttpCookie authCookie = Request.Cookies["UserAuth"];

            // 2. VALIDACIÓN: Si no hay cookie, no hay acceso
            if (authCookie == null || string.IsNullOrEmpty(authCookie["UserId"]))
            {
                Response.Redirect("Login.aspx");
                return;
            }

            // Asignamos el nombre desde la cookie para el pie de página
            UserName = authCookie["FullName"] ?? "Administrador";

            if (!IsPostBack)
            {
                // 3. RECUPERAR FILTROS (Estos sí se guardan en Session temporalmente al dar clic)
                // OJO: Si también pasaste el filtro por URL, podrías usar Request.QueryString
                string module = Session["CurrentModule"] as string;
                string filter = Session["CurrentFilter"] as string ?? "";

                if (string.IsNullOrEmpty(module)) return;

                lblModuleName.Text = module;

                try
                {
                    // 4. CARGA DE DATOS SEGÚN EL MÓDULO
                    if (module == "User")
                    {
                        gvReport.DataSource = new UserBLL().GetAllUsers(filter);
                    }
                    else if (module == "Project")
                    {
                        gvReport.DataSource = new ProjectBLL().GetProjects(filter);
                    }
                    else if (module == "Task")
                    {
                        gvReport.DataSource = new TaskBLL().GetTasks(null, filter);
                    }

                    gvReport.DataBind();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Error en Reporte: " + ex.Message);
                }
            }
        }


        protected void gvReport_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                var item = e.Row.DataItem;

                if (item is TaskItem task)
                {
                    e.Row.Cells[0].Text = task.ProjectName;
                    e.Row.Cells[1].Text = "<b>" + task.Title + "</b>";
                    e.Row.Cells[2].Text = task.AssignedTo;
                    e.Row.Cells[3].Text = task.Status;
                    e.Row.Cells[4].Text = task.DueDateString;
                }
                else if (item is User user)
                {
                    e.Row.Cells[0].Text = user.DNI;
                    e.Row.Cells[1].Text = "<b>" + user.FirstName + " " + user.LastName + "</b>";
                    e.Row.Cells[2].Text = user.RoleDesc;
                    e.Row.Cells[3].Text = user.IsActive ? "Activo" : "Inactivo";
                    e.Row.Cells[4].Text = user.BirthDateString;
                }
                else if (item is Project project)
                {
                    e.Row.Cells[0].Text = "PROY-" + project.IdProject;
                    e.Row.Cells[1].Text = "<b>" + project.ProjectName + "</b>";
                    e.Row.Cells[2].Text = project.OwnerName;
                    e.Row.Cells[3].Text = project.Status;
                    e.Row.Cells[4].Text = project.EndDateString;
                }
            }
        }
    }
}