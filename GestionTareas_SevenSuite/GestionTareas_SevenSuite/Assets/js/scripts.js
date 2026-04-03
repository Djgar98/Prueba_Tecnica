$(document).ready(function () {
    // --- 1. DETECCIÓN DE PÁGINA ---
    var isDashboardPage = $(".navbar").length > 0;
    var isLoginPage = $("#btnLogin").length > 0;

    // --- 2. LÓGICA DE INICIO DE SESIÓN ---
    if (isLoginPage) {
        $("#btnLogin").click(function () { performLogin(); });
        $(document).on("keypress", function (e) {
            if (e.which == 13) performLogin();
        });
    }

    // --- 3. LÓGICA DE DASHBOARD ---
    if (isDashboardPage) {
        initTooltips();
        loadCatalogs();
        loadUsers();
        loadProjects();
        loadTasks();

        // CONFIGURACIÓN MAESTRA DEL DATEPICKER (Para que funcione en todos los modales)
        $(document).on('focus', ".datepicker", function () {
            $(this).datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: "-100:+10",
                showAnim: "slideDown",
                beforeShow: function (input, inst) {
                    setTimeout(function () {
                        inst.dpDiv.css({ 'z-index': 2100 }); // Por encima del modal
                    }, 0);
                }
            });
        });
    }
});

// --- NAVEGACIÓN ---
function showSection(sectionName) {
    $(".section-content").hide();
    $(".nav-link").removeClass("active");
    $("#sec-" + sectionName).fadeIn();
    if (event && event.currentTarget) $(event.currentTarget).addClass("active");
}

function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        var instance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (instance) instance.dispose();
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// --- MÓDULO USUARIOS ---
function loadUsers() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetUsersList",
        data: JSON.stringify({ filter: $("#txtSearchUser").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let html = "";
            r.d.forEach(u => {
                let badge = u.IsActive ? 'bg-success' : 'bg-secondary';
                let txtActivo = u.IsActive ? 'Activo' : 'Inactivo';

                let btnEstado = u.IsActive
                    ? `<button type="button" class="btn btn-sm btn-danger" onclick="deleteUser(${u.IdUser})"><i class="bi bi-trash"></i></button>`
                    : `<button type="button" class="btn btn-sm btn-success" onclick="reactivateUser(${u.IdUser})"><i class="bi bi-check-circle"></i></button>`;

                
                html += `<tr>
                    <td>${u.DNI}</td>
                    <td><strong>${u.FirstName} ${u.LastName}</strong></td>
                    <td>${u.GenderDesc}</td>
                    <td>${u.RoleDesc}</td> <td><span class="badge ${badge}">${txtActivo}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="openUserModal(${u.IdUser})"><i class="bi bi-pencil"></i></button>
                        ${btnEstado}
                    </td></tr>`;
            });
            $("#tblUsers tbody").html(html);
            initTooltips();
        }
    });
}

function openUserModal(id) {
    $("#txtIdUser").val(id);
    if (id === 0) {
        $("#userModal input").val("");
        $("#userModal select").val(0);
        $("#txtNewPassword").attr("placeholder", "Mínimo 6 caracteres");
        bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).show();
    } else {
        $.ajax({
            type: "POST",
            url: "Default.aspx/GetUserById",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            success: function (r) {
                let u = r.d;
                $("#txtFirstName").val(u.FirstName);
                $("#txtLastName").val(u.LastName);
                $("#txtDNI").val(u.DNI);
                $("#txtBirthDate").val(u.BirthDateString);
                $("#ddlGender").val(u.IdGender);
                $("#ddlMaritalStatus").val(u.IdMaritalStatus);
                $("#ddlRole").val(u.IdRol);
                $("#txtNewUsername").val(u.Username);
                $("#txtNewPassword").val("").attr("placeholder", "Dejar en blanco para no cambiar");
                bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).show();
                setTimeout(initTooltips, 500);
            }
        });
    }
}

function saveUser() {
    let userObj = {
        IdUser: parseInt($("#txtIdUser").val()) || 0,
        FirstName: $("#txtFirstName").val().trim(),
        LastName: $("#txtLastName").val().trim(),
        DNI: $("#txtDNI").val().trim(),
        BirthDate: $("#txtBirthDate").val(),
        IdGender: parseInt($("#ddlGender").val()),
        IdMaritalStatus: parseInt($("#ddlMaritalStatus").val()),
        IdRol: parseInt($("#ddlRole").val()),
        Username: $("#txtNewUsername").val().trim(),
        Password: $("#txtNewPassword").val().trim()
    };
    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveUser",
        data: JSON.stringify({ user: userObj }),
        contentType: "application/json; charset=utf-8",
        success: function () {
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            loadUsers();
        }
    });
}

// --- MÓDULO PROYECTOS ---
function loadProjects() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetProjectsList",
        data: JSON.stringify({ filter: $("#txtSearchProject").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let html = "";
            r.d.forEach(p => {
                // Lógica de colores para estados
                let stateClass = "bg-secondary"; // Default
                if (p.Status === "Pendiente") stateClass = "bg-warning text-dark";
                if (p.Status === "En Proceso") stateClass = "bg-info text-white";
                if (p.Status === "Finalizado") stateClass = "bg-success text-white";

                let activeBadge = p.IsActive ? 'bg-success' : 'bg-danger';

                // Botón de borrado lógico
                let btnDelete = p.IsActive
                    ? `<button type="button" class="btn btn-sm btn-danger" onclick="deleteProject(${p.IdProject})"><i class="bi bi-trash"></i></button>`
                    : `<button type="button" class="btn btn-sm btn-success" onclick="reactivateProject(${p.IdProject})"><i class="bi bi-check-circle"></i></button>`;

                html += `<tr>
                    <td><strong>${p.ProjectName}</strong></td>
                    <td>${p.OwnerName}</td>
                    <td>${p.StartDateString}</td>
                    <td>${p.EndDateString}</td>
                    <td><span class="badge ${stateClass} shadow-sm">${p.Status}</span></td>
                    <td><span class="badge ${activeBadge}">${p.IsActive ? 'Sí' : 'No'}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="openProjectModal(${p.IdProject})"><i class="bi bi-pencil"></i></button>
                        ${btnDelete}
                    </td></tr>`;
            });
            $("#tblProjects tbody").html(html);
            initTooltips();
        }
    });
}

// Funciones para el borrado lógico de proyectos
function deleteProject(id) { if (confirm("¿Desactivar este proyecto?")) execStatus("DeleteProject", id, loadProjects); }
function reactivateProject(id) { execStatus("ReactivateProject", id, loadProjects); }

function openProjectModal(id) {
    // 1. PRIMERO limpiamos todo el modal
    $("#projectModal input, #projectModal textarea").val("");
    $("#projectModal select").val(0);

    // 2. DESPUÉS asignamos el ID (para que no se borre con la línea anterior)
    $("#txtIdUser").val(id); // Si tu hidden se llama txtIdProject, cámbialo aquí
    $("#txtIdProject").val(id);

    loadOwnersCombo().done(function () {
        if (id === 0) {
            // Configuración para nuevo proyecto
            $("#ddlProjectStatus").val("Pendiente");
            bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();
        } else {
            // Configuración para editar proyecto existente
            $.ajax({
                type: "POST",
                url: "Default.aspx/GetProjectById",
                data: JSON.stringify({ id: id }),
                contentType: "application/json; charset=utf-8",
                success: function (r) {
                    let p = r.d;
                    // Llenamos los campos con la data que viene del servidor
                    $("#txtProjectName").val(p.ProjectName);
                    $("#txtProjectDesc").val(p.Description);
                    $("#txtStartDate").val(p.StartDateString);
                    $("#txtEndDate").val(p.EndDateString);
                    $("#ddlProjectOwner").val(p.IdUserOwner);
                    $("#ddlProjectStatus").val(p.Status);

                    bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();
                    setTimeout(initTooltips, 500);
                },
                error: function (xhr) {
                    console.error("Error al obtener proyecto:", xhr.responseText);

                }
            });
        }
    });
}

function saveProject() {
    // Validamos que el ID sea un número válido antes de enviarlo
    let idValue = parseInt($("#txtIdProject").val());
    if (isNaN(idValue)) idValue = 0;

    let pObj = {
        IdProject: idValue, // <--- Este es el valor que evita el duplicado
        ProjectName: $("#txtProjectName").val().trim(),
        Description: $("#txtProjectDesc").val().trim(),
        StartDate: $("#txtStartDate").val(),
        EndDate: $("#txtEndDate").val(),
        IdUserOwner: parseInt($("#ddlProjectOwner").val()),
        Status: $("#ddlProjectStatus").val()
    };

    // Validación básica antes de AJAX
    if (pObj.ProjectName === "") {
        alert("El nombre del proyecto es obligatorio");
        return;
    }

    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveProject",
        data: JSON.stringify({ project: pObj }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            // Cerramos el modal usando la instancia de Bootstrap
            let modElement = document.getElementById('projectModal');
            let modalInstance = bootstrap.Modal.getInstance(modElement);
            if (modalInstance) modalInstance.hide();

            loadProjects(); // Recargamos la tabla
            console.log("Proyecto guardado/actualizado con éxito");
        },
        error: function (xhr) {
            console.error("Error al guardar:", xhr.responseText);
            alert("Ocurrió un error al procesar la solicitud.");
        }
    });
}

// --- MÓDULO TAREAS ---

function loadTasks() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetTasksList",
        // projectId null para traer todas, o el valor de un filtro si lo tienes
        data: JSON.stringify({ projectId: null, filter: $("#txtSearchTask").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let html = "";
            r.d.forEach(t => {
                let stateClass = "bg-secondary";
                if (t.Status === "Pendiente") stateClass = "bg-warning text-dark";
                if (t.Status === "En Proceso") stateClass = "bg-info text-white";
                if (t.Status === "Terminada" || t.Status === "Finalizado") stateClass = "bg-success text-white";

                let activeBadge = t.IsActive ? 'bg-success' : 'bg-danger';

                let btnDelete = t.IsActive
                    ? `<button type="button" class="btn btn-sm btn-danger" onclick="deleteTask(${t.IdTask})"><i class="bi bi-trash"></i></button>`
                    : `<button type="button" class="btn btn-sm btn-success" onclick="reactivateTask(${t.IdTask})"><i class="bi bi-check-circle"></i></button>`;

                html += `<tr>
                    <td><strong>${t.Title}</strong></td>
                    <td>${t.ProjectName}</td>
                    <td>${t.AssignedTo}</td>
                    <td>${t.DueDateString}</td>
                    <td><span class="badge ${stateClass} shadow-sm">${t.Status}</span></td>
                    <td><span class="badge ${activeBadge}">${t.IsActive ? 'Sí' : 'No'}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="openTaskModal(${t.IdTask})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${btnDelete}
                    </td></tr>`;
            });
            $("#tblTasks tbody").html(html);
            initTooltips();
        }
    });
}

function openTaskModal(id) {
    // Limpieza total
    $("#taskModal input, #taskModal textarea").val("");
    $("#taskModal select").val(0);
    $("#txtIdTask").val(id);
    $("#divCommentsList").html('<div class="text-center p-3"><span class="spinner-border spinner-border-sm"></span> Cargando...</div>');

    $.when(loadProjectsCombo(), loadOwnersCombo()).done(function () {
        if (id === 0) {
            $("#ddlTaskStatus").val("Pendiente");
            $("#ddlTaskPriority").val("Media");
            $("#divCommentsList").html('<p class="text-muted text-center small py-2">Sin comentarios para tareas nuevas.</p>');
            bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
        } else {
            $.ajax({
                type: "POST",
                url: "Default.aspx/GetTaskById",
                data: JSON.stringify({ id: id }),
                contentType: "application/json; charset=utf-8",
                success: function (r) {
                    let t = r.d;
                    if (t) {
                        $("#ddlTaskProject").val(t.IdProject);
                        $("#txtTaskTitle").val(t.Title);
                        $("#txtTaskDescription").val(t.Description);
                        $("#ddlTaskUser").val(t.IdAssignedUser);
                        $("#txtTaskDueDate").val(t.DueDateString);
                        $("#ddlTaskStatus").val(t.Status);
                        loadComments(id);
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
                        setTimeout(initTooltips, 500);
                    }
                }
            });
        }
    });
}

function saveTask() {
    let idValue = parseInt($("#txtIdTask").val()) || 0;

    let tObj = {
        IdTask: idValue,
        IdProject: parseInt($("#ddlTaskProject").val()),
        Title: $("#txtTaskTitle").val().trim(),
        Description: $("#txtTaskDescription").val() || "",
        IdAssignedUser: parseInt($("#ddlTaskUser").val()),
        Status: $("#ddlTaskStatus").val(),
        Priority: $("#ddlTaskPriority").val() || "Media",
        DueDate: $("#txtTaskDueDate").val()
    };

    if (tObj.IdProject === 0 || tObj.Title === "" || tObj.IdAssignedUser === 0) {
        alert("Por favor selecciona Proyecto, Título y Responsable.");
        return;
    }

    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveTask",
        data: JSON.stringify({ task: tObj }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            // Importante: Si r.d devuelve el ID (int), lo usamos para el comentario
            if (r.d) {
                let commentText = $("#txtNewComment").val().trim();
                let finalId = (idValue === 0 && typeof r.d === 'number') ? r.d : idValue;

                // Si hay comentario escrito, lo guardamos antes de cerrar
                if (commentText !== "" && finalId > 0) {
                    executeSaveComment(finalId, commentText);
                }

                let mod = document.getElementById('taskModal');
                bootstrap.Modal.getInstance(mod).hide();
                loadTasks();
            } else {
                alert("La base de datos rechazó el cambio.");
            }
        }
    });
}

// --- GESTIÓN DE COMENTARIOS ---

function loadComments(idTask) {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetTaskComments",
        data: JSON.stringify({ idTask: idTask }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let h = "";
            r.d.forEach(c => {
                // Usando Author y CommentText según tu entidad C#
                h += `<div class="p-2 border-bottom small">
                        <strong>${c.Author}</strong> <span class="text-muted float-end">${c.DateString}</span><br/>
                        ${c.CommentText}
                      </div>`;
            });
            $("#divCommentsList").html(h || '<p class="text-muted text-center small">Sin comentarios</p>');
        }
    });
}

// Botón del avioncito
function saveComment() {
    let idTask = parseInt($("#txtIdTask").val()) || 0;
    let txt = $("#txtNewComment").val().trim();

    if (idTask === 0) {
        alert("Primero guarda la tarea para poder comentar.");
        return;
    }
    if (txt === "") return;

    executeSaveComment(idTask, txt);
}

// Función común de envío
function executeSaveComment(idTask, text) {
    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveComment",
        data: JSON.stringify({ idTask: idTask, text: text }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            if (r.d) {
                $("#txtNewComment").val("");
                loadComments(idTask); // Refrescar lista si el modal sigue abierto
            } else {
                alert("El servidor rechazó el comentario. Revisa la sesión.");
            }
        }
    });
}

function deleteTask(id) {
    if (confirm("¿Desactivar esta tarea?")) execStatus("DeleteTask", id, loadTasks);
}
function reactivateTask(id) {
    execStatus("ReactivateTask", id, loadTasks);
}


// --- UTILIDADES ---
function loadCatalogs() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetCatalogs",
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            fillSelect("#ddlGender", r.d.Genders);
            fillSelect("#ddlMaritalStatus", r.d.MaritalStatuses);
            fillSelect("#ddlRole", r.d.Roles);
        }
    });
}

function loadProjectsCombo() {
    return $.ajax({
        type: "POST",
        url: "Default.aspx/GetProjectsList",
        data: JSON.stringify({ filter: "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let h = '<option value="0">-- Seleccione Proyecto --</option>';
            r.d.forEach(p => { h += `<option value="${p.IdProject}">${p.ProjectName}</option>`; });
            $("#ddlTaskProject").html(h);
        }
    });
}

function loadOwnersCombo() {
    return $.ajax({
        type: "POST",
        url: "Default.aspx/GetUsersList",
        data: JSON.stringify({ filter: "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let h = '<option value="0">-- Seleccione Usuario --</option>';
            r.d.forEach(u => { h += `<option value="${u.IdUser}">${u.FirstName} ${u.LastName}</option>`; });
            $("#ddlProjectOwner, #ddlTaskUser").html(h);
        }
    });
}

function fillSelect(sel, data) {
    let h = '<option value="0">-- Seleccione --</option>';
    if (data) data.forEach(i => { h += `<option value="${i.Id}">${i.Description}</option>`; });
    $(sel).html(h);
}

function deleteUser(id) { if (confirm("¿Desactivar usuario?")) execStatus("DeleteUser", id, loadUsers); }
function reactivateUser(id) { execStatus("ReactivateUser", id, loadUsers); }

function execStatus(method, id, callback) {
    $.ajax({
        type: "POST",
        url: "Default.aspx/" + method,
        data: JSON.stringify({ id: id }),
        contentType: "application/json; charset=utf-8",
        success: function (r) { if (r.d) callback(); }
    });
}

function performLogin() {
    $.ajax({
        type: "POST",
        url: "Login.aspx/PerformLogin",
        data: JSON.stringify({ username: $("#txtUsername").val(), password: $("#txtPassword").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            if (r.d === "success") window.location.href = "Default.aspx";
            else alert("Acceso denegado");
        }
    });
}

function logout() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/Logout",
        contentType: "application/json; charset=utf-8",
        success: function () {
            window.location.href = "Login.aspx";
        }
    });
}

//Reportes  
function generateReport(module) {
    // Capturamos el filtro actual según donde esté el usuario
    let filterValue = "";
    if (module === 'User') filterValue = $("#txtSearchUser").val();
    if (module === 'Project') filterValue = $("#txtSearchProject").val();
    if (module === 'Task') filterValue = $("#txtSearchTask").val();

    // Enviamos el filtro al WebMethod PrepareReport
    $.ajax({
        type: "POST",
        url: "Default.aspx/PrepareReport",
        data: JSON.stringify({ module: module, filter: filterValue }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            if (r.d === "success") {
                // Si el servidor guardó la sesión con éxito, abrimos el reporte
                window.open("ReportPage.aspx", "_blank");
            }
        },
        error: function (xhr) {
            console.error("Error al preparar reporte:", xhr.responseText);
        }
    });
}