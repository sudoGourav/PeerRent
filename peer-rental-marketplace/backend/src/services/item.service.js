const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");

const createItem = async ({
  title,
  description,
  dailyRate,
  deposit,
  categoryId,
  ownerId,
  imageUrl,
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
    imageUrl,
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

const getAllItems = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    available: true,
  };

  // Search
  if (query.search) {
    where.title = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  // Category Filter
  if (query.category) {
    where.categoryId = query.category;
  }

  // Sorting
  let orderBy = {
    createdAt: "desc",
  };

  if (query.sort === "price_asc") {
    orderBy = {
      dailyRate: "asc",
    };
  }

  if (query.sort === "price_desc") {
    orderBy = {
      dailyRate: "desc",
    };
  }

  const [items, totalItems] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
    }),

    prisma.item.count({
      where,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
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

const getMyItems = async (ownerId) => {
  return prisma.item.findMany({
    where: {
      ownerId,
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


const updateItem = async (itemId, ownerId, data) => {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You are not authorised to update this item"
    );
  }

  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const updatedItem = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      title: data.title,
      description: data.description,
      dailyRate: Number(data.dailyRate),
      deposit: Number(data.deposit),
      categoryId: data.categoryId,

      // Keep the old image if no new one was uploaded
      imageUrl: data.imageUrl || item.imageUrl,
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

  return updatedItem;
};
const deleteItem = async (itemId, ownerId) => {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId !== ownerId) {
    throw new ApiError(403, "You are not authorised to delete this item");
  }

  await prisma.item.delete({
    where: {
      id: itemId,
    },
  });

  return;
};

module.exports = {
  createItem,
  getAllItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
};