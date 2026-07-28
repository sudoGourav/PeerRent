const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/item.routes");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");

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
app.use(errorMiddleware);

module.exports = app;