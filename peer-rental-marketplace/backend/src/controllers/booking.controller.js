const bookingService = require("../services/booking.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createBooking = asyncHandler(async (req, res) => {
  const { itemId, startDate, endDate } = req.body;

  if (!itemId || !startDate || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  const booking = await bookingService.createBooking({
    itemId,
    renterId: req.user.id,
    startDate,
    endDate,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.id);

  res.json({
    success: true,
    data: bookings,
  });
});

exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getOwnerBookings(req.user.id);

  res.json({
    success: true,
    data: bookings,
  });
});

exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user.id
  );

  res.json({
    success: true,
    data: booking,
  });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    req.user.id,
    status
  );

  res.json({
    success: true,
    message: "Booking status updated",
    data: booking,
  });
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user.id
  );

  res.json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});