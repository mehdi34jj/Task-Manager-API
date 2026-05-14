const db = require("../db");

// GET all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one task
exports.getOneTask = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create task
exports.createTask = async (req, res) => {
  const { title, description, done } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, done) VALUES (?, ?, ?)",
      [title, description || null, done || false]
    );
    res.status(201).json({ id: result.insertId, title, description, done });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH update task
exports.updateTask = async (req, res) => {
  const { title, description, done } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), done = COALESCE(?, done) WHERE id = ?",
      [title, description, done, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};