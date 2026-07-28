const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", bookingController.createBooking);

router.get("/my", bookingController.getMyBookings);

router.get("/owner", bookingController.getOwnerBookings);

router.get("/:id", bookingController.getBookingById);

router.patch("/:id/status", bookingController.updateBookingStatus);

router.patch("/:id/cancel", bookingController.cancelBooking);

module.exports = router;