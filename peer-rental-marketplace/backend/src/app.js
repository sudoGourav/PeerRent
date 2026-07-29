const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const bookingRoutes = require("./routes/booking.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routes");
const categoryRoutes = require("./routes/category.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const notificationRoutes = require("./routes/notification.routes");
const testRoutes = require("./routes/test.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 PeerRent API is running successfully!",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test", testRoutes);

// Global Error Handler (Always Last)
app.use(errorMiddleware);

module.exports = app;