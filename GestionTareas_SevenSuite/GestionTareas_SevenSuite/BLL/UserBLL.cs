using GestionTareas_SevenSuite.DAL;
using GestionTareas_SevenSuite.Entities;
using System;
using System.Collections.Generic;
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
    }
}