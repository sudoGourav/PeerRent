const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/owner", dashboardController.getOwnerDashboard);
router.get("/revenue", dashboardController.getRevenueSummary);

router.get("/recent-bookings", dashboardController.getRecentBookings);

module.exports = router;