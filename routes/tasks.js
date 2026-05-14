const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getOneTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/:id", getOneTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;