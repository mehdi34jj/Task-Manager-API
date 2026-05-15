const db = require("../db");
const { z } = require("zod");
const pool = require("../config/db");

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

exports.createTask = async (req, res) => {

  try {

    const validatedData = taskSchema.parse(req.body);

    const { title, description } = validatedData;

    await pool.query(
      `
      INSERT INTO tasks (title, description, completed)
      VALUES (?, ?, ?)
      `,
      [title, description, false]
    );

    res.json({
      message: "Task created"
    });

  } catch (error) {

    res.status(400).json({
      error: error.errors || error.message
    });

  }

};


exports.getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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


exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
      [title, description || null, completed || false]
    );
    res.status(201).json({ id: result.insertId, title, description, completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), completed = COALESCE(?, completed) WHERE id = ?",
      [title, description, completed, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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