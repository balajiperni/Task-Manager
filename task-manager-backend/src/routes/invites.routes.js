const express = require("express");
const router = express.Router();

const {
  getMyInvites,
  acceptInviteFromInbox,
  rejectInvite,
} = require("../controllers/invites.controller");

const authMiddleware = require("../middleware/auth.middleware");

// All invite inbox routes are protected
router.use(authMiddleware);

// Get my invite inbox
router.get("/", getMyInvites);

// Accept invite from inbox
router.post("/:inviteId/accept", acceptInviteFromInbox);

// Reject invite
router.post("/:inviteId/reject", rejectInvite);

module.exports = router;