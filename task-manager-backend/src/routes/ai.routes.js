const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { generateAndSaveSubtasks, suggestSubtasks } = require("../controllers/ai.controller");

// Suggest subtasks during task creation (no taskId needed)
router.post("/suggest", auth, suggestSubtasks);

// Generate & save subtasks for an existing task
router.post(
  "/tasks/:taskId/generate-subtasks",
  auth,
  generateAndSaveSubtasks
);

module.exports = router;
