const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../middleware/asyncHandler");

exports.getOwnerDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getOwnerDashboard(
    req.user.id
  );

  res.json({
    success: true,
    data: dashboard,
  });
});

exports.getRevenueSummary = asyncHandler(async (req, res) => {
  const revenue = await dashboardService.getRevenueSummary(req.user.id);

  res.json({
    success: true,
    data: revenue,
  });
});

exports.getRecentBookings = asyncHandler(async (req, res) => {
  const bookings = await dashboardService.getRecentBookings(req.user.id);

  res.json({
    success: true,
    data: bookings,
  });
});