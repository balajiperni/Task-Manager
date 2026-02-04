const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/task.controller");
router.post(
  "/:id/generate-subtasks",
  auth,
  taskController.generateSubtasksForTask
);

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.get("/:id", auth, taskController.getTaskById);

module.exports = router;
