const prisma = require("../config/prisma");

/**
 * TASK ANALYTICS FOR LOGGED-IN USER
 */
exports.getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ Total tasks (excluding deleted)
    const totalTasks = await prisma.task.count({
      where: { userId, isDeleted: false }
    });

    // 2️⃣ Tasks by status
    const statusCounts = await prisma.task.groupBy({
      by: ["status"],
      where: { userId, isDeleted: false },
      _count: { status: true }
    });

    // Convert to readable object
    const statusSummary = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0
    };

    statusCounts.forEach(item => {
      statusSummary[item.status] = item._count.status;
    });

    // 3️⃣ Average completion time (In Progress → Completed)
    const completedTasks = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
        completedAt: { not: null },
        startedAt: { not: null }
      },
      select: {
        startedAt: true,
        completedAt: true
      }
    });

    let avgCompletionTime = null;

    if (completedTasks.length > 0) {
      const totalTimeMs = completedTasks.reduce((sum, task) => {
        return sum + (task.completedAt - task.startedAt);
      }, 0);

      avgCompletionTime = Math.round(
        totalTimeMs / completedTasks.length / 1000 / 60
      ); // minutes
    }

    // 4️⃣ Reopen analytics
    const reopenedTasks = await prisma.task.count({
      where: {
        userId,
        isDeleted: false,
        reopenedAt: { not: null }
      }
    });

    const reopenRate =
      totalTasks > 0
        ? ((reopenedTasks / totalTasks) * 100).toFixed(2)
        : "0.00";

    // 📦 Final response
    res.json({
      totalTasks,
      statusSummary,
      avgCompletionTimeMinutes: avgCompletionTime,
      reopenedTasks,
      reopenRatePercent: reopenRate
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // ----- STATUS DISTRIBUTION -----
    const statusData = await prisma.task.groupBy({
      by: ["status"],
      where: { userId, isDeleted: false },
      _count: { status: true }
    });

    const statusChart = {
      labels: statusData.map(item => item.status),
      data: statusData.map(item => item._count.status)
    };

    // ----- TOTAL TASKS -----
    const totalTasks = await prisma.task.count({
      where: { userId, isDeleted: false }
    });

    // ----- COMPLETION & REOPEN -----
    const completedTasks = await prisma.task.count({
      where: {
        userId,
        isDeleted: false,
        completedAt: { not: null }
      }
    });

    const reopenedTasks = await prisma.task.count({
      where: {
        userId,
        isDeleted: false,
        reopenedAt: { not: null }
      }
    });

    const completionReopenChart = {
      labels: ["Completed", "Reopened"],
      data: [completedTasks, reopenedTasks]
    };

    // ----- AVG COMPLETION TIME -----
    const completedWithTime = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
        startedAt: { not: null },
        completedAt: { not: null }
      },
      select: { startedAt: true, completedAt: true }
    });

    let avgCompletionTimeMinutes = null;

    if (completedWithTime.length > 0) {
      const totalMs = completedWithTime.reduce((sum, t) => {
        return sum + (t.completedAt - t.startedAt);
      }, 0);

      avgCompletionTimeMinutes = Math.round(
        totalMs / completedWithTime.length / 1000 / 60
      );
    }

    // ----- FINAL RESPONSE -----
    res.json({
      cards: {
        totalTasks,
        completedTasks,
        reopenedTasks,
        avgCompletionTimeMinutes
      },
      charts: {
        statusChart,
        completionReopenChart
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};