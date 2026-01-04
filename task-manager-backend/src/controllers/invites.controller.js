const prisma = require("../config/prisma");

// 1️⃣ GET MY INVITE INBOX
exports.getMyInvites = async (req, res) => {
  try {
    const userId = req.userId;

    // Get logged-in user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const invites = await prisma.invite.findMany({
      where: {
        email: user.email,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      invites: invites.map((inv) => ({
        id: inv.id,
        from: inv.sender,
        sentAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch invites" });
  }
};

// 2️⃣ ACCEPT INVITE FROM INBOX
exports.acceptInviteFromInbox = async (req, res) => {
  try {
    const userId = req.userId;
    const inviteId = parseInt(req.params.inviteId);

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.status !== "PENDING" || invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired or already handled" });
    }

    // Get logged-in user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (invite.email !== user.email) {
      return res.status(403).json({ message: "Not authorized for this invite" });
    }

    // Create mutual friendship
    await prisma.friend.createMany({
      data: [
        { userId: invite.senderId, friendId: userId, status: "ACCEPTED" },
        { userId: userId, friendId: invite.senderId, status: "ACCEPTED" },
      ],
      skipDuplicates: true,
    });

    // Update invite status
    await prisma.invite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" },
    });

    res.json({ message: "Invitation accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to accept invite" });
  }
};

// 3️⃣ REJECT INVITE
exports.rejectInvite = async (req, res) => {
  try {
    const userId = req.userId;
    const inviteId = parseInt(req.params.inviteId);

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (invite.email !== user.email) {
      return res.status(403).json({ message: "Not authorized for this invite" });
    }

    await prisma.invite.update({
      where: { id: inviteId },
      data: { status: "EXPIRED" },
    });

    res.json({ message: "Invitation rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject invite" });
  }
};