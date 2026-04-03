using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.DAL
{
    public class ProjectDAL
    {
        public List<Project> GetAllProjects(string filter)
        {
            List<Project> list = new List<Project>();
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetProjects", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filter", filter);
                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(new Project
                        {
                            IdProject = (int)dr["IdProject"],
                            ProjectName = dr["ProjectName"].ToString(),
                            Description = dr["Description"] == DBNull.Value ? "" : dr["Description"].ToString(),
                            StartDate = Convert.ToDateTime(dr["StartDate"]),
                            EndDate = Convert.ToDateTime(dr["EndDate"]),
                            Status = dr["Status"].ToString(),
                            // USA ESTO: Convert.ToInt32 en lugar de ToString
                            IdUserOwner = Convert.ToInt32(dr["IdUserOwner"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            OwnerName = dr["OwnerName"] == DBNull.Value ? "Sin asignar" : dr["OwnerName"].ToString()
                        });
                    }
                }
            }
            return list;
        }

        public bool Save(Project p)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_UpsertProject", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdProject", p.IdProject);
                cmd.Parameters.AddWithValue("@ProjectName", p.ProjectName);
                cmd.Parameters.AddWithValue("@Description", p.Description);
                cmd.Parameters.AddWithValue("@StartDate", p.StartDate);
                cmd.Parameters.AddWithValue("@EndDate", p.EndDate);
                cmd.Parameters.AddWithValue("@IdUserOwner", p.IdUserOwner);
                cmd.Parameters.AddWithValue("@Status", p.Status);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public Project GetById(int id)
        {
            Project p = null;
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetProjectById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        p = new Project
                        {
                            IdProject = (int)dr["IdProject"],
                            ProjectName = dr["ProjectName"].ToString(),
                            Description = dr["Description"].ToString(),
                            StartDate = Convert.ToDateTime(dr["StartDate"]),
                            EndDate = Convert.ToDateTime(dr["EndDate"]),
                            IdUserOwner = (int)dr["IdUserOwner"],
                            Status = dr["Status"].ToString()
                        };
                    }
                }
            }
            return p;
        }



        // MÉTODO PARA BORRADO LÓGICO
        public bool Delete(int id)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_DeleteProject", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdProject", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // MÉTODO PARA REACTIVAR
        public bool Reactivate(int id)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_ReactivateProject", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdProject", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}