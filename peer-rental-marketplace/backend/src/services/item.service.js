const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");

const createItem = async ({
  title,
  description,
  dailyRate,
  deposit,
  categoryId,
  ownerId,
}) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const item = await prisma.item.create({
  data: {
    title,
    description,
    dailyRate: Number(dailyRate),
    deposit: Number(deposit),
    categoryId,
    ownerId,
  },
  select: {
    id: true,
    title: true,
    description: true,
    dailyRate: true,
    deposit: true,
    imageUrl: true,
    available: true,
    createdAt: true,
    updatedAt: true,
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
        icon: true,
      },
    },
  },
});
  return item;
};

const getAllItems = async () => {
  return await prisma.item.findMany({
    where: {
      available: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      dailyRate: true,
      deposit: true,
      imageUrl: true,
      available: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  });
};

const getItemById = async (id) => {
  const item = await prisma.item.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      dailyRate: true,
      deposit: true,
      imageUrl: true,
      available: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  return item;
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
};