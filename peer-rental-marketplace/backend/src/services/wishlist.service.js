const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");

const addToWishlist = async (userId, itemId) => {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  if (existing) {
    throw new ApiError(400, "Item already in wishlist");
  }

  return await prisma.wishlist.create({
    data: {
      userId,
      itemId,
    },
    include: {
      item: {
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const getWishlist = async (userId) => {
  return await prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      item: {
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const removeFromWishlist = async (userId, itemId) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  if (!wishlist) {
    throw new ApiError(404, "Item not found in wishlist");
  }

  await prisma.wishlist.delete({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  return {
    message: "Item removed from wishlist",
  };
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};