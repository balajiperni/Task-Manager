const prisma = require("../config/prisma");

exports.logAudit = async ({ userId, taskId, action }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        taskId,
        action
      }
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
