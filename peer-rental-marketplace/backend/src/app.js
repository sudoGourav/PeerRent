const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const bookingRoutes = require("./routes/booking.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentRoutes = require("./routes/payment.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PeerRent API Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

// Always last
app.use(errorMiddleware);

module.exports = app;