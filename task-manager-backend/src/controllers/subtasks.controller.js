const prisma = require("../config/prisma");

/**
 * CREATE SUBTASK (Task owner only)
 */
exports.createSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Subtask title is required" });
    }

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) }
    });

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Only task owner can create subtasks" });
    }

    const subtask = await prisma.subTask.create({
      data: {
        title,
        description,
        order: order ?? 0,
        taskId: Number(taskId)
      }
    });

    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET SUBTASKS (Owner + collaborators)
 */
exports.getSubtasksByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: {
        collaborators: true
      }
    });

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.userId === req.userId;
    const isCollaborator = task.collaborators.some(
      (c) => c.userId === req.userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const subtasks = await prisma.subTask.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { order: "asc" },
      include: {
        workers: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE SUBTASK (Owner + assigned worker)
 */
exports.updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const subtask = await prisma.subTask.findUnique({
      where: { id: Number(id) },
      include: {
        task: true,
        workers: true
      }
    });

    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    const isOwner = subtask.task.userId === req.userId;
    const isWorker = subtask.workers.some(
      (w) => w.userId === req.userId
    );

    if (!isOwner && !isWorker) {
      return res.status(403).json({ message: "Not authorized to update subtask" });
    }

    const updatedSubtask = await prisma.subTask.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        completedAt: status === "Completed" ? new Date() : null
      }
    });

    res.json(updatedSubtask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ASSIGN USER TO SUBTASK
 */
exports.assignUserToSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const subtask = await prisma.subTask.findUnique({
      where: { id: Number(id) },
      include: { task: true }
    });

    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    if (subtask.task.userId !== req.userId) {
      return res.status(403).json({ message: "Only owner can assign users" });
    }

    await prisma.subTaskCollaborator.create({
      data: {
        subTaskId: Number(id),
        userId
      }
    });

    res.json({ message: "User assigned to subtask" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE SUBTASK (Owner only)
 */
exports.deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await prisma.subTask.findUnique({
      where: { id: Number(id) },
      include: { task: true }
    });

    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    if (subtask.task.userId !== req.userId) {
      return res.status(403).json({ message: "Only owner can delete subtask" });
    }

    await prisma.subTask.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Subtask deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
