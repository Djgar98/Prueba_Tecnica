/*
 * ==============================================================================
 * STEP 1: DATABASE AND TABLES CREATION
 * ==============================================================================
 */

USE master;
GO

-- Drop database if exists to start fresh
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SevenSuite_TaskDB')
BEGIN
    ALTER DATABASE SevenSuite_TaskDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SevenSuite_TaskDB;
END
GO

CREATE DATABASE SevenSuite_TaskDB;
GO

USE SevenSuite_TaskDB;
GO

-- 1.1 Catalog Tables
CREATE TABLE MaritalStatuses (
    IdMaritalStatus INT PRIMARY KEY IDENTITY(1,1),
    Description VARCHAR(50) NOT NULL
);

CREATE TABLE Genders (
    IdGender INT PRIMARY KEY IDENTITY(1,1),
    Description VARCHAR(20) NOT NULL
);

CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    Description VARCHAR(50) NOT NULL
);

-- 1.2 Main Tables
CREATE TABLE Users (
    IdUser INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    DNI VARCHAR(20) UNIQUE NOT NULL,
    IdGender INT FOREIGN KEY REFERENCES Genders(IdGender),
    BirthDate DATE NOT NULL,
    IdMaritalStatus INT FOREIGN KEY REFERENCES MaritalStatuses(IdMaritalStatus),
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol),
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Projects (
    IdProject INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(150) NOT NULL,
    Description TEXT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

CREATE TABLE Tasks (
    IdTask INT PRIMARY KEY IDENTITY(1,1),
    IdProject INT FOREIGN KEY REFERENCES Projects(IdProject),
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    IdAssignedUser INT FOREIGN KEY REFERENCES Users(IdUser),
    Status VARCHAR(20) DEFAULT 'Pending',
    DueDate DATE,
    IsActive BIT DEFAULT 1
);

CREATE TABLE TaskComments (
    IdComment INT PRIMARY KEY IDENTITY(1,1),
    IdTask INT FOREIGN KEY REFERENCES Tasks(IdTask),
    IdUser INT FOREIGN KEY REFERENCES Users(IdUser),
    CommentText TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 1.3 Seed Data
INSERT INTO MaritalStatuses (Description) VALUES ('Soltero'), ('Casado'), ('Divorciado'), ('Viudo');
INSERT INTO Genders (Description) VALUES ('Masculino'), ('Femenino'), ('Otro');
INSERT INTO Roles (Description) VALUES ('Administrador'), ('Desarrollador'), ('Tester');

INSERT INTO Users (FirstName, LastName, DNI, IdGender, BirthDate, IdMaritalStatus, IdRol, Username, Password)
VALUES ('Admin', 'User', '000-000000-0000U', 1, '1990-01-01', 1, 1, 'admin', '12345');

GO

