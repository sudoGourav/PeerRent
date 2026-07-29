const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");
const {
  createNotification,
} = require("./notification.service");

const createReview = async (userId, data) => {
  const { itemId, rating, comment } = data;

  const item = await prisma.item.findUnique({
  where: {
    id: itemId,
  },
  include: {
    owner: {
      select: {
        id: true,
      },
    },
  },
});

  if (!item) {
    throw new ApiError(404, "Item not found");
  }
  const booking = await prisma.booking.findFirst({
  where: {
    renterId: userId,
    itemId,
    status: "COMPLETED",
  },
});

if (!booking) {
  throw new ApiError(
    403,
    "You can only review items after completing a booking."
  );
}
if (item.ownerId === userId) {
  throw new ApiError(
    403,
    "You cannot review your own item."
  );
}

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  if (existingReview) {
    throw new ApiError(
      400,
      "You have already reviewed this item."
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      userId,
      itemId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  try {
  await createNotification({
    userId: item.owner.id,
    title: "New Review Received",
    message: `${review.user.name} left a ${review.rating}-star review for your item.`,
    type: "REVIEW",
  });
} catch (error) {
  console.error(
    "Failed to create review notification:",
    error.message
  );
}

  return review;
};

const getItemReviews = async (itemId) => {
  const reviews = await prisma.review.findMany({
    where: {
      itemId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const aggregate = await prisma.review.aggregate({
    where: {
      itemId,
    },

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },
  });

  return {
    reviews,
    averageRating: aggregate._avg.rating || 0,
    totalReviews: aggregate._count.rating,
  };
};

module.exports = {
  createReview,
  getItemReviews,
};