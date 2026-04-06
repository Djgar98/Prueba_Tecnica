# Seven Suite - Sistema de Gestión de Tareas e IT

Sistema web desarrollado en **ASP.NET Web Forms (C#)** para la administración de usuarios, proyectos y tareas, con reportes dinámicos y filtros avanzados.

## 🚀 Características
- **Autenticación:** Manejo de sesiones mediante Cookies seguras.
- **Dashboard Dinámico:** Gestión completa (CRUD) de Usuarios, Proyectos y Tareas sin recargar la página (AJAX).
- **Reportes:** Generación de reportes en formato horizontal (Landscape) con filtros dinámicos.
- **Interfaz:** Diseño moderno con Bootstrap 5, Tooltips nativos y Datepickers de jQuery UI.

## 🛠️ Tecnologías
- **Backend:** C# (.NET Framework 4.8)
- **Frontend:** HTML5, CSS3, JavaScript (jQuery)
- **Base de Datos:** SQL Server (Stored Procedures)
- **Diseño:** Bootstrap 5.3

## 📋 Instalación de la Base de Datos
1. Abre SQL Server Management Studio.
2. Crea una nueva base de datos llamada `GestionTareas_DB`.
3. Ejecuta el script ubicado en `/Database/database_setup.sql`.
4. Ajusta la cadena de conexión en el `Web.config`:
   ```xml
   <connectionStrings>
     <add name="Conn" connectionString="Data Source=TU_SERVIDOR;Initial Catalog=SevenSuite_TaskDB;Integrated Security=True" />
   </connectionStrings>
