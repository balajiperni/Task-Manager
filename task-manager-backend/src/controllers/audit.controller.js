const prisma = require("../config/prisma");

/**
 * GET AUDIT LOGS (for logged-in user)
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const userId = req.userId;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const action = req.query.action;

    const skip = (page - 1) * limit;

    // Filters
    const filters = {
      userId
    };

    if (action) {
      filters.action = action;
    }

    const logs = await prisma.auditLog.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    });

    const totalLogs = await prisma.auditLog.count({
      where: filters
    });

    res.json({
      page,
      limit,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
