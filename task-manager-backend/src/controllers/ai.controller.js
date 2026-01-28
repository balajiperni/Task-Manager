const prisma = require("../config/prisma");
const axios = require("axios");
const { logAudit } = require("../utils/auditLogger");

exports.generateAndSaveSubtasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { parentTaskId, description } = req.body;

    if (!parentTaskId || !description) {
      return res.status(400).json({
        message: "parentTaskId and description are required"
      });
    }

    // 1️⃣ Fetch parent task
    const parentTask = await prisma.task.findUnique({
      where: { id: Number(parentTaskId) }
    });

    if (!parentTask || parentTask.isDeleted) {
      return res.status(404).json({ message: "Parent task not found" });
    }

    // 2️⃣ Permission check (owner OR collaborator)
    const isCollaborator = await prisma.taskCollaborator.findFirst({
      where: {
        taskId: parentTask.id,
        userId
      }
    });

    if (parentTask.userId !== userId && !isCollaborator) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3️⃣ Call AI service
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a project manager. Break the task into clear, actionable subtasks. Return only a numbered list."
          },
          {
            role: "user",
            content: description
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const rawText = aiResponse.data.choices[0].message.content;

    // 4️⃣ Parse subtasks safely
    const subtasks = rawText
      .split("\n")
      .map(line => line.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean);

    if (subtasks.length === 0) {
      return res.status(400).json({ message: "No subtasks generated" });
    }

    // 5️⃣ Save subtasks
    const createdSubtasks = await prisma.task.createMany({
      data: subtasks.map(title => ({
        title,
        userId: parentTask.userId, // owner stays same
        parentTaskId: parentTask.id,
        priority: parentTask.priority
      }))
    });

    // 6️⃣ Audit log
    await logAudit({
      userId,
      taskId: parentTask.id,
      action: "SUBTASKS_AUTO_GENERATED"
    });

    res.status(201).json({
      message: "Subtasks generated and saved",
      count: createdSubtasks.count,
      subtasks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate and save subtasks"
    });
  }
};

