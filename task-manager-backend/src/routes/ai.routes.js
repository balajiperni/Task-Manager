const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { generateAndSaveSubtasks } = require("../controllers/ai.controller");

router.post(
  "/tasks/:taskId/generate-subtasks",
  auth,
  generateAndSaveSubtasks
);

module.exports = router;
