const prisma = require("../prisma/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

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

module.exports = {
  registerUser,
  loginUser,
};