<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="GestionTareas_SevenSuite.Login" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>Seven Suite - Access</title>
    <link href="Assets/css/styles.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="login-card">
        <h2>Seven Suite</h2>
        <div id="errorMessage" style="display:none;"></div>
        
        <div class="form-group">
            <label>Username</label>
            <input type="text" id="txtUsername" placeholder="Enter your username" autocomplete="off" />
        </div>
        
        <div class="form-group">
            <label>Password</label>
            <input type="password" id="txtPassword" placeholder="••••••••" />
        </div>
        
        <button type="button" id="btnLogin" class="btn-primary">Sign In</button>
    </div>

    <script src="Assets/js/scripts.js"></script>
</body>
</html>