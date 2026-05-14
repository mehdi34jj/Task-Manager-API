const pool = require('../config/db');

class TaskModel {
  static async create(title, description, completed) {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
      [title, description || null, completed || false]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM tasks");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }

  static async update(id, title, description, completed) {
    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push("title = ?"); values.push(title); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (completed !== undefined) { updates.push("completed = ?"); values.push(completed); }
    
    if (updates.length === 0) return null; // No fields to update
    
    values.push(id);
    const [result] = await pool.query(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`, values);
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    return result;
  }
}

module.exports = TaskModel;
