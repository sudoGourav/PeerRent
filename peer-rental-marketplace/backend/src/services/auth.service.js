const prisma = require("../prisma/prisma");
const {
  hashPassword,
  comparePassword,
} = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

const crypto = require("crypto");
const { sendPasswordResetEmail } = require("./email.service");



const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};
const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return {
      message:
        "If an account exists, a password reset email has been sent.",
    };
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash before storing
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Expiry: 15 minutes
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });
  } catch (error) {
    console.error(
      "Password reset email failed:",
      error.message
    );
  }

  return {
    message:
      "If an account exists, a password reset email has been sent.",
  };
};

const resetPassword = async (token, newPassword) => {
  // Hash the token received from the URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find a user with a valid, non-expired token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset fields
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return {
    message: "Password updated successfully.",
  };
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};