-- Create a new database called "School" this database should have two tables: teachers and students.

-- The teachers table should have columns for teacher_id, first_name, last_name
-- The students table should have columns for student_id, first_name,last_name, homeroom_number, phone,email, and graduation year.

CREATE DATABASE 'school';

CREATE TABLE teachers(
    teacher_id serial PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,    
    homeroom_number INTEGER,
    department VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(12) UNIQUE
);

CREATE TABLE students(
    student_id serial PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    homeroom_number INTEGER,
    phone VARCHAR(12) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    graduation_year INTEGER
);

INSERT INTO students(first_name, last_name, homeroom_number, phone, graduation_year)
VALUES ('Mark', 'Watney', 5, '777-555-1234', 2035);

INSERT INTO teachers(first_name, last_name, homeroom_number, department, phone, email)
VALUES ('Jonas', 'Salk', 5, 'Biology department', '777-555-4321', 'jsalk@school.org');