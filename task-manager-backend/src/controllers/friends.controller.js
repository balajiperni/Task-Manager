const crypto = require("crypto");
const prisma = require("../config/prisma");

// 1️⃣ INVITE FRIEND
exports.inviteFriend = async (req, res) => {
  try {
    const { email } = req.body;
    const senderId = req.userId;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity

    await prisma.invite.create({
      data: {
        email,
        token,
        senderId,
        expiresAt,
      },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

    // (Email sending can be added later)
    return res.status(201).json({
      message: "Invite created successfully",
      inviteLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to invite friend" });
  }
};

// 2️⃣ ACCEPT INVITE
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const receiverId = req.userId;

    const invite = await prisma.invite.findUnique({ where: { token } });

    if (!invite) {
      return res.status(404).json({ message: "Invalid invite token" });
    }

    if (invite.status !== "PENDING" || invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired or already used" });
    }

    // Create mutual friendship
    await prisma.friend.createMany({
      data: [
        { userId: invite.senderId, friendId: receiverId, status: "ACCEPTED" },
        { userId: receiverId, friendId: invite.senderId, status: "ACCEPTED" },
      ],
      skipDuplicates: true,
    });

    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    res.json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to accept invite" });
  }
};

// 3️⃣ GET FRIENDS LIST
exports.getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const friends = await prisma.friend.findMany({
      where: {
        userId,
        status: "ACCEPTED",
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      friends: friends.map((f) => ({
        id: f.friend.id,
        name: f.friend.name,
        email: f.friend.email,
        connectedAt: f.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

// 4️⃣ REMOVE FRIEND
exports.removeFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = parseInt(req.params.friendId);

    await prisma.friend.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

// 5️⃣ GET FRIEND TASK ACTIVITY
exports.getFriendTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = parseInt(req.params.friendId);

    // Verify friendship
    const isFriend = await prisma.friend.findFirst({
      where: {
        userId,
        friendId,
        status: "ACCEPTED",
      },
    });

    if (!isFriend) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const completed = await prisma.task.findMany({
      where: {
        userId: friendId,
        status: "Completed",
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 10, // Limit to recent 10
    });

    const upcoming = await prisma.task.findMany({
      where: {
        userId: friendId,
        status: { in: ["Pending", "In Progress"] },
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 10, // Limit to next 10
    });

    res.json({ completed, upcoming });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch friend tasks" });
  }
};