using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace GestionTareas_SevenSuite.DAL
{
    public class TaskDAL
    {
        // 1. OBTENER LISTADO
        public List<TaskItem> GetAll(int? projectId, string filter)
        {
            List<TaskItem> list = new List<TaskItem>();
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetTasks", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                // Aseguramos que los parámetros no envíen null directo a SQL
                cmd.Parameters.AddWithValue("@ProjectId", (object)projectId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Filter", (object)filter ?? DBNull.Value);

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(new TaskItem
                        {
                            IdTask = Convert.ToInt32(dr["IdTask"]),
                            IdProject = Convert.ToInt32(dr["IdProject"]),
                            ProjectName = dr["ProjectName"].ToString(),
                            Title = dr["Title"].ToString(),
                            Description = dr["Description"].ToString(),
                            IdAssignedUser = Convert.ToInt32(dr["IdAssignedUser"]),
                            AssignedTo = dr["AssignedTo"].ToString(),
                            Status = dr["Status"].ToString(),
                            // Manejo de fecha nula
                            DueDate = dr["DueDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["DueDate"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return list;
        }

        // 2. OBTENER POR ID (Para editar)
        public TaskItem GetById(int id)
        {
            TaskItem task = null;
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetTaskById", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        task = new TaskItem
                        {
                            IdTask = Convert.ToInt32(dr["IdTask"]),
                            IdProject = Convert.ToInt32(dr["IdProject"]),
                            Title = dr["Title"].ToString(),
                            Description = dr["Description"].ToString(),
                            // Asegúrate que en la DB la columna se llame IdAssignedUser
                            IdAssignedUser = Convert.ToInt32(dr["IdAssignedUser"]),
                            Status = dr["Status"].ToString(),
                            Priority = dr["Priority"]?.ToString() ?? "Media",
                            DueDate = dr["DueDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["DueDate"])
                        };
                    }
                }
            }
            return task;
        }

        // 3. GUARDAR (UPSERT)
        public bool Save(TaskItem t)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_UpsertTask", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                
                cmd.Parameters.AddWithValue("@IdTask", t.IdTask);
                cmd.Parameters.AddWithValue("@IdProject", t.IdProject);
                cmd.Parameters.AddWithValue("@Title", t.Title);
                cmd.Parameters.AddWithValue("@Description", (object)t.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdAssignedUser", t.IdAssignedUser); 
                cmd.Parameters.AddWithValue("@Status", t.Status);
                cmd.Parameters.AddWithValue("@Priority", t.Priority ?? "Media");

                // Manejo de fecha nula para evitar errores de conversión
                cmd.Parameters.AddWithValue("@DueDate", (object)t.DueDate ?? DBNull.Value);

                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 4. BORRADO LÓGICO
        public bool Delete(int id)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_DeleteTask", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdTask", id);

                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 5. COMENTARIOS (Listado)
        public List<Comment> GetComments(int idTask)
        {
            List<Comment> list = new List<Comment>();
            using (SqlConnection conn = Connection.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetCommentsByTask", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdTask", idTask);

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(new Comment
                        {
                            IdComment = Convert.ToInt32(dr["IdComment"]),
                            Author = dr["Author"].ToString(),
                            CommentText = dr["CommentText"].ToString(),
                            CreatedAt = Convert.ToDateTime(dr["CreatedAt"])
                        });
                    }
                }
            }
            return list;
        }

        // 6. AGREGAR COMENTARIO
        public bool AddComment(int idTask, int idUser, string text)
        {
            using (SqlConnection conn = Connection.GetConnection())
            {
                
                SqlCommand cmd = new SqlCommand("sp_AddTaskComment", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                
                cmd.Parameters.AddWithValue("@IdTask", idTask);
                cmd.Parameters.AddWithValue("@IdUser", idUser);
                cmd.Parameters.AddWithValue("@CommentText", text);

                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}