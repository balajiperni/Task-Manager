const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const auditRoutes = require("./routes/audit.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const friendsRoutes = require("./routes/friends.routes");
const inviteRoutes = require("./routes/invites.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/invites", inviteRoutes);
app.get("/", (req, res) => res.send("Task Manager API Running"));

module.exports = app;
