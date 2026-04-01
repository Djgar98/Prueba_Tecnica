using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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

    }
}