<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="GestionTareas_SevenSuite.Default" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dashboard | Seven Suite</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" />
    <link href="Assets/css/styles.css" rel="stylesheet" />

    <style>
        body { overflow-x: hidden; }
        .sidebar { min-height: 92vh; background-color: #fff; border-right: 1px solid #dee2e6; }
        .nav-link { color: #333; font-weight: 500; }
        .nav-link.active { background-color: #0d6efd; color: #fff !important; }
        .nav-link:hover:not(.active) { background-color: #f8f9fa; }
        .main-card { border: none; border-radius: 10px; min-height: 85vh; }
        .navbar-brand { font-weight: bold; letter-spacing: 1px; }
    </style>
</head>
<body class="bg-light">
    <form id="form1" runat="server">
        
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div class="container-fluid px-4">
                <a class="navbar-brand" href="#"><i class="bi bi-layers-half me-2"></i>SEVEN SUITE</a>
                
                <div class="d-flex align-items-center">
                    <div class="text-white me-4 d-none d-sm-block">
                        <small class="text-muted">Usuario:</small> 
                        <strong><%= GetUserName() %></strong>
                    </div>
                    <button type="button" id="btnLogout" class="btn btn-outline-danger btn-sm px-3">
                        <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>

   
    </form>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="Assets/js/scripts.js"></script>
</body>
</html>