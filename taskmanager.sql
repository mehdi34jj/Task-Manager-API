-- Delete old database if it exists
DROP DATABASE IF EXISTS taskmanager;

-- Create database
CREATE DATABASE taskmanager;

-- Use database
USE taskmanager;

-- Create tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false
);

-- Insert sample tasks
INSERT INTO tasks (title, description, completed)
VALUES
(
    "Learn Express",
    "Build first REST API with Node.js",
    false
),
(
    "Connect MySQL",
    "Practice database connection",
    false
),
(
    "Test PATCH Route",
    "Update this task using Postman",
    false
);

-- Show all tasks
SELECT * FROM tasks;