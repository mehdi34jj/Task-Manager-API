const mysql = require("mysql2/promise");
require("dotenv").config();

async function setup() {
  try {
    // Connect without specifying a database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to MySQL server.");

    // Create database and select it
    await connection.query("CREATE DATABASE IF NOT EXISTS taskmanager");
    console.log("Database 'taskmanager' created or already exists.");
    
    await connection.changeUser({ database: "taskmanager" });
    
    // Create the table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS task(
        id INT auto_increment primary Key,
        title varchar(225) NOT NULL,
        description text,
        complete boolean default false
      );
    `;
    await connection.query(createTableQuery);
    console.log("Table 'task' created or already exists.");
    
    console.log("Setup complete! You can now run your API.");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setup();
