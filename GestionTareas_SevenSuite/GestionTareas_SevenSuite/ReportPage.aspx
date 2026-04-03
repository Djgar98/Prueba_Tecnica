<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportPage.aspx.cs" Inherits="GestionTareas_SevenSuite.ReportPage" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte | Seven Suite</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        body { background-color: white; font-family: 'Segoe UI', Tahoma, sans-serif; color: #333; }
        .container { width: 95%; max-width: 1200px; margin: auto; }
    
        /* Estilos de la tabla */
        .table { width: 100% !important; border-collapse: collapse; margin-top: 10px; }
        .table th { 
            background-color: #f8f9fa !important; /* Gris clarito como en tu captura */
            color: #666 !important; 
            text-transform: uppercase; 
            font-size: 0.7rem; 
            padding: 12px 8px !important;
            border-bottom: 2px solid #dee2e6 !important;
        }
        .table td { font-size: 0.8rem; padding: 10px 8px !important; border-bottom: 1px solid #eee !important; }

        @media print {
            /* ESTO FUERZA LA ORIENTACIÓN HORIZONTAL Y TAMAÑO CARTA */
            @page { 
                size: letter landscape; 
                margin: 1cm; 
            }
        
            .no-print { display: none; }
            body { margin: 0; padding: 0; }
            .container { width: 100% !important; max-width: 100% !important; }
        
            /* Asegurar que se vean los colores de fondo */
            .table thead tr th { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important;
                background-color: #f8f9fa !important;
            }
        }
    </style>
</head>
<body> 
    <form id="form1" runat="server">
        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4">
                <div>
                    <h1 class="fw-bold text-primary mb-0" style="letter-spacing: -1px;">SEVEN SUITE</h1>
                    <p class="text-muted mb-0">Módulo: <strong><asp:Label ID="lblModuleName" runat="server" /></strong></p>
                </div>
                <div class="text-end">
                    <p class="mb-0 small text-muted">Generado el: <strong><%= DateTime.Now.ToString("dd/MM/yyyy HH:mm") %></strong></p>
                </div>
            </div>
            
            <div class="table-responsive">
                <asp:GridView ID="gvReport" runat="server" 
                    CssClass="table table-bordered table-striped align-middle" 
                    AutoGenerateColumns="False" Width="100%" 
                    OnRowDataBound="gvReport_RowDataBound">
                    
                    <Columns>
                        <asp:BoundField HeaderText="Referencia / DNI" ItemStyle-Width="18%" />
                        <asp:BoundField HeaderText="Descripción / Nombre" ItemStyle-Width="37%" />
                        <asp:BoundField HeaderText="Responsable / Rol" ItemStyle-Width="20%" />
                        <asp:BoundField HeaderText="Estado" ItemStyle-Width="10%" />
                        <asp:BoundField HeaderText="Fecha" ItemStyle-Width="15%" />
                    </Columns>

                    <EmptyDataTemplate>
                        <div class="text-center py-5 border">
                            <h5 class="text-muted">No hay registros para mostrar.</h5>
                        </div>
                    </EmptyDataTemplate>
                </asp:GridView>
            </div>
            
            <div class="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                <div class="small text-muted">© <%= DateTime.Now.Year %> Seven Suite IT System.</div>
                <div class="fw-bold small p-2 bg-light rounded">
                    Generado por: <span class="text-primary"><%= UserName %></span>
                </div>
            </div>
        </div>
    </form>

    <script>
        window.onload = function () {
            setTimeout(function () { window.print(); }, 1000);
        }
    </script>
</body>
</html>