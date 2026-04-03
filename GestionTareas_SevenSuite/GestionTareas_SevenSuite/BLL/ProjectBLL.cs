using GestionTareas_SevenSuite.DAL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.BLL
{
    public class ProjectBLL
    {
        private ProjectDAL _projectDal = new ProjectDAL();

        // Obtener todos los proyectos (con filtro)
        public List<Project> GetProjects(string filter)
        {
            // Aquí podrías agregar validaciones extra si fuera necesario
            return _projectDal.GetAllProjects(filter);
        }

        // Obtener un proyecto por su ID
        public Project GetProjectById(int id)
        {
            if (id <= 0) return null;
            return _projectDal.GetById(id);
        }

        // Guardar o Actualizar
        public bool SaveProject(Project project)
        {
            // Validaciones de negocio antes de mandar a la DB
            if (string.IsNullOrEmpty(project.ProjectName)) return false;
            if (project.StartDate == null || project.EndDate == null) return false;
            if (project.IdUserOwner <= 0) return false;

            return _projectDal.Save(project);
        }

        // BORRADO LÓGICO
        public bool DeleteProject(int id)
        {
            if (id <= 0) return false;
            return _projectDal.Delete(id);
        }

        public bool ReactivateProject(int id)
        {
            if (id <= 0) return false;
            return _projectDal.Reactivate(id);
        }
    }
}