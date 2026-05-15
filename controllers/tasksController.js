const TaskModel = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const result = await TaskModel.create(title, description, status);
    res.status(201).json({ id: result.insertId, title, description, complete: status || false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const rows = await TaskModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.getById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const result = await TaskModel.update(req.params.id, title, description, status);
    
    if (!result) return res.status(400).json({ error: "No fields to update" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await TaskModel.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
