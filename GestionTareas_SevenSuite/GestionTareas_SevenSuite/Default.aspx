<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="GestionTareas_SevenSuite.Default" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dashboard | Seven Suite</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    
    <style>a
        body { overflow-x: hidden; background-color: #f8f9fa; }
        .sidebar { min-height: 100vh; background-color: #fff; border-right: 1px solid #dee2e6; position: sticky; top: 56px; }
        .nav-link { color: #333; font-weight: 500; transition: 0.2s; cursor: pointer; padding: 12px 20px; }
        .nav-link.active { background-color: #0d6efd !important; color: #fff !important; }
        .nav-link:hover:not(.active) { background-color: #f8f9fa; color: #0d6efd; }
        .main-card { border: none; border-radius: 12px; min-height: 85vh; width: 100%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        .comment-box { max-height: 250px; overflow-y: auto; background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
        .sticky-top { z-index: 1030; }
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
                    <button type="button" id="btnLogout" class="btn btn-outline-danger btn-sm px-3" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>

        <div class="container-fluid">
            <div class="row">
                <nav class="col-md-3 col-lg-2 d-md-block sidebar p-0 shadow-sm">
                    <div class="pt-3">
                        <ul class="nav flex-column px-2">
                            <li class="nav-item mb-1">
                                <a class="nav-link active rounded" onclick="showSection('users')">
                                    <i class="bi bi-people me-2"></i> Usuarios
                                </a>
                            </li>
                            <li class="nav-item mb-1">
                                <a class="nav-link rounded" onclick="showSection('projects')">
                                    <i class="bi bi-kanban me-2"></i> Proyectos
                                </a>
                            </li>
                            <li class="nav-item mb-1">
                                <a class="nav-link rounded" onclick="showSection('tasks')">
                                    <i class="bi bi-check2-square me-2"></i> Tareas
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4">
                    <div class="card main-card mb-4">
                        <div class="card-body p-4">
                            
                            <div id="sec-users" class="section-content">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h3 class="fw-bold m-0 text-dark">Gestión de Usuarios</h3>
                                    <div class="d-flex gap-2">
                                        <input type="text" id="txtSearchUser" class="form-control" placeholder="Buscar..." onkeyup="loadUsers()" />
                                        <button type="button" class="btn btn-primary shadow-sm text-nowrap" onclick="openUserModal(0)">
                                            <i class="bi bi-person-plus-fill me-2"></i> Nuevo
                                        </button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle" id="tblUsers">
                                        <thead class="table-light text-uppercase small fw-bold">
                                            <tr>
                                                <th>Cédula</th>
                                                <th>Nombre Completo</th>
                                                <th>Género</th>
                                                <th>Rol</th>
                                                <th>Estado</th>
                                                <th class="text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="sec-projects" class="section-content" style="display:none;">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h3 class="fw-bold m-0 text-dark">Gestión de Proyectos</h3>
                                    <div class="d-flex gap-2">
                                        <input type="text" id="txtSearchProject" class="form-control" placeholder="Buscar..." onkeyup="loadProjects()" />
                                        <button type="button" class="btn btn-primary shadow-sm text-nowrap" onclick="openProjectModal(0)">
                                            <i class="bi bi-kanban-fill me-2"></i> Nuevo
                                        </button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle" id="tblProjects">
                                        <thead class="table-light text-uppercase small fw-bold">
                                            <tr>
                                                <th>Proyecto</th>
                                                <th>Responsable</th>
                                                <th>Inicio</th>
                                                <th>Entrega</th>
                                                <th>Estado</th>
                                                <th>Activo</th>
                                                <th class="text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="sec-tasks" class="section-content" style="display:none;">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h3 class="fw-bold m-0 text-dark">Gestión de Tareas</h3>
                                    <div class="d-flex gap-2">
                                        <input type="text" id="txtSearchTask" class="form-control" placeholder="Buscar tarea..." onkeyup="loadTasks()" />
                                        <button type="button" class="btn btn-primary shadow-sm text-nowrap" onclick="openTaskModal(0)">
                                            <i class="bi bi-plus-square-fill me-2"></i> Nueva Tarea
                                        </button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle" id="tblTasks">
                                        <thead class="table-light text-uppercase small fw-bold">
                                            <tr>
                                                <th>Tarea</th>
                                                <th>Proyecto</th>
                                                <th>Asignado a</th>
                                                <th>Vence</th>
                                                <th>Estado</th>
                                                <th class="text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>

        <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold"><i class="bi bi-person-gear me-2"></i>Perfil de Usuario</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            <input type="hidden" id="txtIdUser" value="0" />
                            <div class="col-md-6"><label class="small fw-bold">Nombres</label><input type="text" id="txtFirstName" class="form-control" /></div>
                            <div class="col-md-6"><label class="small fw-bold">Apellidos</label><input type="text" id="txtLastName" class="form-control" /></div>
                            <div class="col-md-6"><label class="small fw-bold">Cédula</label><input type="text" id="txtDNI" class="form-control" maxlength="16" /></div>
                            <div class="col-md-6"><label class="small fw-bold">Nacimiento</label><input type="text" id="txtBirthDate" class="form-control datepicker bg-white Datepicker" readonly /></div>
                            <div class="col-md-4"><label class="small fw-bold">Género</label><select id="ddlGender" class="form-select"></select></div>
                            <div class="col-md-4"><label class="small fw-bold">Estado Civil</label><select id="ddlMaritalStatus" class="form-select"></select></div>
                            <div class="col-md-4"><label class="small fw-bold">Rol</label><select id="ddlRole" class="form-select"></select></div>
                            <div class="col-md-6"><label class="small fw-bold">Usuario</label><input type="text" id="txtNewUsername" class="form-control" /></div>
                            <div class="col-md-6"><label class="small fw-bold">Contraseña</label><input type="password" id="txtNewPassword" class="form-control" placeholder="Mínimo 6 caracteres" /></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="saveUser()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="projectModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title fw-bold"><i class="bi bi-briefcase me-2"></i>Detalles del Proyecto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            <input type="hidden" id="txtIdProject" value="0" />
                            <div class="col-md-12"><label class="small fw-bold">Nombre</label><input type="text" id="txtProjectName" class="form-control" /></div>
                            <div class="col-md-12"><label class="small fw-bold">Descripción</label><textarea id="txtProjectDesc" class="form-control" rows="2"></textarea></div>
                            <div class="col-md-6"><label class="small fw-bold">Inicio</label><input type="text" id="txtStartDate" class="form-control datepicker bg-white" readonly /></div>
                            <div class="col-md-6"><label class="small fw-bold">Entrega</label><input type="text" id="txtEndDate" class="form-control datepicker bg-white" readonly /></div>
                            <div class="col-md-6"><label class="small fw-bold">Responsable</label><select id="ddlProjectOwner" class="form-select"></select></div>
                            <div class="col-md-6">
                                <label class="small fw-bold">Estado</label>
                                <select id="ddlProjectStatus" class="form-select">
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-dark" onclick="saveProject()">Guardar Proyecto</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="taskModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-md modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-info text-dark">
                        <h5 class="modal-title fw-bold"><i class="bi bi-list-check me-2"></i>Detalles de la Tarea</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            <input type="hidden" id="txtIdTask" value="0" />
                            <div class="col-md-12"><label class="small fw-bold">Proyecto</label><select id="ddlTaskProject" class="form-select"></select></div>
                            <div class="col-md-12"><label class="small fw-bold">Título</label><input type="text" id="txtTaskTitle" class="form-control" /></div>
                            <div class="col-md-12"><label class="small fw-bold">Responsable</label><select id="ddlTaskUser" class="form-select"></select></div>
                            <div class="col-md-6"><label class="small fw-bold">Vencimiento</label><input type="text" id="txtTaskDueDate" class="form-control datepicker bg-white" readonly /></div>
                            <div class="col-md-6">
                                <label class="small fw-bold">Estado</label>
                                <select id="ddlTaskStatus" class="form-select">
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Terminada">Terminada</option>
                                </select>
                            </div>
                            <div class="col-md-12 mt-4">
                                <h6 class="fw-bold mb-3"><i class="bi bi-chat-left-dots me-2"></i>Comentarios</h6>
                                <div id="divCommentsList" class="comment-box mb-3"></div>
                                <div class="input-group">
                                    <input type="text" id="txtNewComment" class="form-control" placeholder="Escribe un comentario..." />
                                    <button class="btn btn-primary" type="button" onclick="saveComment()">
                                        <i class="bi bi-send-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-info fw-bold" onclick="saveTask()">Guardar Tarea</button>
                    </div>
                </div>
            </div>
        </div>

    </form>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="Assets/js/scripts.js"></script>
</body>
</html>