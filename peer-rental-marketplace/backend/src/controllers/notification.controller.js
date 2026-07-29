const asyncHandler = require("../middleware/asyncHandler");
const notificationService = require("../services/notification.service");

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications =
    await notificationService.getNotifications(
      req.user.id,
      req.query.limit
    );

  res.json({
    success: true,
    data: notifications,
  });
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count =
    await notificationService.getUnreadCount(req.user.id);

  res.json({
    success: true,
    data: {
      unreadCount: count,
    },
  });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(
    req.params.id,
    req.user.id
  );

  res.json({
    success: true,
    message: "Notification marked as read",
  });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);

  res.json({
    success: true,
    message: "All notifications marked as read",
  });
});