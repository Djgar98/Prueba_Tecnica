using GestionTareas_SevenSuite.DAL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;

namespace GestionTareas_SevenSuite.BLL
{
    public class TaskBLL
    {
        private readonly TaskDAL _dal = new TaskDAL();

        // 1. OBTENER LISTADO
        public List<TaskItem> GetTasks(int? projectId, string filter)
        {
            // Si el projectId es 0, lo tratamos como null para que la DAL traiga todo
            int? idSearch = (projectId <= 0) ? null : projectId;
            return _dal.GetAll(idSearch, filter);
        }

        // 2. OBTENER POR ID (Para Editar)
        public TaskItem GetTaskById(int id)
        {
            if (id <= 0) return null;
            return _dal.GetById(id);
        }

        // 3. GUARDAR Y ACTUALIZAR
        public bool SaveTask(TaskItem t)
        {
            // Validaciones de negocio obligatorias
            if (t == null) return false;
            if (string.IsNullOrWhiteSpace(t.Title)) return false;
            if (t.IdProject <= 0 || t.IdAssignedUser <= 0) return false;

            // Si no trae estado, le ponemos uno por defecto
            if (string.IsNullOrEmpty(t.Status)) t.Status = "Pendiente";
            if (string.IsNullOrEmpty(t.Priority)) t.Priority = "Media";

            return _dal.Save(t);
        }

        // 4. BORRADO LÓGICO
        public bool DeleteTask(int id)
        {
            if (id <= 0) return false;
            return _dal.Delete(id);
        }

        // 5. GESTIÓN DE COMENTARIOS
        public List<Comment> GetComments(int idTask)
        {
            // No buscamos comentarios si la tarea no existe (id 0)
            if (idTask <= 0) return new List<Comment>();
            return _dal.GetComments(idTask);
        }

        public bool AddComment(int idTask, int idUser, string text)
        {
            // Validaciones antes de ir a la base de datos
            if (idTask <= 0 || idUser <= 0 || string.IsNullOrWhiteSpace(text))
            {
                return false;
            }

            return _dal.AddComment(idTask, idUser, text);
        }
    }
}