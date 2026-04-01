$(document).ready(function () {

    // --- 1. LÓGICA DE INICIO DE SESIÓN ---
    if ($("#btnLogin").length > 0) {
        $("#btnLogin").click(function () {
            performLogin();
        });

        // Permitir dar "Enter" en el teclado para loguearse
        $(document).keypress(function (e) {
            if (e.which == 13) {
                performLogin();
            }
        });
    }

    // --- 2. LÓGICA DE CERRAR SESIÓN ---
    // Esta debe estar afuera, disponible siempre que cargue el documento
    $("#btnLogout").click(function () {
        $.ajax({
            type: "POST",
            url: "Default.aspx/Logout",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                window.location.href = "Login.aspx";
            },
            error: function (xhr) {
                console.error("Error en Logout", xhr);
            }
        });
    });
});

// --- 3. FUNCIÓN DE APOYO PARA LOGIN ---
function performLogin() {
    var username = $("#txtUsername").val();
    var password = $("#txtPassword").val();

    if (username === "" || password === "") {
        $("#errorMessage").text("Please fill all fields").show();
        return;
    }

    var authData = {
        username: username,
        password: password
    };

    $.ajax({
        type: "POST",
        url: "Login.aspx/PerformLogin",
        data: JSON.stringify(authData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d === "success") {
                window.location.href = "Default.aspx";
            } else {
                $("#errorMessage").text("Invalid credentials, try again.").show();
            }
        },
        error: function () {
            $("#errorMessage").text("Connection error with the server.").show();
        }
    });
}