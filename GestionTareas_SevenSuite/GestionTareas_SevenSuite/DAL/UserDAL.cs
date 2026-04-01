using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.DAL
{
    public class UserDAL
    {
        public User Authenticate(string username, string password)
        {
            User user = null;
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_AuthenticateUser", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Password", password);

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        user = new User
                        {
                            IdUser = (int)reader["IdUser"],
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            IdRol = (int)reader["IdRol"]
                        };
                    }
                }
            }
            return user;
        }
    }
}