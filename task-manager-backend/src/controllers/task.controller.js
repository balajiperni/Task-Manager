const { generateSubtasksFromML } = require("../services/ml.service");
const prisma = require("../config/prisma");
const { isValidStatusTransition } = require("../utils/statusflow");
const { logAudit } = require("../utils/auditLogger");

/**
 * CREATE TASK
 * 🔥 EXTENDED: supports collaborators (friends)
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 1️⃣ Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId
      }
    });

    // 2️⃣ Audit log
    await logAudit({
      userId: req.userId,
      taskId: task.id,
      action: "TASK_CREATED"
    });

    // 3️⃣ 🔥 Generate subtasks if description exists
    if (description) {
      const subtasks = await generateSubtasksFromML(description);

      if (subtasks.length > 0) {
        const subtaskData = subtasks.map((title, index) => ({
          title,
          order: index + 1,
          taskId: task.id
        }));

        await prisma.subTask.createMany({
          data: subtaskData
        });
      }
    }

    // 4️⃣ Response
    res.status(201).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET ALL TASKS
 * 🔥 EXTENDED: owner OR collaborator can view
 */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    // Query params (UNCHANGED)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;
    const sort = req.query.sort || "desc";

    const skip = (page - 1) * limit;

    /**
     * 🆕 Base filter: owner OR collaborator
     */
    const filters = {
      isDeleted: false,
      OR: [
        { userId },
        {
          collaborators: {
            some: { userId }
          }
        }
      ]
    };

    // Exact filters (UNCHANGED)
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // Search filter (UNCHANGED)
    if (search) {
      filters.AND = [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        }
      ];
    }

    // Query DB (UNCHANGED STRUCTURE)
    const tasks = await prisma.task.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: sort }
    });

    const totalTasks = await prisma.task.count({ where: filters });

    res.json({
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE TASK
 * 🔒 Owner-only (UNCHANGED)
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dueDate, ...rest } = req.body;

    // 1️⃣ Fetch task (UNCHANGED)
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    // 2️⃣ Ownership + existence check (UNCHANGED)
    if (!task || task.userId !== req.userId || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3️⃣ Validate status workflow (UNCHANGED)
    if (status && !isValidStatusTransition(task.status, status)) {
      return res.status(400).json({
        message: `Invalid status transition: ${task.status} → ${status}`
      });
    }

    // 4️⃣ Handle status timestamps (UNCHANGED)
    const timestampUpdates = {};

    if (task.status === "Pending" && status === "In Progress") {
      timestampUpdates.startedAt = new Date();
    }

    if (task.status === "In Progress" && status === "Completed") {
      timestampUpdates.completedAt = new Date();
    }

    if (task.status === "Completed" && status === "In Progress") {
      timestampUpdates.reopenedAt = new Date();
    }

    // 5️⃣ Update task (UNCHANGED)
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        status: status ?? task.status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        ...timestampUpdates
      }
    });

    // 6️⃣ AUDIT LOG (UNCHANGED – 🔥 EXACT PLACE)
    await logAudit({
      userId: req.userId,
      taskId: task.id,
      action: status
        ? `TASK_STATUS_UPDATED → ${task.status} → ${status}`
        : "TASK_FIELDS_UPDATED"
    });

    // 7️⃣ Response (UNCHANGED)
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE TASK
 * 🔒 Owner-only (UNCHANGED)
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task || task.userId !== req.userId || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    // 🧾 Audit log (UNCHANGED)
    await logAudit({
      userId: req.userId,
      taskId: task.id,
      action: "TASK_SOFT_DELETED"
    });

    res.json({ message: "Task deleted (soft delete)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        isDeleted: false,
        OR: [
          { userId: req.userId }, // owner
          { collaborators: { some: { userId: req.userId } } } // collaborator
        ]
      },
      include: {
        subtasks: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.generateSubtasksForTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    // 1️⃣ Fetch task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        isDeleted: false,
        OR: [
          { userId: req.userId },
          { collaborators: { some: { userId: req.userId } } }
        ]
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.description) {
      return res.status(400).json({ message: "Task has no description" });
    }

    // 2️⃣ Call ML service
    const subtasks = await generateSubtasksFromML(task.description);

    if (subtasks.length === 0) {
      return res.json({ message: "No subtasks generated", subtasks: [] });
    }

    // 3️⃣ Remove old subtasks (optional but recommended)
    await prisma.subTask.deleteMany({
      where: { taskId }
    });

    // 4️⃣ Save new subtasks
    const subtaskData = subtasks.map((title, index) => ({
      title,
      order: index + 1,
      taskId
    }));

    await prisma.subTask.createMany({
      data: subtaskData
    });

    // 5️⃣ Audit log
    await logAudit({
      userId: req.userId,
      taskId,
      action: "SUBTASKS_GENERATED"
    });

    // 6️⃣ Return response
    res.json({
      message: "Subtasks generated successfully",
      subtasks: subtaskData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};