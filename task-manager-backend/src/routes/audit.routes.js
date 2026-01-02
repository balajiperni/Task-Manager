const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { getAuditLogs } = require("../controllers/audit.controller");

router.get("/", auth, getAuditLogs);

module.exports = router;
