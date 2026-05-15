const pool = require('../config/db');

class TaskModel {
  static async create(title, description, status) {
    const [result] = await pool.query(
      "INSERT INTO task (title, description, complete) VALUES (?, ?, ?)",
      [title, description || null, status || false]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM task");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }

  static async update(id, title, description, status) {
    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push("title = ?"); values.push(title); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (status !== undefined) { updates.push("complete = ?"); values.push(status); }
    
    if (updates.length === 0) return null; // No fields to update
    
    values.push(id);
    const [result] = await pool.query(`UPDATE task SET ${updates.join(", ")} WHERE id = ?`, values);
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query("DELETE FROM task WHERE id = ?", [id]);
    return result;
  }
}

module.exports = TaskModel;
