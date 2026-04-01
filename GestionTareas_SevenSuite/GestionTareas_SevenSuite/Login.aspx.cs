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
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static string PerformLogin(string username, string password)
        {
            UserBLL bll = new UserBLL();
            User user = bll.Login(username, password);

            if (user != null)
            {
                // Crear la Cookie de forma manual (Seguridad)
                HttpCookie authCookie = new HttpCookie("UserAuth");
                authCookie["UserId"] = user.IdUser.ToString();
                authCookie["FullName"] = user.FirstName + " " + user.LastName;
                authCookie.Expires = DateTime.Now.AddHours(4); // Expira en 4 horas
                authCookie.Path = "/";

                HttpContext.Current.Response.Cookies.Add(authCookie);
                return "success";
            }
            return "error";
        }
    }
}