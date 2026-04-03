$(document).ready(function () {
    // --- 1. DETECCIÓN DE PÁGINA ---
    // Esto evita que el código del Dashboard choque con el del Login
    var isDashboardPage = $(".navbar").length > 0 || $("#btnLogout").length > 0;
    var isLoginPage = $("#btnLogin").length > 0;

    // --- 2. LÓGICA DE INICIO DE SESIÓN ---
    if (isLoginPage) {
        $("#btnLogin").click(function () {
            performLogin();
        });

        // Permitir dar "Enter" para loguearse
        $(document).on("keypress", function (e) {
            if (e.which == 13) {
                performLogin();
            }
        });
    }

    // --- 3. LÓGICA DE DASHBOARD ---
    if (isDashboardPage) {
        loadCatalogs();
        loadUsers();
        loadProjects();
        loadTasks();

        // Inicializar calendarios de jQuery UI
        $("#txtBirthDate, #txtStartDate, #txtEndDate, #txtTaskDueDate").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });

        // Evento para el botón de cerrar sesión
        $("#btnLogout").click(function () {
            logout();
        });
    }
});

// --- FUNCIONES DE NAVEGACIÓN ---
function showSection(sectionName) {
    $(".section-content").hide();
    $(".nav-link").removeClass("active");
    $("#sec-" + sectionName).fadeIn();
    if (event && event.currentTarget) $(event.currentTarget).addClass("active");

    // Recargar datos al cambiar de sección
    if (sectionName === 'users') loadUsers();
    if (sectionName === 'projects') loadProjects();
    if (sectionName === 'tasks') loadTasks();
}

// --- FUNCIONALIDAD DE LOGIN ---
function performLogin() {
    var username = $("#txtUsername").val().trim();
    var password = $("#txtPassword").val().trim();

    if (username === "" || password === "") {
        $("#errorMessage").text("Por favor, complete todos los campos.").show();
        return;
    }

    $.ajax({
        type: "POST",
        url: "Login.aspx/PerformLogin",
        data: JSON.stringify({ username: username, password: password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d === "success") {
                window.location.href = "Default.aspx";
            } else {
                $("#errorMessage").text("Credenciales inválidas, intente de nuevo.").show();
            }
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            $("#errorMessage").text("Error de conexión con el servidor.").show();
        }
    });
}

// --- GESTIÓN DE USUARIOS (CRUD Y ESTADOS) ---
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

                // Botón dinámico: si está activo muestra "Basurero", si no muestra "Check"
                let btnEstado = u.IsActive
                    ? `<button type="button" class="btn btn-sm btn-danger" onclick="deleteUser(${u.IdUser})" title="Desactivar"><i class="bi bi-trash"></i></button>`
                    : `<button type="button" class="btn btn-sm btn-success" onclick="reactivateUser(${u.IdUser})" title="Reactivar"><i class="bi bi-check-circle"></i></button>`;

                html += `<tr>
                    <td>${u.DNI}</td>
                    <td class="fw-bold">${u.FirstName} ${u.LastName}</td>
                    <td>${u.GenderDesc}</td>
                    <td><span class="badge ${badge}">${txtActivo}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="editUser(${u.IdUser})"><i class="bi bi-pencil"></i></button>
                        ${btnEstado}
                    </td></tr>`;
            });
            $("#tblUsers tbody").html(html);
        }
    });
}

function deleteUser(id) {
    if (confirm("¿Estás seguro de que deseas desactivar este usuario?")) {
        execStatus("DeleteUser", id, false, loadUsers);
    }
}

function reactivateUser(id) {
    execStatus("ReactivateUser", id, true, loadUsers);
}

// --- GESTIÓN DE PROYECTOS ---
function loadProjects() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetProjectsList",
        data: JSON.stringify({ filter: $("#txtSearchProject").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            let html = "";
            r.d.forEach(p => {
                let badge = p.IsActive ? 'bg-success' : 'bg-secondary';
                html += `<tr>
                    <td><strong>${p.ProjectName}</strong></td>
                    <td>${p.OwnerName}</td>
                    <td>${p.StartDateString}</td>
                    <td><span class="badge ${badge}">${p.IsActive ? 'Activo' : 'Inactivo'}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-warning" onclick="editProject(${p.IdProject})"><i class="bi bi-pencil"></i></button>
                    </td></tr>`;
            });
            $("#tblProjects tbody").html(html);
        }
    });
}

// --- FUNCIÓN GENÉRICA PARA CAMBIO DE ESTADO (BORRADO LÓGICO) ---
function execStatus(method, id, status, callback) {
    $.ajax({
        type: "POST",
        url: "Default.aspx/" + method,
        data: JSON.stringify({ id: id, active: status }),
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            if (r.d) {
                callback();
            } else {
                alert("No se pudo actualizar el estado en el servidor.");
            }
        },
        error: function (xhr) {
            console.error("Error en " + method, xhr.responseText);
        }
    });
}

// --- UTILIDADES (CATÁLOGOS Y LOGOUT) ---
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

function fillSelect(sel, data) {
    let h = '<option value="0">-- Seleccione --</option>';
    if (data) data.forEach(i => { h += `<option value="${i.Id}">${i.Description}</option>`; });
    $(sel).html(h);
}

function logout() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/Logout",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            window.location.href = "Login.aspx";
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
                    <td><span class="badge ${cls}">${t.Status}</span></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-warning" onclick="editTask(${t.IdTask})"><i class="bi bi-pencil"></i></button>
                    </td></tr>`;
            });
            $("#tblTasks tbody").html(html);
        }
    });
}