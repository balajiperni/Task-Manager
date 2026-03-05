const prisma = require("../config/prisma");

/**
 * Recalculates and updates the parent task's status and progress
 * based on the completion ratio of its subtasks.
 *
 * Logic:
 *  - 0 subtasks completed  → Pending
 *  - Some completed        → In Progress
 *  - All completed         → Completed
 */
async function updateParentTaskStatus(taskId) {
    const subtasks = await prisma.subTask.findMany({
        where: { taskId },
    });

    if (!subtasks || subtasks.length === 0) return;

    const total = subtasks.length;
    const completed = subtasks.filter((s) => s.status === "Completed").length;

    let newStatus;
    if (completed === 0) {
        newStatus = "Pending";
    } else if (completed === total) {
        newStatus = "Completed";
    } else {
        newStatus = "In Progress";
    }

    await prisma.task.update({
        where: { id: taskId },
        data: {
            status: newStatus,
            completedAt: newStatus === "Completed" ? new Date() : null,
            startedAt:
                newStatus === "In Progress"
                    ? (await prisma.task.findUnique({ where: { id: taskId }, select: { startedAt: true } }))?.startedAt ?? new Date()
                    : undefined,
        },
    });
}

module.exports = { updateParentTaskStatus };
