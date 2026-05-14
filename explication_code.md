# Task Manager API - Complete Code Explanation

This document explains both the **purpose** of each file and the **actual code** inside it. Your project uses the **MVC (Model-View-Controller)** architecture.

---

## 1. The Entry Point: `app.js`
This is the heart of your application. It starts the server and links all the pieces together.

```javascript
require("dotenv").config(); // Loads secret variables from .env
const express = require("express"); // The web framework
const cors = require("cors"); // Allows external websites to use this API
const morgan = require("morgan"); // Logs requests in the terminal (e.g. "GET /tasks 200")

const taskRoutes = require("./routes/tasks"); // Import our task routes

const app = express(); // Create the express application

app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json()); // Tells the API to understand JSON data in requests

app.get("/", (req, res) => res.send("API Running ")); // Simple test route

// Every request starting with '/tasks' will be handled by taskRoutes
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // Start listening for traffic on port 3000
  console.log("Server started");
});
```

---

## 2. The Database Connection: `config/db.js`
This file creates a connection to your MySQL database so the rest of the app can talk to it.

```javascript
const mysql = require("mysql2/promise"); // MySQL library with modern 'promises' (async/await)
require("dotenv").config(); // Loads your .env variables

// createPool is better than createConnection because it handles multiple users simultaneously
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // e.g., 'localhost'
  user: process.env.DB_USER,         // e.g., 'root'
  password: process.env.DB_PASSWORD, // your mysql password
  database: process.env.DB_NAME      // 'taskmanager'
});

module.exports = pool; // Export the pool so the Models can use it
```

---

## 3. The Model: `models/taskModel.js`
The Model only cares about writing and reading from the database using SQL. It doesn't know anything about HTTP requests or responses.

```javascript
const pool = require('../config/db'); // Get the database connection pool

class TaskModel {
  
  // Creates a new task in the database
  static async create(title, description, completed) {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
      [title, description || null, completed || false] // ? prevents SQL Injection attacks
    );
    return result; // Returns info like the new ID (insertId)
  }

  // Gets every task from the database
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM tasks");
    return rows; // Returns an array of tasks
  }

  // Gets a single task by its ID
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    return rows.length ? rows[0] : null; // Return the first task, or null if empty
  }

  // Updates an existing task dynamically
  static async update(id, title, description, completed) {
    const updates = []; // Stores the pieces of the SQL query ("title = ?", etc.)
    const values = [];  // Stores the actual values to replace the '?'

    if (title !== undefined) { updates.push("title = ?"); values.push(title); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (completed !== undefined) { updates.push("completed = ?"); values.push(completed); }
    
    if (updates.length === 0) return null; // If user sent nothing to update, abort
    
    values.push(id); // Add the ID at the end for the 'WHERE id = ?'
    
    // Example output: "UPDATE tasks SET title = ?, completed = ? WHERE id = ?"
    const [result] = await pool.query(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`, values);
    return result;
  }

  // Deletes a task by ID
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    return result;
  }
}

module.exports = TaskModel;
```

---

## 4. The Controller: `controllers/tasksController.js`
The Controller handles the business logic. It reads what the user wants (`req.body`), asks the Model (`TaskModel`) to do the database work, and sends an HTTP response (`res.json`) back to the user.

```javascript
const TaskModel = require('../models/taskModel'); // Import the Model

exports.createTask = async (req, res) => {
  try {
    // 1. Get the data the user sent
    const { title, description, completed } = req.body;
    
    // 2. Validate input
    if (!title) {
      return res.status(400).json({ error: "Title is required" }); // 400 Bad Request
    }
    
    // 3. Ask Model to save to database
    const result = await TaskModel.create(title, description, completed);
    
    // 4. Send success response with the new Task ID
    res.status(201).json({ id: result.insertId, title, description, completed: completed || false });
  } catch (error) {
    // If the database crashes, return a 500 Server Error
    res.status(500).json({ error: error.message });
  }
};

// Other functions (getAllTasks, getTaskById, updateTask, deleteTask) follow the same pattern:
// 1. Read request (req.params.id or req.body)
// 2. Call the Model
// 3. Return a JSON response
```

---

## 5. The Routes: `routes/tasks.js`
This file acts as a traffic cop. It points incoming URLs (like `POST /tasks`) to the correct Controller function.

```javascript
const express = require("express");
const router = express.Router();

// Import all the logic from the Controller
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

// When someone visits '/', call getAllTasks
router.get("/", getAllTasks);

// When someone visits '/1' (where 1 is an ID), call getTaskById
router.get("/:id", getTaskById);

// When someone sends new data to '/', call createTask
router.post("/", createTask);

// When someone updates data at '/1', call updateTask
router.patch("/:id", updateTask);

// When someone deletes data at '/1', call deleteTask
router.delete("/:id", deleteTask);

module.exports = router; // Export this so app.js can use it
```
