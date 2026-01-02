const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  getTaskAnalytics,
  getDashboardAnalytics
} = require("../controllers/analytics.controller");

router.get("/", auth, getTaskAnalytics);
router.get("/dashboard", auth, getDashboardAnalytics);

module.exports = router;
