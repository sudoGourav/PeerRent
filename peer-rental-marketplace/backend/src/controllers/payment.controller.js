const paymentService = require("../services/payment.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const order = await paymentService.createOrder(
    bookingId,
    req.user.id
  );

  res.json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  const booking = await paymentService.verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: "Payment verified successfully",
    data: booking,
  });
});