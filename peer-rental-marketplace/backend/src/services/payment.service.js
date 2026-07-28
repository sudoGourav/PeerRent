const crypto = require("crypto");
const prisma = require("../prisma/prisma");
const razorpay = require("../config/razorpay");
const ApiError = require("../utils/ApiError");

const createOrder = async (bookingId, userId) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      item: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  console.log("===== PAYMENT DEBUG =====");
console.log("Booking ID:", booking.id);
console.log("Booking renterId:", booking.renterId);
console.log("JWT userId:", userId);
console.log("Booking status:", booking.status);
console.log("Payment status:", booking.paymentStatus);
console.log("=========================");
  if (booking.renterId !== userId) {
    throw new ApiError(403, "You are not authorised");
  }

  if (booking.paymentStatus === "PAID") {
    throw new ApiError(400, "Booking is already paid");
  }

  const options = {
    amount: Math.round(booking.totalPrice * 100), // paise
    currency: "INR",
    receipt: booking.id,
    notes: {
      bookingId: booking.id,
      itemTitle: booking.item.title,
    },
  };

  try {
  console.log("Creating Razorpay order with:", options);

  const order = await razorpay.orders.create(options);

  return {
    order,
    booking,
    key: process.env.RAZORPAY_KEY_ID,
  };
} catch (error) {
  console.error("Razorpay Error:", error);

  throw new ApiError(
    error.statusCode || 500,
    error.error?.description ||
      error.message ||
      "Failed to create Razorpay order"
  );
}
};
const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  bookingId,
  userId,
}) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.renterId !== userId) {
    throw new ApiError(
      403,
      "You are not authorised"
    );
  }

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(
      400,
      "Payment verification failed"
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      paymentStatus: "PAID",
    },
    include: {
      item: true,
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedBooking;
};


module.exports = {
  createOrder,
  verifyPayment,
};