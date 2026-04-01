using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.DAL
{
    public class Connection
    {
        public static SqlConnection GetConnection()
        {
            // "SevenSuiteConn" debe ser el nombre que pusiste en el Web.config
            string connStr = ConfigurationManager.ConnectionStrings["SevenSuiteConn"].ConnectionString;
            return new SqlConnection(connStr);
        }
    }
}