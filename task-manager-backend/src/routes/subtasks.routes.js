// routes/subtaskRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  deleteSubtask,
  assignUserToSubtask,
  generateSubtasks,
  suggestSubtasks,
} = require("../controllers/subtasks.controller");

// Existing subtask operations
router.post("/tasks/:taskId/subtasks", auth, createSubtask);
router.get("/tasks/:taskId/subtasks", auth, getSubtasksByTask);
router.put("/subtasks/:id", auth, updateSubtask);
router.post("/subtasks/:id/assign", auth, assignUserToSubtask);
router.delete("/subtasks/:id", auth, deleteSubtask);

// Generate suggestions for the new-task form without saving them
router.post("/ai/suggest", auth, suggestSubtasks);

// Generate and save subtasks for an existing task
router.post("/tasks/:taskId/subtasks/generate", auth, generateSubtasks);

module.exports = router;