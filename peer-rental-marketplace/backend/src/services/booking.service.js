const prisma = require("../prisma/prisma");
const ApiError = require("../utils/ApiError");

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = end.getTime() - start.getTime();

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new ApiError(
      400,
      "End date must be after start date"
    );
  }

  return days;
};

const createBooking = async ({
  itemId,
  renterId,
  startDate,
  endDate,
}) => {

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (!item.available) {
    throw new ApiError(
      400,
      "Item is currently unavailable"
    );
  }

  if (item.ownerId === renterId) {
    throw new ApiError(
      400,
      "You cannot book your own item"
    );
  }

  const overlap = await prisma.booking.findFirst({
    where: {
      itemId,
      status: {
        in: [
          "PENDING",
          "CONFIRMED",
          "ACTIVE",
        ],
      },

      AND: [
        {
          startDate: {
            lte: new Date(endDate),
          },
        },
        {
          endDate: {
            gte: new Date(startDate),
          },
        },
      ],
    },
  });

  if (overlap) {
    throw new ApiError(
      400,
      "Item is already booked for selected dates"
    );
  }

  const numberOfDays = calculateDays(
    startDate,
    endDate
  );

  const totalPrice =
    item.dailyRate * numberOfDays;

  const booking = await prisma.booking.create({
    data: {
      itemId,
      renterId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      numberOfDays,
      totalPrice,
    },

    include: {
      item: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          dailyRate: true,
        },
      },

      renter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return booking;
};
const getMyBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      renterId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          dailyRate: true,
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
    },
  });
};

const getOwnerBookings = async (ownerId) => {
  return await prisma.booking.findMany({
    where: {
      item: {
        ownerId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
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

const getBookingById = async (bookingId, userId) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      item: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isRenter = booking.renterId === userId;
  const isOwner = booking.item.ownerId === userId;

  if (!isRenter && !isOwner) {
    throw new ApiError(
      403,
      "You are not authorised to view this booking"
    );
  }

  return booking;
};
const updateBookingStatus = async (
  bookingId,
  ownerId,
  status
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      item: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.item.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You are not authorised to update this booking"
    );
  }

  const allowedStatuses = [
    "CONFIRMED",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid booking status");
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
    include: {
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      item: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          dailyRate: true,
        },
      },
    },
  });

  return updatedBooking;
};

const cancelBooking = async (
  bookingId,
  renterId
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.renterId !== renterId) {
    throw new ApiError(
      403,
      "You are not authorised to cancel this booking"
    );
  }

  if (
    booking.status === "COMPLETED" ||
    booking.status === "CANCELLED"
  ) {
    throw new ApiError(
      400,
      "Booking cannot be cancelled"
    );
  }

  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });
};



module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};