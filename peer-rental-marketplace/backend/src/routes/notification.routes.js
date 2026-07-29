const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

router.use(authMiddleware);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/:id/read", markAsRead);

router.patch("/read-all", markAllAsRead);

module.exports = router;