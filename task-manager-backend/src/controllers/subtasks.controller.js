const axios = require("axios");
const prisma = require("../config/prisma");
const {
  updateParentTaskStatus,
} = require("../utils/taskProgressUpdater");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

/**
 * CREATE SUBTASK
 * Only the task owner can create subtasks.
 */
exports.createSubtask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);
    const { title, description, order } = req.body;

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Subtask title is required",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (Number(task.userId) !== Number(req.userId)) {
      return res.status(403).json({
        message: "Only task owner can create subtasks",
      });
    }

    const subtask = await prisma.subTask.create({
      data: {
        title: title.trim(),
        description: description || null,
        order: order ?? 0,
        taskId,
      },
    });

    await updateParentTaskStatus(taskId);

    return res.status(201).json(subtask);
  } catch (err) {
    console.error("Create subtask error:", err);
    return res.status(500).json({
      message: "Failed to create subtask",
    });
  }
};

/**
 * GET SUBTASKS
 * Accessible to the task owner and collaborators.
 */
exports.getSubtasksByTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { collaborators: true },
    });

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    const currentUserId = Number(req.userId);

    const isOwner = Number(task.userId) === currentUserId;

    const isCollaborator = task.collaborators.some(
      (collaborator) =>
        Number(collaborator.userId) === currentUserId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const subtasks = await prisma.subTask.findMany({
      where: { taskId },
      orderBy: { order: "asc" },
      include: {
        workers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.json(subtasks);
  } catch (err) {
    console.error("Get subtasks error:", err);
    return res.status(500).json({
      message: "Failed to fetch subtasks",
    });
  }
};

/**
 * UPDATE SUBTASK
 * Accessible to the task owner or an assigned worker.
 */
exports.updateSubtask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid subtask ID",
      });
    }

    const subtask = await prisma.subTask.findUnique({
      where: { id },
      include: {
        task: true,
        workers: true,
      },
    });

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found",
      });
    }

    const currentUserId = Number(req.userId);

    const isOwner =
      Number(subtask.task.userId) === currentUserId;

    const isWorker = subtask.workers.some(
      (worker) => Number(worker.userId) === currentUserId
    );

    if (!isOwner && !isWorker) {
      return res.status(403).json({
        message: "Not authorized to update subtask",
      });
    }

    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Subtask title cannot be empty",
        });
      }

      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (status !== undefined) {
      data.status = status;
      data.completedAt =
        status === "Completed" ? new Date() : null;
    }

    const updatedSubtask = await prisma.subTask.update({
      where: { id },
      data,
    });

    await updateParentTaskStatus(subtask.taskId);

    return res.json(updatedSubtask);
  } catch (err) {
    console.error("Update subtask error:", err);
    return res.status(500).json({
      message: "Failed to update subtask",
    });
  }
};

/**
 * ASSIGN USER TO SUBTASK
 * Only the task owner can assign a worker.
 */
exports.assignUserToSubtask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.body.userId);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid subtask ID",
      });
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Valid userId is required",
      });
    }

    const subtask = await prisma.subTask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found",
      });
    }

    if (Number(subtask.task.userId) !== Number(req.userId)) {
      return res.status(403).json({
        message: "Only owner can assign users",
      });
    }

    await prisma.subTaskCollaborator.create({
      data: {
        subTaskId: id,
        userId,
      },
    });

    return res.json({
      message: "User assigned to subtask",
    });
  } catch (err) {
    console.error("Assign subtask worker error:", err);
    return res.status(500).json({
      message: "Failed to assign user",
    });
  }
};

/**
 * DELETE SUBTASK
 * Only the task owner can delete a subtask.
 */
exports.deleteSubtask = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid subtask ID",
      });
    }

    const subtask = await prisma.subTask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found",
      });
    }

    if (Number(subtask.task.userId) !== Number(req.userId)) {
      return res.status(403).json({
        message: "Only owner can delete subtask",
      });
    }

    await prisma.subTask.delete({
      where: { id },
    });

    await updateParentTaskStatus(subtask.taskId);

    return res.json({
      message: "Subtask deleted",
    });
  } catch (err) {
    console.error("Delete subtask error:", err);
    return res.status(500).json({
      message: "Failed to delete subtask",
    });
  }
};

/**
 * SUGGEST SUBTASKS FOR THE NEW-TASK FORM
 *
 * Calls the FastAPI ML service, which uses Phi-3 through Ollama
 * and falls back to the existing template generator if necessary.
 *
 * This endpoint only returns suggestions. It does not save them.
 *
 * POST /api/ai/suggest
 * Body: { "title": "...", "description": "..." }
 */
exports.suggestSubtasks = async (req, res) => {
  try {
    const { title, description } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const taskDescription = [
      title.trim(),
      typeof description === "string" ? description.trim() : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await axios.post(
      `${ML_SERVICE_URL}/generate-subtasks`,
      {
        description: taskDescription,
      },
      {
        timeout: 190000,
      }
    );

    const {
      subtasks,
      source,
      message,
      intent,
      confidence,
    } = response.data || {};

    if (
      !Array.isArray(subtasks) ||
      subtasks.length === 0 ||
      !subtasks.every(
        (item) =>
          typeof item === "string" && item.trim().length > 0
      )
    ) {
      return res.status(502).json({
        message: "The AI service returned invalid subtasks.",
      });
    }

    return res.json({
      subtasks: subtasks.map((item) => item.trim()),
      source: source || "llm",
      message: message || "Subtasks generated successfully.",
      intent,
      confidence,
    });
  } catch (err) {
    console.error(
      "AI suggestion failed:",
      err.response?.data || err.message
    );

    return res.status(503).json({
      message:
        "AI suggestions are temporarily unavailable. Check that the ML service is running.",
    });
  }
};

/**
 * GENERATE AND SAVE SUBTASKS FOR AN EXISTING TASK
 *
 * POST /api/tasks/:taskId/subtasks/generate
 *
 * IMPORTANT: This endpoint replaces all existing subtasks for the task.
 * Existing worker assignments may be removed.
 */
exports.generateSubtasks = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.isDeleted) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (Number(task.userId) !== Number(req.userId)) {
      return res.status(403).json({
        message: "Only the task owner can generate subtasks",
      });
    }

    const description = [task.title, task.description]
      .filter(Boolean)
      .join("\n");

    if (!description.trim()) {
      return res.status(400).json({
        message: "The task needs a title or description",
      });
    }

    let aiResponse;

    try {
      aiResponse = await axios.post(
        `${ML_SERVICE_URL}/generate-subtasks`,
        { description },
        { timeout: 190000 }
      );
    } catch (error) {
      console.error(
        "FastAPI subtask generation failed:",
        error.response?.data || error.message
      );

      return res.status(503).json({
        message: "AI subtask generation is temporarily unavailable.",
      });
    }

    const {
      subtasks,
      source,
      message,
      intent,
      confidence,
    } = aiResponse.data || {};

    if (
      !Array.isArray(subtasks) ||
      subtasks.length === 0 ||
      !subtasks.every(
        (item) =>
          typeof item === "string" && item.trim().length > 0
      )
    ) {
      return res.status(502).json({
        message: "The AI service returned invalid subtasks.",
      });
    }

    // This transaction intentionally replaces existing subtasks.
    const createdSubtasks = await prisma.$transaction(
      async (tx) => {
        await tx.subTask.deleteMany({
          where: { taskId },
        });

        const created = [];

        for (const [index, subtaskTitle] of subtasks.entries()) {
          const subtask = await tx.subTask.create({
            data: {
              title: subtaskTitle.trim(),
              taskId,
              order: index,
            },
          });

          created.push(subtask);
        }

        return created;
      }
    );

    await updateParentTaskStatus(taskId);

    return res.status(200).json({
      message:
        message || "Subtasks generated successfully.",
      source: source || "llm",
      intent,
      confidence,
      subtasks: createdSubtasks,
    });
  } catch (err) {
    console.error("Generate subtasks error:", err);

    return res.status(500).json({
      message: "Failed to generate and save subtasks.",
    });
  }
};