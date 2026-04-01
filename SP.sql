/*
 * ==============================================================================
 * STORED PROCEDURES 
 * ==============================================================================
 */

-- AUTHENTICATION
CREATE PROCEDURE sp_AuthenticateUser
    @Username VARCHAR(50),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT IdUser, FirstName, LastName, IdRol FROM Users 
    WHERE Username = @Username AND Password = @Password AND IsActive = 1;
END;
GO

-- USER CRUD
CREATE PROCEDURE sp_GetUsers
    @Filter VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT U.*, G.Description as GenderDesc, MS.Description as MaritalDesc, R.Description as RoleDesc
    FROM Users U
    JOIN Genders G ON U.IdGender = G.IdGender
    JOIN MaritalStatuses MS ON U.IdMaritalStatus = MS.IdMaritalStatus
    JOIN Roles R ON U.IdRol = R.IdRol
    WHERE (@Filter IS NULL OR U.FirstName LIKE @Filter + '%' OR U.DNI LIKE @Filter + '%')
    AND U.IsActive = 1;
END;
GO

CREATE PROCEDURE sp_GetUserById @Id INT AS BEGIN SELECT * FROM Users WHERE IdUser = @Id END;
GO

CREATE PROCEDURE sp_UpsertUser
    @IdUser INT = 0, @FirstName VARCHAR(100), @LastName VARCHAR(100), @DNI VARCHAR(20),
    @IdGender INT, @BirthDate DATE, @IdMaritalStatus INT, @IdRol INT,
    @Username VARCHAR(50), @Password VARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE IdUser = @IdUser)
        UPDATE Users SET FirstName=@FirstName, LastName=@LastName, DNI=@DNI, IdGender=@IdGender, 
        BirthDate=@BirthDate, IdMaritalStatus=@IdMaritalStatus, IdRol=@IdRol, Username=@Username, Password=@Password
        WHERE IdUser = @IdUser;
    ELSE
        INSERT INTO Users (FirstName, LastName, DNI, IdGender, BirthDate, IdMaritalStatus, IdRol, Username, Password)
        VALUES (@FirstName, @LastName, @DNI, @IdGender, @BirthDate, @IdMaritalStatus, @IdRol, @Username, @Password);
END;
GO

-- PROJECT CRUD
CREATE PROCEDURE sp_GetProjects @Filter VARCHAR(100) = NULL
AS
BEGIN
    SELECT * FROM Projects WHERE (@Filter IS NULL OR Name LIKE @Filter + '%') AND IsActive = 1;
END;
GO

CREATE PROCEDURE sp_GetProjectById @Id INT AS BEGIN SELECT * FROM Projects WHERE IdProject = @Id END;
GO

CREATE PROCEDURE sp_UpsertProject @IdProject INT = 0, @Name VARCHAR(150), @Description TEXT
AS
BEGIN
    IF @IdProject > 0
        UPDATE Projects SET Name=@Name, Description=@Description WHERE IdProject=@IdProject;
    ELSE
        INSERT INTO Projects (Name, Description) VALUES (@Name, @Description);
END;
GO

-- TASK CRUD & REPORTING
CREATE PROCEDURE sp_GetTasks @ProjectId INT = NULL, @Filter VARCHAR(100) = NULL
AS
BEGIN
    SELECT T.*, P.Name as ProjectName, U.FirstName + ' ' + U.LastName as AssignedTo
    FROM Tasks T
    JOIN Projects P ON T.IdProject = P.IdProject
    JOIN Users U ON T.IdAssignedUser = U.IdUser
    WHERE (@ProjectId IS NULL OR T.IdProject = @ProjectId)
    AND (@Filter IS NULL OR T.Title LIKE @Filter + '%')
    AND T.IsActive = 1;
END;
GO

CREATE PROCEDURE sp_GetTaskById @Id INT AS BEGIN SELECT * FROM Tasks WHERE IdTask = @Id END;
GO

CREATE PROCEDURE sp_UpsertTask @IdTask INT = 0, @IdProject INT, @Title VARCHAR(150), @Description TEXT,
    @IdAssignedUser INT, @Status VARCHAR(20), @DueDate DATE
AS
BEGIN
    IF @IdTask > 0
        UPDATE Tasks SET IdProject=@IdProject, Title=@Title, Description=@Description, 
        IdAssignedUser=@IdAssignedUser, Status=@Status, DueDate=@DueDate WHERE IdTask=@IdTask;
    ELSE
        INSERT INTO Tasks (IdProject, Title, Description, IdAssignedUser, Status, DueDate)
        VALUES (@IdProject, @Title, @Description, @IdAssignedUser, @Status, @DueDate);
END;
GO

-- COMMENTS
CREATE PROCEDURE sp_AddTaskComment @IdTask INT, @IdUser INT, @CommentText TEXT
AS
BEGIN
    INSERT INTO TaskComments (IdTask, IdUser, CommentText) VALUES (@IdTask, @IdUser, @CommentText);
END;
GO

CREATE PROCEDURE sp_GetCommentsByTask @IdTask INT
AS
BEGIN
    SELECT C.*, U.FirstName + ' ' + U.LastName as Author 
    FROM TaskComments C JOIN Users U ON C.IdUser = U.IdUser 
    WHERE C.IdTask = @IdTask ORDER BY C.CreatedAt DESC;
END;
GO

-- DELETE PROCEDURES (Logical Delete)
CREATE PROCEDURE sp_DeleteUser @Id INT AS BEGIN UPDATE Users SET IsActive = 0 WHERE IdUser = @Id END;
GO
CREATE PROCEDURE sp_DeleteProject @Id INT AS BEGIN UPDATE Projects SET IsActive = 0 WHERE IdProject = @Id END;
GO
CREATE PROCEDURE sp_DeleteTask @Id INT AS BEGIN UPDATE Tasks SET IsActive = 0 WHERE IdTask = @Id END;
GO

-- CATALOGS FOR UI
CREATE PROCEDURE sp_GetFormCatalogs
AS
BEGIN
    SELECT IdGender as Id, Description FROM Genders;
    SELECT IdMaritalStatus as Id, Description FROM MaritalStatuses;
    SELECT IdRol as Id, Description FROM Roles;
    SELECT IdUser as Id, FirstName + ' ' + LastName as Description FROM Users WHERE IsActive = 1;
    SELECT IdProject as Id, Name as Description FROM Projects WHERE IsActive = 1;
END;
GO