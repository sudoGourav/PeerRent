const authService = require("../services/auth.service");
const prisma = require("../prisma/prisma");
const asyncHandler = require("../middleware/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  const result = await authService.registerUser({
    name,
    email,
    password,
    phone,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

exports.profile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
});