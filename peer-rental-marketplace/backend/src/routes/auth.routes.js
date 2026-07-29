const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  profile,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get("/profile", authMiddleware, profile);

module.exports = router;