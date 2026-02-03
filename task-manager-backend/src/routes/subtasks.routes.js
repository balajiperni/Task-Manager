const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  deleteSubtask,
  assignUserToSubtask
} = require("../controllers/subtasks.controller");

router.post("/tasks/:taskId/subtasks", auth, createSubtask);
router.get("/tasks/:taskId/subtasks", auth, getSubtasksByTask);
router.put("/subtasks/:id", auth, updateSubtask);
router.post("/subtasks/:id/assign", auth, assignUserToSubtask);
router.delete("/subtasks/:id", auth, deleteSubtask);

module.exports = router;
