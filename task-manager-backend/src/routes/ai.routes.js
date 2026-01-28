const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  generateAndSaveSubtasks
} = require("../controllers/ai.controller");

router.post(
  "/generate-and-save-subtasks",
  auth,
  generateAndSaveSubtasks
);

module.exports = router;
