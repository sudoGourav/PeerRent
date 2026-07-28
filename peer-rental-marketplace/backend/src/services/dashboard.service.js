const prisma = require("../prisma/prisma");

const getOwnerDashboard = async (ownerId) => {
  const totalItems = await prisma.item.count({
    where: {
      ownerId,
    },
  });

  const totalBookings = await prisma.booking.count({
    where: {
      item: {
        ownerId,
      },
    },
  });

  const activeBookings = await prisma.booking.count({
    where: {
      item: {
        ownerId,
      },
      status: "ACTIVE",
    },
  });

  const pendingBookings = await prisma.booking.count({
    where: {
      item: {
        ownerId,
      },
      status: "PENDING",
    },
  });

  const completedBookings = await prisma.booking.count({
    where: {
      item: {
        ownerId,
      },
      status: "COMPLETED",
    },
  });

  return {
    totalItems,
    totalBookings,
    activeBookings,
    pendingBookings,
    completedBookings,
  };
};
const getRevenueSummary = async (ownerId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      item: {
        ownerId,
      },
      paymentStatus: "PAID",
    },
    select: {
      totalPrice: true,
      status: true,
      createdAt: true,
    },
  });

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );

  const completedRevenue = bookings
    .filter((booking) => booking.status === "COMPLETED")
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  const pendingRevenue = bookings
    .filter((booking) => booking.status !== "COMPLETED")
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  return {
    totalRevenue,
    completedRevenue,
    pendingRevenue,
    totalPaidBookings: bookings.length,
  };
};

const getRecentBookings = async (ownerId) => {
  return await prisma.booking.findMany({
    where: {
      item: {
        ownerId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      item: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
  });
};

module.exports = {
  getOwnerDashboard,
  getRevenueSummary,
  getRecentBookings,
};