const prisma = require("../config/prisma");
const { isValidStatusTransition } = require("../utils/statusflow");
const { logAudit } = require("../utils/auditLogger");
/**
 * CREATE TASK
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // 1️⃣ Validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 2️⃣ Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId
      }
    });

    // 3️⃣ AUDIT LOG (🔥 EXACT PLACE)
    await logAudit({
      userId: req.userId,
      taskId: task.id,
      action: "TASK_CREATED"
    });

    // 4️⃣ Response
    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * GET ALL TASKS (for logged-in user)
 */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;
    const sort = req.query.sort || "desc";

    const skip = (page - 1) * limit;

    // Base filter
    const filters = {
     userId,
     isDeleted: false
    };


    // Exact filters
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // Search filter
    if (search) {
      filters.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    // Query DB
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
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dueDate, ...rest } = req.body;

    // 1️⃣ Fetch task
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    // 2️⃣ Ownership + existence check
    if (!task || task.userId !== req.userId || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3️⃣ Validate status workflow
    if (status && !isValidStatusTransition(task.status, status)) {
      return res.status(400).json({
        message: `Invalid status transition: ${task.status} → ${status}`
      });
    }

    // 4️⃣ Handle status timestamps
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

    // 5️⃣ Update task
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        status: status ?? task.status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        ...timestampUpdates
      }
    });

    // 6️⃣ AUDIT LOG (🔥 THIS IS WHERE IT GOES)
    await logAudit({
      userId: req.userId,
      taskId: task.id,
      action: status
        ? `TASK_STATUS_UPDATED → ${task.status} → ${status}`
        : "TASK_FIELDS_UPDATED"
    });

    // 7️⃣ Response
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * DELETE TASK
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

    // 🧾 Audit log
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