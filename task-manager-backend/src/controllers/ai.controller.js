const prisma = require("../config/prisma");
const { generateSubtasks } = require("../services/ai.service");

exports.generateAndSaveSubtasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description required" });
    }

    // 1️⃣ Verify task ownership
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) }
    });

    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2️⃣ Call FastAPI
    const result = await generateSubtasks(description);

    // 3️⃣ Prepare subtasks
    const subtaskData = result.subtasks.map((title, index) => ({
      title,
      order: index + 1,
      taskId: task.id
    }));

    // 4️⃣ Save in DB
    await prisma.subTask.createMany({
      data: subtaskData
    });

    // 5️⃣ Fetch updated task
    const updatedTask = await prisma.task.findUnique({
      where: { id: task.id },
      include: { subtasks: true }
    });

    res.json({
      success: true,
      message: "Subtasks generated & saved",
      task: updatedTask
    });

  } catch (err) {
    console.error("AI SUBTASK ERROR:", err);
    res.status(500).json({ message: "Failed to save subtasks" });
  }
};
