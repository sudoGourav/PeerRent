const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
};