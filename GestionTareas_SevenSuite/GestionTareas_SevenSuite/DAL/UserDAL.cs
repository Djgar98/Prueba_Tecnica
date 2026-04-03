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

        public List<User> GetAllUsers(string filter)
        {
            List<User> list = new List<User>();
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetUsers", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filter", filter ?? "");

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(new User
                        {
                            IdUser = dr["IdUser"] != DBNull.Value ? (int)dr["IdUser"] : 0,
                            FirstName = dr["FirstName"]?.ToString() ?? string.Empty,
                            LastName = dr["LastName"]?.ToString() ?? string.Empty,
                            DNI = dr["DNI"]?.ToString() ?? string.Empty,
                            RoleDesc = dr["RoleDesc"]?.ToString() ?? string.Empty,
                            GenderDesc = dr["GenderDesc"]?.ToString() ?? string.Empty,
                            IsActive = dr["IsActive"] != DBNull.Value && Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return list;
        }

        // 3. NUEVO: Guardar o Actualizar Usuario
        public bool Save(User user)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                // Asegúrate de que el SP maneje valores nulos
                SqlCommand cmd = new SqlCommand("sp_UpsertUser", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdUser", user.IdUser);
                cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                cmd.Parameters.AddWithValue("@LastName", user.LastName);
                cmd.Parameters.AddWithValue("@DNI", user.DNI);
                cmd.Parameters.AddWithValue("@BirthDate", user.BirthDate);
                cmd.Parameters.AddWithValue("@IdGender", user.IdGender);
                cmd.Parameters.AddWithValue("@IdMaritalStatus", user.IdMaritalStatus);
                cmd.Parameters.AddWithValue("@IdRol", user.IdRol);
                cmd.Parameters.AddWithValue("@Username", user.Username);

                // LÓGICA CRUCIAL: Si la contraseña viene vacía, enviamos DBNull
                if (string.IsNullOrEmpty(user.Password))
                    cmd.Parameters.AddWithValue("@Password", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@Password", user.Password);

                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
        public DataTable GetCatalog(string tableName)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conn = Connection.GetConnection())
            {
                string idColumn = "Id";
                if (tableName == "Roles") idColumn = "IdRol";
                else if (tableName == "Genders") idColumn = "IdGender";
                else if (tableName == "MaritalStatuses") idColumn = "IdMaritalStatus";

                // Usamos [{tableName}] para evitar errores de sintaxis
                string query = $"SELECT {idColumn} AS Id, Description FROM [{tableName}]";

                try
                {
                    SqlDataAdapter da = new SqlDataAdapter(query, conn);
                    da.Fill(dt);
                }
                catch (Exception ex)
                {
                    // Escribe el error en la consola de VS para que lo veas mientras debugueas
                    System.Diagnostics.Debug.WriteLine("Error en " + tableName + ": " + ex.Message);
                    return new DataTable();
                }
            }
            return dt;
        }

        // Obtener un solo usuario por ID para editar
        public User GetUserById(int id)
        {
            User user = null;
            using (SqlConnection conn = Connection.GetConnection())
            {
                string query = "SELECT * FROM Users WHERE IdUser = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        user = new User
                        {
                            IdUser = (int)dr["IdUser"],
                            FirstName = dr["FirstName"].ToString(),
                            LastName = dr["LastName"].ToString(),
                            DNI = dr["DNI"].ToString(),
                            BirthDate = Convert.ToDateTime(dr["BirthDate"]),
                            IdGender = (int)dr["IdGender"],
                            IdMaritalStatus = (int)dr["IdMaritalStatus"],
                            IdRol = (int)dr["IdRol"],
                            Username = dr["Username"].ToString()
                        };
                    }
                }
            }
            return user;
        }


        public bool Delete(int id)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                // Cambiamos IsActive a 0 en lugar de hacer un DELETE físico
                string query = "UPDATE Users SET IsActive = 0 WHERE IdUser = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Reactivate(int id)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                string query = "UPDATE Users SET IsActive = 1 WHERE IdUser = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}