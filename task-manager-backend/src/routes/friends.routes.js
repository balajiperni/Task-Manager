const express = require("express");
const router = express.Router();

const {
  inviteFriend,
  acceptInvite,
  getFriends,
  removeFriend,
  getFriendTasks,
} = require("../controllers/friends.controller");

const authMiddleware = require("../middleware/auth.middleware");

// All routes are protected
router.use(authMiddleware);

// Invite a friend (email / link)
router.post("/invite", inviteFriend);

// Accept invite using token
router.post("/accept/:token", acceptInvite);

// Get friends list
router.get("/", getFriends);

// Remove a friend
router.delete("/:friendId", removeFriend);

// Get a friend's task activity
router.get("/:friendId/tasks", getFriendTasks);

module.exports = router;
