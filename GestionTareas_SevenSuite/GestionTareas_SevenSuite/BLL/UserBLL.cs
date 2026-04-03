using GestionTareas_SevenSuite.DAL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace GestionTareas_SevenSuite.BLL
{
    public class UserBLL
    {
        private UserDAL _userDal = new UserDAL();

        public User Login(string username, string password)
        {
            // Validación simple antes de ir a la BD
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            return _userDal.Authenticate(username, password);
        }


        public List<User> GetAllUsers(string filter) => _userDal.GetAllUsers(filter);

        public bool Save(User user) => _userDal.Save(user);

        // --- MÉTODOS NUEVOS CORREGIDOS ---

        public User GetUserById(int id)
        {
            // Corregido: cambiamos _dal por _userDal
            return _userDal.GetUserById(id);
        }

        public bool Delete(int id)
        {
            // Corregido: cambiamos _dal por _userDal
            return _userDal.Delete(id);
        }

        // --- LÓGICA DE CATÁLOGOS ---

        public object GetFormCatalogs()
        {
            return new
            {
                Genders = DataTableToList(_userDal.GetCatalog("Genders")),
                MaritalStatuses = DataTableToList(_userDal.GetCatalog("MaritalStatuses")),
                Roles = DataTableToList(_userDal.GetCatalog("Roles"))
            };
        }

        private List<CatalogDTO> DataTableToList(DataTable dt)
        {
            List<CatalogDTO> list = new List<CatalogDTO>();
            foreach (DataRow row in dt.Rows)
            {
                list.Add(new CatalogDTO
                {
                    Id = Convert.ToInt32(row[0]), // El ID que viene con Alias
                    Description = row[1].ToString() // La descripción
                });
            }
            return list;
        }

        // Clase de apoyo para el transporte de catálogos
        public class CatalogDTO
        {
            public int Id { get; set; }
            public string Description { get; set; }
        }
        public bool Reactivate(int id)
        {
            return _userDal.Reactivate(id);
        }
    }
}