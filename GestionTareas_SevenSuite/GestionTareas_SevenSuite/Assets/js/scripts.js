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
        data: JSON.stringify({ projectId: null, filter: $("#txtSearchTask").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let html = "";
            r.d.forEach(t => {
                let cls = t.Status === "Terminada" ? "bg-success" : (t.Status === "En Proceso" ? "bg-warning text-dark" : "bg-secondary");
                html += `<tr>
                    <td><strong>${t.Title}</strong></td>
                    <td>${t.ProjectName}</td>
                    <td>${t.AssignedTo}</td>
                    <td>${t.DueDateString}</td>
                    <td><span class="badge ${cls}">${t.Status}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="openTaskModal(${t.IdTask})"><i class="bi bi-pencil"></i></button>
                    </td></tr>`;
            });
            $("#tblTasks tbody").html(html);
        }
    });
}

function openTaskModal(id) {
    $("#txtIdTask").val(id);
    $("#taskModal input").val("");
    $("#divCommentsList").empty();

    $.when(loadProjectsCombo(), loadOwnersCombo()).done(function () {
        if (id === 0) {
            $("#ddlTaskStatus").val("Pendiente");
            bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
        } else {
            $.ajax({
                type: "POST",
                url: "Default.aspx/GetTaskById",
                data: JSON.stringify({ id: id }),
                contentType: "application/json; charset=utf-8",
                success: function (r) {
                    let t = r.d;
                    $("#ddlTaskProject").val(t.IdProject);
                    $("#txtTaskTitle").val(t.Title);
                    $("#ddlTaskUser").val(t.IdUserAssigned);
                    $("#txtTaskDueDate").val(t.DueDateString);
                    $("#ddlTaskStatus").val(t.Status);
                    loadComments(id);
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
                }
            });
        }
    });
}

function saveTask() {
    let tObj = {
        IdTask: parseInt($("#txtIdTask").val()) || 0,
        IdProject: parseInt($("#ddlTaskProject").val()),
        Title: $("#txtTaskTitle").val().trim(),
        IdUserAssigned: parseInt($("#ddlTaskUser").val()),
        DueDate: $("#txtTaskDueDate").val(),
        Status: $("#ddlTaskStatus").val()
    };
    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveTask",
        data: JSON.stringify({ task: tObj }),
        contentType: "application/json; charset=utf-8",
        success: function () {
            bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
            loadTasks();
        }
    });
}

function loadComments(idTask) {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetTaskComments",
        data: JSON.stringify({ idTask: idTask }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let h = "";
            r.d.forEach(c => {
                h += `<div class="p-2 border-bottom small">
                        <strong>${c.UserName}</strong> <span class="text-muted float-end">${c.DateString}</span><br/>
                        ${c.Text}
                      </div>`;
            });
            $("#divCommentsList").html(h || '<p class="text-muted text-center small">Sin comentarios</p>');
        }
    });
}

function saveComment() {
    let id = parseInt($("#txtIdTask").val());
    let txt = $("#txtNewComment").val().trim();
    if (!txt) return;
    $.ajax({
        type: "POST",
        url: "Default.aspx/SaveComment",
        data: JSON.stringify({ idTask: id, text: txt }),
        contentType: "application/json; charset=utf-8",
        success: function () {
            $("#txtNewComment").val("");
            loadComments(id);
        }
    });
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
        success: function () { window.location.href = "Login.aspx"; }
    });
}